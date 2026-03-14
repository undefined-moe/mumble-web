'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGatewayStore } from '../../src/state/gateway-store'
import { cn } from '../../src/ui/cn'
import { Users, MicOff, VolumeX } from 'lucide-react'

type DocumentPiP = {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>
  readonly window: Window | null
}

interface OverlayPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PIP_W = 280
const PIP_H = 320

export function isPipSupported(): boolean {
  return typeof window !== 'undefined' && 'documentPictureInPicture' in window
}

function getDocPiP(): DocumentPiP | null {
  if (!isPipSupported()) return null
  return (window as unknown as { documentPictureInPicture: DocumentPiP }).documentPictureInPicture
}

function copyStylesToWindow(target: Window) {
  for (const sheet of document.styleSheets) {
    try {
      const style = target.document.createElement('style')
      style.textContent = Array.from(sheet.cssRules).map((r) => r.cssText).join('\n')
      target.document.head.appendChild(style)
    } catch {
      if (sheet.href) {
        const link = target.document.createElement('link')
        link.rel = 'stylesheet'
        link.href = sheet.href
        target.document.head.appendChild(link)
      }
    }
  }
}

function SpeakerList() {
  const { usersById, speakingByUserId, selfSpeaking, selfUserId, channelsById, selectedChannelId } =
    useGatewayStore()

  const selfChannelId = selfUserId != null ? (usersById[selfUserId]?.channelId ?? null) : null
  const channelId = selfChannelId ?? selectedChannelId
  const channel = channelId != null ? channelsById[channelId] : null

  const users = Object.values(usersById)
    .filter((u) => u.channelId === channelId)
    .sort((a, b) => {
      const as = speakingByUserId[a.id] ? 1 : 0
      const bs = speakingByUserId[b.id] ? 1 : 0
      if (as !== bs) return bs - as
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Channel */}
      <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2 shrink-0">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium truncate">{channel?.name ?? 'Channel'}</span>
        <span className="ml-auto text-[10px] text-muted-foreground">{users.length}</span>
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {users.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-muted-foreground/50">
            No users in channel
          </div>
        ) : (
          users.map((u) => {
            const isSelf = u.id === selfUserId
            const isSpeaking = isSelf ? selfSpeaking : speakingByUserId[u.id]
            return (
              <div
                key={u.id}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-all duration-150',
                  isSpeaking ? 'bg-green-500/15 text-green-400' : 'text-muted-foreground',
                )}
              >
                <div
                  className={cn(
                    'relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold uppercase',
                    isSpeaking ? 'bg-green-500 text-white' : 'bg-accent/60 text-muted-foreground',
                  )}
                >
                  {u.name.slice(0, 1)}
                  {isSpeaking && (
                    <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
                  )}
                </div>
                <span className={cn('truncate', isSelf && 'font-medium')}>{u.name}</span>
                <div className="ml-auto flex shrink-0 items-center gap-0.5">
                  {(u.mute || u.suppress || (u.selfMute && !u.mute && !u.suppress)) && (
                    <MicOff
                      className={cn('h-3 w-3', (u.mute || u.suppress) ? 'text-red-500' : 'text-muted-foreground/70')}
                    />
                  )}
                  {(u.deaf || (u.selfDeaf && !u.deaf)) && (
                    <VolumeX
                      className={cn('h-3 w-3', u.deaf ? 'text-red-500' : 'text-muted-foreground/70')}
                    />
                  )}
                  {isSelf && (
                    <span className="text-[10px] opacity-50 ml-0.5">You</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export function OverlayPanel({ open, onOpenChange }: OverlayPanelProps) {
  const pipRef = useRef<Window | null>(null)
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange

  useEffect(() => {
    if (!open) {
      if (pipRef.current) {
        try { pipRef.current.close() } catch { /* ignore */ }
        pipRef.current = null
        setContainer(null)
      }
      return
    }

    if (pipRef.current) return

    let cancelled = false

    ;(async () => {
      const dpip = getDocPiP()
      if (!dpip) {
        onOpenChangeRef.current(false)
        return
      }

      let pip: Window
      try {
        pip = await dpip.requestWindow({ width: PIP_W, height: PIP_H })
      } catch {
        onOpenChangeRef.current(false)
        return
      }

      if (cancelled) {
        pip.close()
        return
      }

      copyStylesToWindow(pip)
      pip.document.title = 'Mumble \u2014 Speakers'
      pip.document.body.style.margin = '0'
      pip.document.body.style.height = '100vh'
      pip.document.body.style.overflow = 'hidden'

      const root = pip.document.createElement('div')
      root.id = 'pip-root'
      root.style.height = '100%'
      pip.document.body.appendChild(root)

      pip.addEventListener('pagehide', () => {
        pipRef.current = null
        setContainer(null)
        onOpenChangeRef.current(false)
      })

      pipRef.current = pip
      setContainer(root)
    })()

    return () => {
      cancelled = true
      if (pipRef.current) {
        try { pipRef.current.close() } catch { /* ignore */ }
        pipRef.current = null
        setContainer(null)
      }
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (pipRef.current) {
        try { pipRef.current.close() } catch { /* ignore */ }
        pipRef.current = null
      }
    }
  }, [])

  if (!container) return null

  return createPortal(<SpeakerList />, container)
}
