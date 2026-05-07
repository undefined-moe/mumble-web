'use client'

import { useState, useEffect } from 'react'
import { Settings as HeadlessSettings, formatKeyLabel } from '@mumble-web/sdk'

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

export interface MumbleSettingsProps {
  open: boolean
  onClose: () => void
  className?: string
}

export function MumbleSettings({ open, onClose, className }: MumbleSettingsProps) {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([])
  const [recordingPttKey, setRecordingPttKey] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    const load = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        if (!cancelled) setAudioInputDevices(devices.filter(d => d.kind === 'audioinput'))
      } catch {}
    }
    load()
    navigator.mediaDevices.addEventListener('devicechange', load)
    return () => { cancelled = true; navigator.mediaDevices.removeEventListener('devicechange', load) }
  }, [open])

  if (!open) return null

  return (
    <HeadlessSettings>
      {(state, actions) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (!recordingPttKey) return
          const onKey = (e: KeyboardEvent) => {
            e.preventDefault()
            e.stopPropagation()
            actions.setPttKey(e.key)
            setRecordingPttKey(false)
          }
          window.addEventListener('keydown', onKey)
          return () => window.removeEventListener('keydown', onKey)
        }, [recordingPttKey])

        return (
          <div className="mw-settings-overlay" onClick={onClose}>
            <div className={`mw-settings ${className ?? ''}`} onClick={e => e.stopPropagation()}>
              <div className="mw-settings-header">
                <h2>Settings</h2>
                <button className="mw-settings-close" onClick={onClose}>&times;</button>
              </div>

              <div className="mw-settings-body">
                {/* VAD */}
                <section className="mw-settings-section">
                  <h3>Voice Activation</h3>
                  <div className="mw-settings-row">
                    <span>Sensitivity</span>
                    <span className="mw-settings-value">{(state.vadThreshold * 100).toFixed(1)}%</span>
                  </div>
                  <input type="range" min={0.005} max={0.08} step={0.001} value={state.vadThreshold}
                    onChange={e => actions.setVadThreshold(clamp(Number(e.target.value), 0.005, 0.08))} className="mw-settings-range" />

                  <div className="mw-settings-row">
                    <span>Hold Time</span>
                    <span className="mw-settings-value">{state.vadHoldTimeMs} ms</span>
                  </div>
                  <input type="range" min={100} max={1000} step={50} value={state.vadHoldTimeMs}
                    onChange={e => actions.setVadHoldTimeMs(clamp(Number(e.target.value), 100, 1000))} className="mw-settings-range" />
                </section>

                {/* PTT */}
                <section className="mw-settings-section">
                  <h3>Push-to-Talk</h3>
                  <div className="mw-settings-row">
                    <span>PTT Key</span>
                    <button className="mw-settings-key-btn" onClick={() => setRecordingPttKey(true)}>
                      {recordingPttKey ? '...' : formatKeyLabel(state.pttKey)}
                    </button>
                  </div>
                </section>

                {/* Audio Quality */}
                <section className="mw-settings-section">
                  <h3>Audio Quality</h3>
                  <div className="mw-settings-row">
                    <span>Opus Bitrate</span>
                    <span className="mw-settings-value">{Math.round(state.opusBitrate / 1000)} kbps</span>
                  </div>
                  <input type="range" min={12000} max={48000} step={1000} value={state.opusBitrate}
                    onChange={e => actions.setOpusBitrate(clamp(Number(e.target.value), 12000, 48000))} className="mw-settings-range" />

                  <div className="mw-settings-row">
                    <span>Jitter Buffer</span>
                    <span className="mw-settings-value">{state.jitterBufferFrames * 20} ms</span>
                  </div>
                  <input type="range" min={0} max={10} step={1} value={state.jitterBufferFrames}
                    onChange={e => actions.setJitterBufferFrames(clamp(Number(e.target.value), 0, 10))} className="mw-settings-range" />
                </section>

                {/* Input Device */}
                <section className="mw-settings-section">
                  <h3>Input Device</h3>
                  <select className="mw-connect-input" value={state.selectedInputDeviceId ?? ''}
                    onChange={e => actions.setSelectedInputDeviceId(e.target.value || null)}>
                    <option value="">Default</option>
                    {audioInputDevices.map(d => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Mic (${d.deviceId.slice(0, 8)})`}
                      </option>
                    ))}
                  </select>
                </section>

                {/* Mic Processing */}
                <section className="mw-settings-section">
                  <h3>Mic Processing</h3>
                  <label className="mw-settings-check">
                    <input type="checkbox" checked={state.rnnoiseEnabled} onChange={e => actions.setRnnoiseEnabled(e.target.checked)} />
                    RNNoise (ML Denoiser)
                  </label>
                  <label className="mw-settings-check">
                    <input type="checkbox" checked={state.micNoiseSuppression} onChange={e => actions.setMicNoiseSuppression(e.target.checked)} />
                    Browser Noise Suppression
                  </label>
                  <label className="mw-settings-check">
                    <input type="checkbox" checked={state.micEchoCancellation} onChange={e => actions.setMicEchoCancellation(e.target.checked)} />
                    Echo Cancellation
                  </label>
                  <label className="mw-settings-check">
                    <input type="checkbox" checked={state.micAutoGainControl} onChange={e => actions.setMicAutoGainControl(e.target.checked)} />
                    Auto Gain Control
                  </label>
                </section>

                {/* Uplink */}
                <section className="mw-settings-section">
                  <h3>Uplink</h3>
                  <label className="mw-settings-check">
                    <input type="checkbox" checked={state.uplinkCongestionControlEnabled}
                      onChange={e => actions.setUplinkCongestionControlEnabled(e.target.checked)} />
                    Congestion Control
                  </label>
                </section>
              </div>
            </div>
          </div>
        )
      }}
    </HeadlessSettings>
  )
}
