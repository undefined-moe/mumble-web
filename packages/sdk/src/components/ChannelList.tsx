'use client'

import { useMemo } from 'react'
import { useMumble } from './VoiceProvider'

export interface ChannelNode {
  id: number
  name: string
  parentId: number | null
  depth: number
  isSelected: boolean
  isJoined: boolean
  userCount: number
}

export interface ChannelListProps {
  children: (props: {
    channels: ChannelNode[]
    selectChannel: (id: number) => void
    joinChannel: (id: number) => void
    listenChannel: (id: number) => void
    unlistenChannel: (id: number) => void
  }) => React.ReactNode
}

export function ChannelList({ children }: ChannelListProps) {
  const { useStore } = useMumble()
  const channelsById = useStore(s => s.channelsById)
  const usersById = useStore(s => s.usersById)
  const rootChannelId = useStore(s => s.rootChannelId)
  const selectedChannelId = useStore(s => s.selectedChannelId)
  const selfUserId = useStore(s => s.selfUserId)
  const selectChannel = useStore(s => s.selectChannel)
  const joinSelectedChannel = useStore(s => s.joinSelectedChannel)
  const listenChannel = useStore(s => s.listenChannel)
  const unlistenChannel = useStore(s => s.unlistenChannel)

  const selfChannelId = selfUserId != null ? usersById[selfUserId]?.channelId ?? null : null

  const channels = useMemo((): ChannelNode[] => {
    if (rootChannelId == null) return []
    const all = Object.values(channelsById)
    const byParent = new Map<number | null, number[]>()
    for (const ch of all) {
      const key = ch.parentId ?? null
      const arr = byParent.get(key) ?? []
      arr.push(ch.id)
      byParent.set(key, arr)
    }
    for (const [, ids] of byParent) ids.sort((a, b) => (channelsById[a]?.name ?? '').localeCompare(channelsById[b]?.name ?? ''))

    const build = (parentId: number | null, depth: number): ChannelNode[] => {
      const ids = byParent.get(parentId) ?? []
      const out: ChannelNode[] = []
      for (const id of ids) {
        const ch = channelsById[id]
        if (!ch) continue
        const userCount = Object.values(usersById).filter(u => u.channelId === id).length
        out.push({
          id,
          name: ch.name,
          parentId: ch.parentId,
          depth,
          isSelected: id === selectedChannelId,
          isJoined: id === selfChannelId,
          userCount,
        })
        out.push(...build(id, depth + 1))
      }
      return out
    }

    return build(null, 0)
  }, [channelsById, usersById, rootChannelId, selectedChannelId, selfChannelId])

  const joinChannel = (id: number) => {
    selectChannel(id)
    joinSelectedChannel()
  }

  return <>{children({ channels, selectChannel, joinChannel, listenChannel, unlistenChannel })}</>
}
