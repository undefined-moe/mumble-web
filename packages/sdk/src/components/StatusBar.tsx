'use client'

import { useMumble } from './VoiceProvider'

export interface StatusBarState {
  status: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'error'
  gatewayStatus: 'closed' | 'connecting' | 'open'
  connectError: string | null
  wsRttMs: number | undefined
  serverRttMs: number | undefined
}

export interface StatusBarActions {
  disconnect: () => void
}

export interface StatusBarProps {
  children: (state: StatusBarState, actions: StatusBarActions) => React.ReactNode
}

export function StatusBar({ children }: StatusBarProps) {
  const { useStore } = useMumble()
  const status = useStore(s => s.status)
  const gatewayStatus = useStore(s => s.gatewayStatus)
  const connectError = useStore(s => s.connectError)
  const wsRttMs = useStore(s => s.metrics.wsRttMs)
  const serverRttMs = useStore(s => s.metrics.serverRttMs)
  const disconnect = useStore(s => s.disconnect)

  const state: StatusBarState = { status, gatewayStatus, connectError, wsRttMs, serverRttMs }
  const actions: StatusBarActions = { disconnect }

  return <>{children(state, actions)}</>
}
