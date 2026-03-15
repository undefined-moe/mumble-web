'use client'

import { useMemo } from 'react'
import { useGatewayStore } from '../../../src/state/gateway-store'
import { cn } from '../../../src/ui/cn'
import { MicOff, VolumeX } from 'lucide-react'
import { useT, format } from '../../../src/i18n'

export function UserListSidebar() {
  const t = useT()
  const usersById = useGatewayStore(s => s.usersById)
  const speakingByUserId = useGatewayStore(s => s.speakingByUserId)
  const selfSpeaking = useGatewayStore(s => s.selfSpeaking)
  const selfUserId = useGatewayStore(s => s.selfUserId)
  const selectedChannelId = useGatewayStore(s => s.selectedChannelId)

  const usersInSelectedChannel = useMemo(() => {
    if (selectedChannelId == null) return []
    return Object.values(usersById)
      .filter((u) => u.channelId === selectedChannelId)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [usersById, selectedChannelId])

  return (
    <aside className="hidden w-80 flex-col border-l border-border bg-card/30 lg:flex">
      <div className="flex h-10 items-center justify-between border-b border-border px-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.userList.title}</span>
        <span className="text-xs text-muted-foreground">{format(t.userList.online, { count: usersInSelectedChannel.length })}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {usersInSelectedChannel.map(u => {
            const isSelf = u.id === selfUserId
            const isSpeaking = isSelf ? selfSpeaking : speakingByUserId[u.id]
            const hasServerMute = u.mute || u.suppress
            const hasServerDeaf = u.deaf
            const hasSelfMute = u.selfMute && !hasServerMute
            const hasSelfDeaf = u.selfDeaf && !hasServerDeaf
            return (
              <li
                key={u.id}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all",
                  isSpeaking ? "bg-green-500/10 text-green-500 shadow-sm ring-1 ring-green-500/20" : "hover:bg-accent text-foreground"
                )}
              >
                <div className={cn(
                  "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/50 text-xs font-medium uppercase overflow-hidden",
                  isSpeaking && !u.texture && "bg-green-500 text-white animate-pulse",
                  isSpeaking && u.texture && "ring-2 ring-green-500 animate-pulse"
                )}>
                  {u.texture ? (
                    <img src={u.texture} alt="" className="h-full w-full object-cover" />
                  ) : (
                    u.name.slice(0, 2)
                  )}
                  {isSpeaking && <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />}
                </div>
                <div className="flex flex-1 items-center gap-1 overflow-hidden">
                  <span className={cn("truncate font-medium", isSelf && "text-primary")}>{u.name} {isSelf && `(${t.userList.you})`}</span>
                  <div className="ml-auto flex shrink-0 items-center gap-0.5">
                    {(hasServerMute || hasSelfMute) && (
                      <span title={u.suppress ? t.userList.suppressedByServer : hasServerMute ? t.userList.mutedByServer : t.userList.selfMuted}>
                        <MicOff className={cn("h-3.5 w-3.5", hasServerMute ? "text-red-500" : "text-muted-foreground/70")} />
                      </span>
                    )}
                    {(hasServerDeaf || hasSelfDeaf) && (
                      <span title={hasServerDeaf ? t.userList.deafenedByServer : t.userList.selfDeafened}>
                        <VolumeX className={cn("h-3.5 w-3.5", hasServerDeaf ? "text-red-500" : "text-muted-foreground/70")} />
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
