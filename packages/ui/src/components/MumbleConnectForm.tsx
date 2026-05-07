'use client'

import { useState } from 'react'
import { ConnectForm as HeadlessConnectForm } from '@mumble-web/sdk'

export interface MumbleConnectFormProps {
  className?: string
  onConnected?: () => void
}

export function MumbleConnectForm({ className, onConnected }: MumbleConnectFormProps) {
  const [serverId, setServerId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [tokens, setTokens] = useState('')

  return (
    <HeadlessConnectForm>
      {(state, actions) => {
        if (state.status === 'connected') {
          onConnected?.()
        }

        const firstServer = state.servers[0]
        const effectiveServerId = serverId || firstServer?.id || ''

        const canConnect = Boolean(effectiveServerId && username && state.status !== 'connecting')

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          if (!canConnect) return
          const parsedTokens = tokens.split(',').map(t => t.trim()).filter(Boolean)
          actions.connect({
            serverId: effectiveServerId,
            username,
            ...(password ? { password } : {}),
            ...(parsedTokens.length ? { tokens: parsedTokens } : {}),
          })
        }

        return (
          <form className={`mw-connect-form ${className ?? ''}`} onSubmit={handleSubmit}>
            <div className="mw-connect-header">
              <div className="mw-connect-icon">&#9741;</div>
              <h2 className="mw-connect-title">mumble-web</h2>
              <p className="mw-connect-desc">Connect to a Mumble server</p>
            </div>

            <div className="mw-connect-fields">
              <label className="mw-connect-label">Server</label>
              <select
                className="mw-connect-input"
                value={effectiveServerId}
                onChange={e => setServerId(e.target.value)}
              >
                <option value="" disabled>Select server...</option>
                {state.servers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <label className="mw-connect-label">Username</label>
              <input
                className="mw-connect-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
              />

              <label className="mw-connect-label">Password</label>
              <input
                className="mw-connect-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Optional"
              />

              <label className="mw-connect-label">Tokens</label>
              <input
                className="mw-connect-input"
                value={tokens}
                onChange={e => setTokens(e.target.value)}
                placeholder="Comma-separated"
              />
            </div>

            {state.connectError && (
              <div className="mw-connect-error">{state.connectError}</div>
            )}

            <button
              type="submit"
              className="mw-connect-btn"
              disabled={!canConnect}
            >
              {state.status === 'connecting' ? 'Connecting...' : 'Connect'}
            </button>

            <div className="mw-connect-footer">
              <span className={`mw-connect-status-dot ${state.gatewayStatus === 'open' ? 'mw-dot-ok' : 'mw-dot-warn'}`} />
              Gateway: {state.gatewayStatus}
              {state.status === 'reconnecting' && (
                <button type="button" className="mw-connect-cancel" onClick={actions.disconnect}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        )
      }}
    </HeadlessConnectForm>
  )
}
