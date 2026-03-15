'use client'

import { useCallback, useMemo, useState } from 'react'
import { useGatewayStore } from '../../../src/state/gateway-store'
import { cn } from '../../../src/ui/cn'
import { Volume2, Search, X, ChevronDown, Users, Lock } from 'lucide-react'

type TreeNode =
  | { kind: 'channel'; id: number; depth: number }
  | { kind: 'user'; userId: number; userName: string; channelId: number; depth: number }

export function ChannelSidebar() {
  const channelsById = useGatewayStore(s => s.channelsById)
  const usersById = useGatewayStore(s => s.usersById)
  const speakingByUserId = useGatewayStore(s => s.speakingByUserId)
  const selfSpeaking = useGatewayStore(s => s.selfSpeaking)
  const rootChannelId = useGatewayStore(s => s.rootChannelId)
  const selfUserId = useGatewayStore(s => s.selfUserId)
  const selectedChannelId = useGatewayStore(s => s.selectedChannelId)
  const selectChannel = useGatewayStore(s => s.selectChannel)
  const joinSelectedChannel = useGatewayStore(s => s.joinSelectedChannel)
  const permissionsByChannelId = useGatewayStore(s => s.permissionsByChannelId)

  const [channelSearch, setChannelSearch] = useState('')
  const [collapsedChannels, setCollapsedChannels] = useState<Set<number>>(new Set())
  const [showUsers, setShowUsers] = useState(false)

  const root = rootChannelId != null ? channelsById[rootChannelId] : undefined
  const selfChannelId = selfUserId != null ? usersById[selfUserId]?.channelId ?? null : null

  const channelTree = useMemo(() => {
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

    const build = (parentId: number | null, depth: number): Array<{ id: number; depth: number }> => {
      const ids = byParent.get(parentId) ?? []
      const out: Array<{ id: number; depth: number }> = []
      for (const id of ids) {
        out.push({ id, depth })
        out.push(...build(id, depth + 1))
      }
      return out
    }

    return build(null, 0)
  }, [channelsById, rootChannelId])

  const childrenByParent = useMemo(() => {
    const map = new Map<number, number[]>()
    for (const node of channelTree) {
      const ch = channelsById[node.id]
      if (!ch) continue
      const parentId = ch.parentId
      if (parentId == null) continue
      const arr = map.get(parentId) ?? []
      arr.push(node.id)
      map.set(parentId, arr)
    }
    return map
  }, [channelTree, channelsById])

  const displayedNodes = useMemo((): TreeNode[] => {
    const query = channelSearch.trim().toLowerCase()

    if (!query) {
      const result: TreeNode[] = []
      let skipBelowDepth = -1
      for (const node of channelTree) {
        if (skipBelowDepth >= 0 && node.depth > skipBelowDepth) continue
        skipBelowDepth = -1
        result.push({ kind: 'channel', id: node.id, depth: node.depth })
        if (collapsedChannels.has(node.id)) {
          skipBelowDepth = node.depth
        } else if (showUsers) {
          const channelUsers = Object.values(usersById)
            .filter(u => u.channelId === node.id)
            .sort((a, b) => a.name.localeCompare(b.name))
          for (const u of channelUsers) {
            result.push({ kind: 'user', userId: u.id, userName: u.name, channelId: node.id, depth: node.depth + 1 })
          }
        }
      }
      return result
    }

    // Channels matching by name
    const channelMatchIds = new Set<number>()
    for (const node of channelTree) {
      const ch = channelsById[node.id]
      if (ch && ch.name.toLowerCase().includes(query)) {
        channelMatchIds.add(node.id)
      }
    }

    // Users matching by name → also include their channels
    const userMatchesByChannel = new Map<number, Array<{ userId: number; userName: string }>>()
    for (const u of Object.values(usersById)) {
      if (u.channelId == null) continue
      if (u.name.toLowerCase().includes(query)) {
        const arr = userMatchesByChannel.get(u.channelId) ?? []
        arr.push({ userId: u.id, userName: u.name })
        userMatchesByChannel.set(u.channelId, arr)
      }
    }

    // Collect all channel IDs that should be visible (matches + user-match hosts)
    const visibleChannelIds = new Set<number>(channelMatchIds)
    for (const chId of userMatchesByChannel.keys()) {
      visibleChannelIds.add(chId)
    }

    // Walk up ancestor chains
    const ancestorIds = new Set<number>()
    for (const id of visibleChannelIds) {
      let current = channelsById[id]
      while (current && current.parentId != null) {
        if (ancestorIds.has(current.parentId)) break
        ancestorIds.add(current.parentId)
        current = channelsById[current.parentId]
      }
    }

    // Build result: channels + matched users inserted after their channel
    const result: TreeNode[] = []
    for (const node of channelTree) {
      if (!visibleChannelIds.has(node.id) && !ancestorIds.has(node.id)) continue
      result.push({ kind: 'channel', id: node.id, depth: node.depth })

      const matchedUsers = userMatchesByChannel.get(node.id)
      if (matchedUsers) {
        for (const u of matchedUsers.sort((a, b) => a.userName.localeCompare(b.userName))) {
          result.push({ kind: 'user', userId: u.userId, userName: u.userName, channelId: node.id, depth: node.depth + 1 })
        }
      }
    }
    return result
  }, [channelTree, channelsById, usersById, channelSearch, collapsedChannels, showUsers])

  const toggleCollapse = useCallback((channelId: number) => {
    setCollapsedChannels(prev => {
      const next = new Set(prev)
      if (next.has(channelId)) next.delete(channelId)
      else next.add(channelId)
      return next
    })
  }, [])

  return (
    <aside className="hidden w-80 flex-col border-r border-border bg-card/30 md:flex">
      <div className="border-b border-border px-3 py-2 space-y-1.5">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={channelSearch}
            onChange={(e) => setChannelSearch(e.target.value)}
            placeholder="Search channels..."
            className="w-full rounded-md border border-border bg-card/30 py-1 pl-7 pr-7 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
          />
          {channelSearch && (
            <button
              onClick={() => setChannelSearch('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowUsers(v => !v)}
          className="flex w-full items-center justify-between rounded-md px-1.5 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Users className="h-3 w-3" />
            Show users
          </span>
          <span
            className={cn(
              'relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full transition-colors',
              showUsers ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
          >
            <span
              className={cn(
                'inline-block h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform',
                showUsers ? 'translate-x-3' : 'translate-x-0.5'
              )}
            />
          </span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-0.5">
          <div className="px-2 py-1.5 text-xs font-semibold text-primary/80 truncate">
            {root?.name || 'Root'}
          </div>
          {displayedNodes.map((node) => {
            if (node.kind === 'user') {
              const isSelf = node.userId === selfUserId
              const isSpeaking = isSelf ? selfSpeaking : speakingByUserId[node.userId]
              const userTexture = usersById[node.userId]?.texture
              return (
                <div
                  key={`u-${node.userId}`}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2 py-1 text-xs',
                    isSpeaking
                      ? 'text-green-500'
                      : 'text-muted-foreground'
                  )}
                  style={{ paddingLeft: 8 + node.depth * 12 }}
                >
                  <span className="w-4 shrink-0" />
                  <div className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/50 text-[8px] font-medium uppercase overflow-hidden',
                    isSpeaking && !userTexture && 'bg-green-500 text-white',
                    isSpeaking && userTexture && 'ring-1 ring-green-500'
                  )}>
                    {userTexture ? (
                      <img src={userTexture} alt="" className="h-full w-full object-cover" />
                    ) : (
                      node.userName.slice(0, 2)
                    )}
                  </div>
                  <span className={cn('truncate', isSelf && 'text-primary')}>
                    {node.userName}{isSelf ? ' (You)' : ''}
                  </span>
                </div>
              )
            }

            const ch = channelsById[node.id]
            if (!ch) return null
            const selected = node.id === selectedChannelId
            const isJoined = node.id === selfChannelId
            const hasUsers = Object.values(usersById).some(u => u.channelId === node.id)
            const hasChildren = childrenByParent.has(node.id)
            const isCollapsed = collapsedChannels.has(node.id)
            const perms = permissionsByChannelId[node.id]
            const cannotEnter = perms != null && (perms & 0x04) === 0

            return (
              <button
                key={node.id}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                  selected
                    ? 'bg-primary/10 text-primary font-medium'
                    : isJoined
                      ? 'bg-accent/50 text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                style={{ paddingLeft: 8 + node.depth * 12 }}
                onClick={() => selectChannel(node.id)}
                onDoubleClick={() => {
                  selectChannel(node.id)
                  joinSelectedChannel()
                }}
              >
                {hasChildren ? (
                  <span
                    role="button"
                    className="shrink-0 rounded-sm p-0.5 hover:bg-accent/50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCollapse(node.id)
                    }}
                  >
                    <ChevronDown className={cn(
                      'h-3 w-3 transition-transform duration-150',
                      isCollapsed && '-rotate-90'
                    )} />
                  </span>
                ) : (
                  <span className="w-4 shrink-0" />
                )}
                <Volume2 className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  isJoined ? "text-green-500" : hasUsers ? "opacity-100" : "opacity-50"
                )} />
                <span className="truncate">{ch.name || '(unnamed)'}</span>
                {cannotEnter && (
                  <span className="ml-auto shrink-0" title="No enter permission">
                    <Lock className="h-3.5 w-3.5 text-red-500" />
                  </span>
                )}
                {isJoined && !cannotEnter && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
