'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGatewayStore } from '../../src/state/gateway-store'
import { VoiceEngine } from '../../src/audio/voice-engine'
import { canUseWebCodecsOpus, createWebCodecsOpusDecoder, createWebCodecsOpusEncoder } from '../../src/audio/webcodecs-opus'
import { Rnnoise, type DenoiseState } from '@shiguredo/rnnoise-wasm'
import { isPipSupported } from '../../components/ui/overlay-panel'

import { useState } from 'react'
import { MetricsPanel } from '../../components/ui/metrics-panel'
import { SettingsDialog } from '../../components/ui/settings-dialog'
import { OverlayPanel } from '../../components/ui/overlay-panel'
import { TopBar } from './_components/top-bar'
import { ChannelSidebar } from './_components/channel-sidebar'
import { ChatPanel } from './_components/chat-panel'
import { UserListSidebar } from './_components/user-list-sidebar'
import { VoiceControlBar } from './_components/voice-control-bar'
import { DisconnectedView } from './_components/disconnected-view'

const pipAvailable = isPipSupported()

export default function AppPage() {
  const router = useRouter()
  const status = useGatewayStore(s => s.status)
  const init = useGatewayStore(s => s.init)
  const disconnect = useGatewayStore(s => s.disconnect)
  const setVoiceSink = useGatewayStore(s => s.setVoiceSink)
  const sendMicOpus = useGatewayStore(s => s.sendMicOpus)
  const sendMicEnd = useGatewayStore(s => s.sendMicEnd)
  const opusBitrate = useGatewayStore(s => s.opusBitrate)
  const rnnoiseEnabled = useGatewayStore(s => s.rnnoiseEnabled)

  const [showMetricsPanel, setShowMetricsPanel] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const voiceRef = useRef<VoiceEngine | null>(null)
  const rnnoiseRef = useRef<{ state: DenoiseState; frameSize: number; buf: Float32Array } | null>(null)

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (status === 'idle') {
      router.replace('/')
    }
  }, [status, router])

  useEffect(() => {
    if (!rnnoiseEnabled) {
      rnnoiseRef.current?.state.destroy()
      rnnoiseRef.current = null
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        const rnnoise = await Rnnoise.load()
        if (cancelled) return
        const state = rnnoise.createDenoiseState()
        if (cancelled) {
          state.destroy()
          return
        }
        rnnoiseRef.current?.state.destroy()
        rnnoiseRef.current = { state, frameSize: rnnoise.frameSize, buf: new Float32Array(rnnoise.frameSize) }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[voice] failed to init RNNoise: ${String(e)}`)
      }
    })()

    return () => {
      cancelled = true
      rnnoiseRef.current?.state.destroy()
      rnnoiseRef.current = null
    }
  }, [rnnoiseEnabled])

  useEffect(() => {
    const decoders = new Map<number, ReturnType<typeof createWebCodecsOpusDecoder>>()

    let encoder: ReturnType<typeof createWebCodecsOpusEncoder> | null = null
    if (canUseWebCodecsOpus()) {
      try {
        encoder = createWebCodecsOpusEncoder({
          sampleRate: 48000,
          channels: 1,
          bitrate: opusBitrate,
          onOpus: (opus) => sendMicOpus(opus, { target: 0 })
        })
      } catch (e) {
        console.warn(`[voice] failed to init WebCodecs Opus encoder: ${String(e)}`)
      }
    }

    let lastPlaybackStatsMs = 0
    let lastCaptureStatsMs = 0

    const engine = new VoiceEngine({
      onMicPcm: (pcm, sampleRate) => {
        if (sampleRate !== 48000) return

        const rn = rnnoiseRef.current
        if (rn) {
          try {
            const scale = 32768
            const invScale = 1 / scale
            const { state, frameSize, buf } = rn

            for (let offset = 0; offset + frameSize <= pcm.length; offset += frameSize) {
              buf.set(pcm.subarray(offset, offset + frameSize))

              for (let i = 0; i < frameSize; i++) {
                const v = (buf[i] ?? 0) * scale
                buf[i] = v > 32767 ? 32767 : v < -32768 ? -32768 : v
              }

              state.processFrame(buf)

              for (let i = 0; i < frameSize; i++) {
                const v = (buf[i] ?? 0) * invScale
                pcm[offset + i] = v > 1 ? 1 : v < -1 ? -1 : v
              }
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(`[voice] rnnoise process failed: ${String(e)}`)
          }
        }

        encoder?.encode(pcm)
      },
      onMicEnd: () => {
        if (!encoder) {
          sendMicEnd()
          return
        }
        encoder
          .flush()
          .catch(() => {})
          .finally(() => sendMicEnd())
      },
      onPlaybackStats: (s) => {
        const now = performance.now()
        if (now - lastPlaybackStatsMs < 200) return
        lastPlaybackStatsMs = now
        useGatewayStore.getState().setPlaybackStats(s)
      },
      onCaptureStats: (s) => {
        const now = performance.now()
        if (now - lastCaptureStatsMs < 100) return
        lastCaptureStatsMs = now
        useGatewayStore.getState().setCaptureStats(s)
      }
    })
    voiceRef.current = engine

    engine.setMode(useGatewayStore.getState().voiceMode)
    engine.setVadThreshold(useGatewayStore.getState().vadThreshold)
    engine.setVadHoldTime(useGatewayStore.getState().vadHoldTimeMs)

    setVoiceSink((frame) => {
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
          console.warn(`[voice] failed to init WebCodecs Opus decoder: ${String(e)}`)
          return
        }
        decoders.set(frame.userId, dec)
      }

      dec.decode(frame.opus)
    })

    return () => {
      setVoiceSink(null)
      engine.disableMic()
      encoder?.close()
      for (const dec of decoders.values()) dec.close()
    }
  }, [sendMicEnd, sendMicOpus, setVoiceSink, opusBitrate])

  if (status !== 'connected') {
    return <DisconnectedView />
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar
        pipAvailable={pipAvailable}
        showOverlay={showOverlay}
        onShowMetrics={() => setShowMetricsPanel(true)}
        onShowSettings={() => setShowSettings(true)}
        onToggleOverlay={() => setShowOverlay(v => !v)}
        onDisconnect={disconnect}
      />

      <div className="flex flex-1 overflow-hidden">
        <ChannelSidebar />
        <ChatPanel />
        <UserListSidebar />
      </div>

      <VoiceControlBar voiceRef={voiceRef} />

      {showMetricsPanel && (
        <MetricsPanelWrapper
          onOpenChange={setShowMetricsPanel}
        />
      )}

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />

      <OverlayPanel
        open={showOverlay}
        onOpenChange={setShowOverlay}
      />
    </div>
  )
}

function MetricsPanelWrapper({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const metrics = useGatewayStore(s => s.metrics)
  const playbackStats = useGatewayStore(s => s.playbackStats)
  const captureStats = useGatewayStore(s => s.captureStats)

  return (
    <MetricsPanel
      metrics={metrics}
      playbackStats={playbackStats}
      captureStats={captureStats}
      open
      onOpenChange={onOpenChange}
    />
  )
}
