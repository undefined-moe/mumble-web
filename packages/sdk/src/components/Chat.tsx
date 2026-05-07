'use client'

import { useMemo } from 'react'
import { useMumble } from './VoiceProvider'

export interface ChatMessage {
  id: string
  senderId: number
  senderName: string | undefined
  message: string
  timestampMs: number
  isSystem: boolean
  isSelf: boolean
}

export interface ChatProps {
  children: (props: {
    messages: ChatMessage[]
    channelName: string | undefined
    send: (message: string) => void
  }) => React.ReactNode
}

export function Chat({ children }: ChatProps) {
  const { useStore } = useMumble()
  const chat = useStore(s => s.chat)
  const selfUserId = useStore(s => s.selfUserId)
  const usersById = useStore(s => s.usersById)
  const selectedChannelId = useStore(s => s.selectedChannelId)
  const channelsById = useStore(s => s.channelsById)
  const sendTextToSelectedChannel = useStore(s => s.sendTextToSelectedChannel)

  const channelName = selectedChannelId != null ? channelsById[selectedChannelId]?.name : undefined

  const messages = useMemo((): ChatMessage[] =>
    chat.map(m => ({
      id: m.id,
      senderId: m.senderId,
      senderName: usersById[m.senderId]?.name,
      message: m.message,
      timestampMs: m.timestampMs,
      isSystem: m.senderId === 0,
      isSelf: m.senderId === selfUserId,
    })),
    [chat, usersById, selfUserId]
  )

  return <>{children({ messages, channelName, send: sendTextToSelectedChannel })}</>
}
