'use client'

import { useEffect, useState } from 'react'
import { useMumble } from './VoiceProvider'
import { canUseWebCodecsOpus } from '../audio/webcodecs-opus'
import type { VoiceEngine } from '../audio/voice-engine'

export interface VoiceState {
  micEnabled: boolean
  muted: boolean
  voiceMode: 'vad' | 'ptt'
  captureSending: boolean
  captureRms: number | null
  playbackBufferMs: number | null
  jitterMs: number
  webCodecsAvailable: boolean
  connected: boolean
}

export interface VoiceActions {
  toggleMic: () => Promise<void>
  toggleMute: () => void
  setVoiceMode: (mode: 'vad' | 'ptt') => void
  setPttActive: (active: boolean) => void
  enableAudio: () => void
}

export interface VoiceControlProps {
  children: (state: VoiceState, actions: VoiceActions) => React.ReactNode
}

export function VoiceControl({ children }: VoiceControlProps) {
  const { useStore, voiceRef } = useMumble()
  const status = useStore(s => s.status)
  const voiceMode = useStore(s => s.voiceMode)
  const setVoiceModeFn = useStore(s => s.setVoiceMode)
  const micEchoCancellation = useStore(s => s.micEchoCancellation)
  const micNoiseSuppression = useStore(s => s.micNoiseSuppression)
  const micAutoGainControl = useStore(s => s.micAutoGainControl)
  const selectedInputDeviceId = useStore(s => s.selectedInputDeviceId)
  const vadThreshold = useStore(s => s.vadThreshold)
  const vadHoldTimeMs = useStore(s => s.vadHoldTimeMs)
  const jitterBufferFrames = useStore(s => s.jitterBufferFrames)
  const playbackTotalQueuedMs = useStore(s => s.playbackStats?.totalQueuedMs ?? null)
  const captureRms = useStore(s => s.captureStats?.rms ?? null)
  const captureSending = useStore(s => s.captureStats?.sending ?? false)
  const voiceDownlinkJitterMs = useStore(s => s.metrics.voiceDownlinkJitterMs)

  const [micEnabled, setMicEnabled] = useState(false)
  const [muted, setMuted] = useState(false)
  const webCodecsAvailable = canUseWebCodecsOpus()
  const connected = status === 'connected'

  useEffect(() => {
    if (connected) {
      voiceRef.current?.enableAudio()
    } else {
      voiceRef.current?.disableMic()
      setMicEnabled(false)
    }
  }, [connected, voiceRef])

  useEffect(() => { voiceRef.current?.setMode(voiceMode) }, [voiceMode, voiceRef])
  useEffect(() => { voiceRef.current?.setVadThreshold(vadThreshold) }, [vadThreshold, voiceRef])
  useEffect(() => { voiceRef.current?.setVadHoldTime(vadHoldTimeMs) }, [vadHoldTimeMs, voiceRef])
  useEffect(() => { voiceRef.current?.setJitterBufferFrames(jitterBufferFrames) }, [jitterBufferFrames, voiceRef])

  useEffect(() => {
    if (!micEnabled) return
    const options: Parameters<VoiceEngine['switchDevice']>[0] = {
      echoCancellation: micEchoCancellation,
      noiseSuppression: micNoiseSuppression,
      autoGainControl: micAutoGainControl,
    }
    if (selectedInputDeviceId != null) options.deviceId = selectedInputDeviceId
    voiceRef.current?.switchDevice(options).catch((e) => {
      console.warn(`[mumble-sdk] switchDevice failed: ${e}`)
    })
  }, [micEnabled, micEchoCancellation, micNoiseSuppression, micAutoGainControl, selectedInputDeviceId, voiceRef])

  const state: VoiceState = {
    micEnabled,
    muted,
    voiceMode,
    captureSending,
    captureRms,
    playbackBufferMs: playbackTotalQueuedMs,
    jitterMs: voiceDownlinkJitterMs ?? 0,
    webCodecsAvailable,
    connected,
  }

  const actions: VoiceActions = {
    toggleMic: async () => {
      if (micEnabled) {
        voiceRef.current?.disableMic()
        setMicEnabled(false)
      } else {
        const options: Parameters<VoiceEngine['enableMic']>[0] = {
          echoCancellation: micEchoCancellation,
          noiseSuppression: micNoiseSuppression,
          autoGainControl: micAutoGainControl,
        }
        if (selectedInputDeviceId != null) options.deviceId = selectedInputDeviceId
        await voiceRef.current?.enableMic(options)
        setMicEnabled(true)
      }
    },
    toggleMute: () => {
      const newMuted = !muted
      setMuted(newMuted)
      voiceRef.current?.setMuted(newMuted)
    },
    setVoiceMode: setVoiceModeFn,
    setPttActive: (active) => voiceRef.current?.setPttActive(active),
    enableAudio: () => voiceRef.current?.enableAudio(),
  }

  return <>{children(state, actions)}</>
}
