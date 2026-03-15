'use client'

import { useEffect, useState, type RefObject } from 'react'
import { useGatewayStore } from '../../../src/state/gateway-store'
import { cn } from '../../../src/ui/cn'
import { Button } from '../../../components/ui/button'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import type { VoiceEngine } from '../../../src/audio/voice-engine'
import { usePttKeyboard, formatKeyLabel } from '../../../src/audio/use-ptt-keyboard'
import { canUseWebCodecsOpus } from '../../../src/audio/webcodecs-opus'

interface VoiceControlBarProps {
  voiceRef: RefObject<VoiceEngine | null>
}

export function VoiceControlBar({ voiceRef }: VoiceControlBarProps) {
  const status = useGatewayStore(s => s.status)
  const voiceMode = useGatewayStore(s => s.voiceMode)
  const setVoiceMode = useGatewayStore(s => s.setVoiceMode)
  const vadThreshold = useGatewayStore(s => s.vadThreshold)
  const vadHoldTimeMs = useGatewayStore(s => s.vadHoldTimeMs)
  const micEchoCancellation = useGatewayStore(s => s.micEchoCancellation)
  const micNoiseSuppression = useGatewayStore(s => s.micNoiseSuppression)
  const micAutoGainControl = useGatewayStore(s => s.micAutoGainControl)
  const selectedInputDeviceId = useGatewayStore(s => s.selectedInputDeviceId)
  const playbackTotalQueuedMs = useGatewayStore(s => s.playbackStats?.totalQueuedMs ?? null)
  const captureRms = useGatewayStore(s => s.captureStats?.rms ?? null)
  const captureSending = useGatewayStore(s => s.captureStats?.sending ?? false)
  const voiceDownlinkJitterMs = useGatewayStore(s => s.metrics.voiceDownlinkJitterMs)

  const pttKey = useGatewayStore(s => s.pttKey)

  const [micEnabled, setMicEnabled] = useState(false)
  const [muted, setMuted] = useState(false)
  const webCodecsAvailable = canUseWebCodecsOpus()

  usePttKeyboard(voiceRef)

  useEffect(() => {
    if (status === 'connected') {
      voiceRef.current?.enableAudio()
    } else {
      voiceRef.current?.disableMic()
      setMicEnabled(false)
    }
  }, [status, voiceRef])

  useEffect(() => {
    voiceRef.current?.setMode(voiceMode)
  }, [voiceMode, voiceRef])

  useEffect(() => {
    voiceRef.current?.setVadThreshold(vadThreshold)
  }, [vadThreshold, voiceRef])

  useEffect(() => {
    voiceRef.current?.setVadHoldTime(vadHoldTimeMs)
  }, [vadHoldTimeMs, voiceRef])

  useEffect(() => {
    if (!micEnabled) return
    const options: Parameters<VoiceEngine['switchDevice']>[0] = {
      echoCancellation: micEchoCancellation,
      noiseSuppression: micNoiseSuppression,
      autoGainControl: micAutoGainControl
    }
    if (selectedInputDeviceId != null) options.deviceId = selectedInputDeviceId

    voiceRef.current?.switchDevice(options).catch((e) => {
      console.warn(`[voice] failed to switch device: ${e}`)
    })
  }, [micEnabled, micEchoCancellation, micNoiseSuppression, micAutoGainControl, selectedInputDeviceId, voiceRef])

  return (
    <footer className="shrink-0 border-t border-border bg-card p-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant={muted ? "destructive" : "secondary"}
            size="sm"
            className="w-32 transition-all"
            onClick={() => {
              const newMuted = !muted
              setMuted(newMuted)
              voiceRef.current?.setMuted(newMuted)
            }}
          >
            {muted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
            {muted ? 'Muted' : 'Unmuted'}
          </Button>

          <div className="h-8 w-[1px] bg-border" />

          <Button
            variant={micEnabled ? (captureSending ? "destructive" : "secondary") : "outline"}
            size="icon"
            disabled={status !== 'connected' || !webCodecsAvailable}
            className={cn("rounded-full h-10 w-10", micEnabled && captureSending && "animate-pulse bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/50")}
            onClick={async () => {
              if (micEnabled) {
                voiceRef.current?.disableMic()
                setMicEnabled(false)
              } else {
                try {
                  const options: Parameters<VoiceEngine['enableMic']>[0] = {
                    echoCancellation: micEchoCancellation,
                    noiseSuppression: micNoiseSuppression,
                    autoGainControl: micAutoGainControl
                  }
                  if (selectedInputDeviceId != null) options.deviceId = selectedInputDeviceId

                  await voiceRef.current?.enableMic(options)
                  setMicEnabled(true)
                } catch (e) {
                  alert(`Failed to access microphone: ${e}`)
                }
              }
            }}
          >
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          {micEnabled && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase text-muted-foreground w-8">Mode</span>
                <div className="flex rounded-md border border-input p-0.5">
                  <button
                    onClick={() => setVoiceMode('vad')}
                    className={cn("px-2 py-0.5 text-[10px] font-medium rounded-sm transition-colors", voiceMode === 'vad' ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
                  >
                    VAD
                  </button>
                  <button
                    onClick={() => setVoiceMode('ptt')}
                    className={cn("px-2 py-0.5 text-[10px] font-medium rounded-sm transition-colors", voiceMode === 'ptt' ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
                  >
                    PTT
                  </button>
                </div>
              </div>

              {voiceMode === 'ptt' && (
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    className="h-6 text-xs"
                    onPointerDown={() => voiceRef.current?.setPttActive(true)}
                    onPointerUp={() => voiceRef.current?.setPttActive(false)}
                    onPointerLeave={() => voiceRef.current?.setPttActive(false)}
                  >
                    Hold to Talk
                  </Button>
                  <kbd className="inline-flex h-5 items-center rounded border border-input bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
                    {formatKeyLabel(pttKey)}
                  </kbd>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col items-end">
            <span>Buffer: {playbackTotalQueuedMs != null ? `${playbackTotalQueuedMs}ms` : '-'}</span>
            <span className="text-[10px] opacity-70">Jitter: {voiceDownlinkJitterMs ?? 0}ms</span>
          </div>
          <div className="h-8 w-[1px] bg-border" />
          <div className="flex flex-col items-end">
            <span>Mic: {captureRms != null ? `${(captureRms * 100).toFixed(1)}%` : '-'}</span>
            <span className="text-[10px] opacity-70">{captureSending ? 'Sending' : 'Silent'}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
