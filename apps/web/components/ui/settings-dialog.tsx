'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { useGatewayStore } from '../../src/state/gateway-store'
import { Mic, Shield, Wifi, AudioWaveform, Keyboard } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { formatKeyLabel } from '../../src/audio/use-ptt-keyboard'
import { useT, format } from '../../src/i18n'

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  if (value < min) return min
  if (value > max) return max
  return value
}

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const t = useT()
  const vadThreshold = useGatewayStore(s => s.vadThreshold)
  const setVadThreshold = useGatewayStore(s => s.setVadThreshold)
  const vadHoldTimeMs = useGatewayStore(s => s.vadHoldTimeMs)
  const setVadHoldTimeMs = useGatewayStore(s => s.setVadHoldTimeMs)
  const opusBitrate = useGatewayStore(s => s.opusBitrate)
  const setOpusBitrate = useGatewayStore(s => s.setOpusBitrate)
  const uplinkCongestionControlEnabled = useGatewayStore(s => s.uplinkCongestionControlEnabled)
  const setUplinkCongestionControlEnabled = useGatewayStore(s => s.setUplinkCongestionControlEnabled)
  const uplinkMaxBufferedAmountBytes = useGatewayStore(s => s.uplinkMaxBufferedAmountBytes)
  const setUplinkMaxBufferedAmountBytes = useGatewayStore(s => s.setUplinkMaxBufferedAmountBytes)
  const micEchoCancellation = useGatewayStore(s => s.micEchoCancellation)
  const setMicEchoCancellation = useGatewayStore(s => s.setMicEchoCancellation)
  const micNoiseSuppression = useGatewayStore(s => s.micNoiseSuppression)
  const setMicNoiseSuppression = useGatewayStore(s => s.setMicNoiseSuppression)
  const micAutoGainControl = useGatewayStore(s => s.micAutoGainControl)
  const setMicAutoGainControl = useGatewayStore(s => s.setMicAutoGainControl)
  const rnnoiseEnabled = useGatewayStore(s => s.rnnoiseEnabled)
  const setRnnoiseEnabled = useGatewayStore(s => s.setRnnoiseEnabled)
  const pttKey = useGatewayStore(s => s.pttKey)
  const setPttKey = useGatewayStore(s => s.setPttKey)
  const selectedInputDeviceId = useGatewayStore(s => s.selectedInputDeviceId)
  const setSelectedInputDeviceId = useGatewayStore(s => s.setSelectedInputDeviceId)

  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([])
  const [recordingPttKey, setRecordingPttKey] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false

    const loadDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        if (cancelled) return
        setAudioInputDevices(devices.filter((d) => d.kind === 'audioinput'))
      } catch {}
    }

    loadDevices()
    navigator.mediaDevices.addEventListener('devicechange', loadDevices)
    return () => {
      cancelled = true
      navigator.mediaDevices.removeEventListener('devicechange', loadDevices)
    }
  }, [open])

  useEffect(() => {
    if (!recordingPttKey) return
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setPttKey(e.key)
      setRecordingPttKey(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [recordingPttKey, setPttKey])

  const uplinkMaxBufferedKb = Math.round(uplinkMaxBufferedAmountBytes / 1024)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.settings.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <AudioWaveform className="h-4 w-4 text-primary" />
                {t.settings.vadTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{t.settings.sensitivity}</div>
                    <div className="text-xs text-muted-foreground">{t.settings.sensitivityDesc}</div>
                  </div>
                  <div className="text-sm font-mono">{(vadThreshold * 100).toFixed(1)}%</div>
                </div>
                <input
                  type="range"
                  min={0.005}
                  max={0.08}
                  step={0.001}
                  value={vadThreshold}
                  onChange={(e) => setVadThreshold(clampNumber(Number(e.target.value), 0.005, 0.08))}
                  className="w-full h-2 accent-primary bg-accent rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{t.settings.holdTime}</div>
                    <div className="text-xs text-muted-foreground">{t.settings.holdTimeDesc}</div>
                  </div>
                  <div className="text-sm font-mono">{vadHoldTimeMs} ms</div>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1000}
                  step={50}
                  value={vadHoldTimeMs}
                  onChange={(e) => setVadHoldTimeMs(clampNumber(Number(e.target.value), 100, 1000))}
                  className="w-full h-2 accent-primary bg-accent rounded-full appearance-none cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Keyboard className="h-4 w-4 text-primary" />
                {t.settings.pttTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">{t.settings.pttKey}</div>
                  <div className="text-xs text-muted-foreground">{t.settings.pttKeyDesc}</div>
                </div>
                <button
                  onClick={() => setRecordingPttKey(true)}
                  className="inline-flex h-8 min-w-[80px] items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-mono transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {recordingPttKey ? (
                    <span className="animate-pulse text-primary">...</span>
                  ) : (
                    formatKeyLabel(pttKey)
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wifi className="h-4 w-4 text-primary" />
                {t.settings.uplinkTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-primary"
                  checked={uplinkCongestionControlEnabled}
                  onChange={(e) => setUplinkCongestionControlEnabled(e.target.checked)}
                />
                <div className="space-y-1">
                  <div className="text-sm font-medium">{t.settings.enableCongestionControl}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.settings.congestionControlDesc}
                  </div>
                </div>
              </label>

              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">{t.settings.maxWsSendBuffer}</div>
                  <div className="text-xs text-muted-foreground">{t.settings.maxWsSendBufferDesc}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-24"
                    inputMode="numeric"
                    value={uplinkMaxBufferedKb}
                    onChange={(e) => {
                      const kb = clampNumber(Number(e.target.value), 32, 4096)
                      setUplinkMaxBufferedAmountBytes(kb * 1024)
                    }}
                  />
                  <span className="text-xs text-muted-foreground">KB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                {t.settings.audioQualityTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{t.settings.opusBitrate}</div>
                    <div className="text-xs text-muted-foreground">{t.settings.opusBitrateDesc}</div>
                  </div>
                  <div className="text-sm font-mono">{Math.round(opusBitrate / 1000)} kbps</div>
                </div>
                <input
                  type="range"
                  min={12000}
                  max={48000}
                  step={1000}
                  value={opusBitrate}
                  onChange={(e) => setOpusBitrate(clampNumber(Number(e.target.value), 12000, 48000))}
                  className="w-full h-2 accent-primary bg-accent rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mic className="h-4 w-4 text-primary" />
                  {t.settings.inputDevice}
                </div>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedInputDeviceId ?? ''}
                  onChange={(e) => setSelectedInputDeviceId(e.target.value || null)}
                >
                  <option value="">{t.settings.defaultDevice}</option>
                   {audioInputDevices.map((d) => (
                     <option key={d.deviceId} value={d.deviceId}>
                       {d.label || format(t.settings.microphoneFallback, { id: d.deviceId.slice(0, 8) })}
                     </option>
                   ))}
                </select>
                {audioInputDevices.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    {t.settings.noDevicesDetected}
                  </div>
                )}
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mic className="h-4 w-4 text-primary" />
                  {t.settings.micProcessing}
                </div>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary"
                    checked={rnnoiseEnabled}
                    onChange={(e) => setRnnoiseEnabled(e.target.checked)}
                  />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{t.settings.rnnoise}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.settings.rnnoiseDesc}
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary"
                    checked={micNoiseSuppression}
                    onChange={(e) => setMicNoiseSuppression(e.target.checked)}
                  />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{t.settings.browserNoiseSuppression}</div>
                    <div className="text-xs text-muted-foreground">{t.settings.browserNoiseSuppressionDesc}</div>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary"
                    checked={micEchoCancellation}
                    onChange={(e) => setMicEchoCancellation(e.target.checked)}
                  />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{t.settings.echoCancellation}</div>
                    <div className="text-xs text-muted-foreground">{t.settings.echoCancellationDesc}</div>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary"
                    checked={micAutoGainControl}
                    onChange={(e) => setMicAutoGainControl(e.target.checked)}
                  />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{t.settings.agc}</div>
                    <div className="text-xs text-muted-foreground">{t.settings.agcDesc}</div>
                  </div>
                </label>
              </div>

              <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                {t.settings.changesApplyNote}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
