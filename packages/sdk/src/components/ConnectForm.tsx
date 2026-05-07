'use client'

import { useMumble } from './VoiceProvider'

export interface ConnectFormState {
  servers: Array<{ id: string; name: string }>
  status: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'error'
  gatewayStatus: 'closed' | 'connecting' | 'open'
  connectError: string | null
}

export interface ConnectFormActions {
  connect: (args: { serverId: string; username: string; password?: string; tokens?: string[] }) => void
  disconnect: () => void
}

export interface ConnectFormProps {
  children: (state: ConnectFormState, actions: ConnectFormActions) => React.ReactNode
}

export function ConnectForm({ children }: ConnectFormProps) {
  const { useStore } = useMumble()
  const servers = useStore(s => s.servers)
  const status = useStore(s => s.status)
  const gatewayStatus = useStore(s => s.gatewayStatus)
  const connectError = useStore(s => s.connectError)
  const connect = useStore(s => s.connect)
  const disconnect = useStore(s => s.disconnect)

  const state: ConnectFormState = { servers, status, gatewayStatus, connectError }
  const actions: ConnectFormActions = { connect, disconnect }

  return <>{children(state, actions)}</>
}
