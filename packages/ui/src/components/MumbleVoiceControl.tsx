'use client'

import { VoiceControl as HeadlessVoiceControl } from '@mumble-web/sdk'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

export interface MumbleVoiceControlProps {
  className?: string
}

export function MumbleVoiceControl({ className }: MumbleVoiceControlProps) {
  return (
    <HeadlessVoiceControl>
      {(state, actions) => (
        <div className={`mw-voice-bar ${className ?? ''}`}>
          {/* Mute/Unmute */}
          <button
            className="mw-voice-btn"
            data-active={state.muted}
            onClick={actions.toggleMute}
          >
            {state.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {state.muted ? 'Muted' : 'Unmuted'}
          </button>

          <div className="mw-divider" />

          {/* Mic toggle */}
          <button
            className="mw-voice-btn mw-voice-btn-mic"
            data-active={state.micEnabled}
            data-sending={state.micEnabled && state.captureSending}
            disabled={!state.connected || !state.webCodecsAvailable}
            onClick={() => actions.toggleMic().catch(console.error)}
          >
            {state.micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          </button>

          {/* Mode toggle */}
          {state.micEnabled && (
            <>
              <div className="mw-voice-mode-toggle">
                <button
                  className="mw-voice-mode-btn"
                  data-active={state.voiceMode === 'vad'}
                  onClick={() => actions.setVoiceMode('vad')}
                >
                  VAD
                </button>
                <button
                  className="mw-voice-mode-btn"
                  data-active={state.voiceMode === 'ptt'}
                  onClick={() => actions.setVoiceMode('ptt')}
                >
                  PTT
                </button>
              </div>

              {state.voiceMode === 'ptt' && (
                <button
                  className="mw-voice-btn"
                  onPointerDown={() => actions.setPttActive(true)}
                  onPointerUp={() => actions.setPttActive(false)}
                  onPointerLeave={() => actions.setPttActive(false)}
                >
                  Hold to Talk
                </button>
              )}
            </>
          )}

          {/* Stats */}
          <div className="mw-voice-stats">
            <span>
              <span className="mw-voice-stat-label">Buffer: </span>
              {state.playbackBufferMs != null ? `${state.playbackBufferMs}ms` : '-'}
            </span>
            <span>
              <span className="mw-voice-stat-label">Mic: </span>
              {state.captureRms != null ? `${(state.captureRms * 100).toFixed(1)}%` : '-'}
            </span>
          </div>
        </div>
      )}
    </HeadlessVoiceControl>
  )
}
