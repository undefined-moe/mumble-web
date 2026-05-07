'use client'

import { useMumble } from './VoiceProvider'

export interface SettingsState {
  vadThreshold: number
  vadHoldTimeMs: number
  opusBitrate: number
  jitterBufferFrames: number
  uplinkCongestionControlEnabled: boolean
  uplinkMaxBufferedAmountBytes: number
  micEchoCancellation: boolean
  micNoiseSuppression: boolean
  micAutoGainControl: boolean
  rnnoiseEnabled: boolean
  selectedInputDeviceId: string | null
  pttKey: string
  voiceMode: 'vad' | 'ptt'
}

export interface SettingsActions {
  setVadThreshold: (val: number) => void
  setVadHoldTimeMs: (val: number) => void
  setOpusBitrate: (bitrate: number) => void
  setJitterBufferFrames: (frames: number) => void
  setUplinkCongestionControlEnabled: (enabled: boolean) => void
  setUplinkMaxBufferedAmountBytes: (bytes: number) => void
  setMicEchoCancellation: (val: boolean) => void
  setMicNoiseSuppression: (val: boolean) => void
  setMicAutoGainControl: (val: boolean) => void
  setRnnoiseEnabled: (val: boolean) => void
  setSelectedInputDeviceId: (deviceId: string | null) => void
  setPttKey: (key: string) => void
  setVoiceMode: (mode: 'vad' | 'ptt') => void
}

export interface SettingsProps {
  children: (state: SettingsState, actions: SettingsActions) => React.ReactNode
}

export function Settings({ children }: SettingsProps) {
  const { useStore } = useMumble()

  const state: SettingsState = {
    vadThreshold: useStore(s => s.vadThreshold),
    vadHoldTimeMs: useStore(s => s.vadHoldTimeMs),
    opusBitrate: useStore(s => s.opusBitrate),
    jitterBufferFrames: useStore(s => s.jitterBufferFrames),
    uplinkCongestionControlEnabled: useStore(s => s.uplinkCongestionControlEnabled),
    uplinkMaxBufferedAmountBytes: useStore(s => s.uplinkMaxBufferedAmountBytes),
    micEchoCancellation: useStore(s => s.micEchoCancellation),
    micNoiseSuppression: useStore(s => s.micNoiseSuppression),
    micAutoGainControl: useStore(s => s.micAutoGainControl),
    rnnoiseEnabled: useStore(s => s.rnnoiseEnabled),
    selectedInputDeviceId: useStore(s => s.selectedInputDeviceId),
    pttKey: useStore(s => s.pttKey),
    voiceMode: useStore(s => s.voiceMode),
  }

  const actions: SettingsActions = {
    setVadThreshold: useStore(s => s.setVadThreshold),
    setVadHoldTimeMs: useStore(s => s.setVadHoldTimeMs),
    setOpusBitrate: useStore(s => s.setOpusBitrate),
    setJitterBufferFrames: useStore(s => s.setJitterBufferFrames),
    setUplinkCongestionControlEnabled: useStore(s => s.setUplinkCongestionControlEnabled),
    setUplinkMaxBufferedAmountBytes: useStore(s => s.setUplinkMaxBufferedAmountBytes),
    setMicEchoCancellation: useStore(s => s.setMicEchoCancellation),
    setMicNoiseSuppression: useStore(s => s.setMicNoiseSuppression),
    setMicAutoGainControl: useStore(s => s.setMicAutoGainControl),
    setRnnoiseEnabled: useStore(s => s.setRnnoiseEnabled),
    setSelectedInputDeviceId: useStore(s => s.setSelectedInputDeviceId),
    setPttKey: useStore(s => s.setPttKey),
    setVoiceMode: useStore(s => s.setVoiceMode),
  }

  return <>{children(state, actions)}</>
}
