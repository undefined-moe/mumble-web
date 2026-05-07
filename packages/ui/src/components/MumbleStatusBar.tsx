'use client'

import { StatusBar as HeadlessStatusBar } from '@mumble-web/sdk'
import { Activity, LogOut } from 'lucide-react'

export interface MumbleStatusBarProps {
  className?: string
  onDisconnect?: () => void
}

export function MumbleStatusBar({ className, onDisconnect }: MumbleStatusBarProps) {
  return (
    <HeadlessStatusBar>
      {(state, actions) => (
        <div className={`mw-status-bar ${className ?? ''}`}>
          <div className="mw-status-left">
            <Activity size={14} />
            <span>WS: {state.wsRttMs != null ? `${Math.round(state.wsRttMs)}ms` : '-'}</span>
            <span className="mw-status-dim">Server: {state.serverRttMs != null ? `${Math.round(state.serverRttMs)}ms` : '-'}</span>
          </div>
          <div className="mw-status-right">
            <span className={`mw-connect-status-dot ${state.gatewayStatus === 'open' ? 'mw-dot-ok' : 'mw-dot-warn'}`} />
            <span className="mw-status-dim">{state.status}</span>
            <button
              className="mw-status-disconnect"
              onClick={() => { actions.disconnect(); onDisconnect?.() }}
              title="Disconnect"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}
    </HeadlessStatusBar>
  )
}
