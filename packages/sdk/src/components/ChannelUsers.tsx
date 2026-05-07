'use client'

import { useMemo } from 'react'
import { useMumble } from './VoiceProvider'

export interface ChannelUser {
  id: number
  name: string
  isSelf: boolean
  isSpeaking: boolean
  isMuted: boolean
  isDeafened: boolean
  isSelfMuted: boolean
  isSelfDeafened: boolean
  texture: string | undefined
}

export interface ChannelUsersProps {
  /** Channel ID to show users for. Defaults to selectedChannelId. */
  channelId?: number | undefined
  children: (props: {
    users: ChannelUser[]
    channelId: number | null
  }) => React.ReactNode
}

export function ChannelUsers({ channelId: channelIdProp, children }: ChannelUsersProps) {
  const { useStore } = useMumble()
  const usersById = useStore(s => s.usersById)
  const speakingByUserId = useStore(s => s.speakingByUserId)
  const selfSpeaking = useStore(s => s.selfSpeaking)
  const selfUserId = useStore(s => s.selfUserId)
  const selectedChannelId = useStore(s => s.selectedChannelId)

  const channelId = channelIdProp ?? selectedChannelId

  const users = useMemo((): ChannelUser[] => {
    if (channelId == null) return []
    return Object.values(usersById)
      .filter(u => u.channelId === channelId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(u => {
        const isSelf = u.id === selfUserId
        return {
          id: u.id,
          name: u.name,
          isSelf,
          isSpeaking: isSelf ? selfSpeaking : (speakingByUserId[u.id] ?? false),
          isMuted: u.mute === true || u.suppress === true,
          isDeafened: u.deaf === true,
          isSelfMuted: u.selfMute === true,
          isSelfDeafened: u.selfDeaf === true,
          texture: u.texture,
        }
      })
  }, [usersById, channelId, selfUserId, selfSpeaking, speakingByUserId])

  return <>{children({ users, channelId })}</>
}
