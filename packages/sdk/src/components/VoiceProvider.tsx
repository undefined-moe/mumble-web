'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { type StoreApi, type UseBoundStore } from 'zustand'
import { createGatewayStore, type GatewayStore, type CreateGatewayStoreOptions } from '../gateway-store'
import { VoiceEngine } from '../audio/voice-engine'
import { canUseWebCodecsOpus, createWebCodecsOpusDecoder, createWebCodecsOpusEncoder } from '../audio/webcodecs-opus'

export interface MumbleContextValue {
  useStore: UseBoundStore<StoreApi<GatewayStore>>
  voiceRef: React.RefObject<VoiceEngine | null>
}

const MumbleContext = createContext<MumbleContextValue | null>(null)

export function useMumble(): MumbleContextValue {
  const ctx = useContext(MumbleContext)
  if (!ctx) throw new Error('useMumble must be used within <VoiceProvider>')
  return ctx
}

export function useMumbleStore(): UseBoundStore<StoreApi<GatewayStore>> {
  return useMumble().useStore
}

export interface VoiceProviderProps extends CreateGatewayStoreOptions {
  children: ReactNode
  /** Optional RNNoise process callback for denoising */
  rnnoiseProcessor?: ((pcm: Float32Array) => void) | null
}

export function VoiceProvider({ children, rnnoiseProcessor, ...storeOptions }: VoiceProviderProps) {
  const storeRef = useRef<UseBoundStore<StoreApi<GatewayStore>> | null>(null)
  if (!storeRef.current) {
    storeRef.current = createGatewayStore(storeOptions)
  }
  const useStore = storeRef.current

  const voiceRef = useRef<VoiceEngine | null>(null)
  const rnnoiseRef = useRef(rnnoiseProcessor ?? null)
  rnnoiseRef.current = rnnoiseProcessor ?? null

  const opusBitrate = useStore(s => s.opusBitrate)

  useEffect(() => {
    useStore.getState().init()
  }, [useStore])

  useEffect(() => {
    const store = useStore
    const decoders = new Map<number, ReturnType<typeof createWebCodecsOpusDecoder>>()

    let encoder: ReturnType<typeof createWebCodecsOpusEncoder> | null = null
    if (canUseWebCodecsOpus()) {
      try {
        encoder = createWebCodecsOpusEncoder({
          sampleRate: 48000,
          channels: 1,
          bitrate: opusBitrate,
          onOpus: (opus) => store.getState().sendMicOpus(opus, { target: 0 })
        })
      } catch (e) {
        console.warn(`[mumble-sdk] failed to init WebCodecs Opus encoder: ${String(e)}`)
      }
    }

    let lastPlaybackStatsMs = 0
    let lastCaptureStatsMs = 0

    const engine = new VoiceEngine({
      onMicPcm: (pcm, sampleRate) => {
        if (sampleRate !== 48000) return
        rnnoiseRef.current?.(pcm)
        encoder?.encode(pcm)
      },
      onMicEnd: () => {
        if (!encoder) {
          store.getState().sendMicEnd()
          return
        }
        encoder
          .flush()
          .catch(() => {})
          .finally(() => store.getState().sendMicEnd())
      },
      onPlaybackStats: (s) => {
        const now = performance.now()
        if (now - lastPlaybackStatsMs < 200) return
        lastPlaybackStatsMs = now
        store.getState().setPlaybackStats(s)
      },
      onCaptureStats: (s) => {
        const now = performance.now()
        if (now - lastCaptureStatsMs < 100) return
        lastCaptureStatsMs = now
        store.getState().setCaptureStats(s)
      }
    })
    voiceRef.current = engine

    engine.setMode(store.getState().voiceMode)
    engine.setVadThreshold(store.getState().vadThreshold)
    engine.setVadHoldTime(store.getState().vadHoldTimeMs)
    engine.setJitterBufferFrames(store.getState().jitterBufferFrames)

    store.getState().setVoiceSink((frame) => {
      if (!canUseWebCodecsOpus()) return
      if (!frame.opus.byteLength) return

      let dec = decoders.get(frame.userId)
      if (!dec) {
        try {
          dec = createWebCodecsOpusDecoder({
            sampleRate: 48000,
            channels: 1,
            onPcm: (pcm) => engine.pushRemotePcm({ userId: frame.userId, channels: 1, sampleRate: 48000, pcm })
          })
        } catch (e) {
          console.warn(`[mumble-sdk] failed to init decoder: ${String(e)}`)
          return
        }
        decoders.set(frame.userId, dec)
      }

      dec.decode(frame.opus)
    })

    return () => {
      store.getState().setVoiceSink(null)
      engine.disableMic()
      encoder?.close()
      for (const dec of decoders.values()) dec.close()
    }
  }, [useStore, opusBitrate])

  const ctx: MumbleContextValue = { useStore, voiceRef }

  return (
    <MumbleContext.Provider value={ctx}>
      {children}
    </MumbleContext.Provider>
  )
}
