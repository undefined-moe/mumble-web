'use client'

import { useEffect, useRef, useState } from 'react'
import { useGatewayStore } from '../../../src/state/gateway-store'
import { cn } from '../../../src/ui/cn'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { MessageSquare, Send } from 'lucide-react'

export function ChatPanel() {
  const chat = useGatewayStore(s => s.chat)
  const selfUserId = useGatewayStore(s => s.selfUserId)
  const usersById = useGatewayStore(s => s.usersById)
  const selectedChannelId = useGatewayStore(s => s.selectedChannelId)
  const channelsById = useGatewayStore(s => s.channelsById)
  const sendTextToSelectedChannel = useGatewayStore(s => s.sendTextToSelectedChannel)

  const [message, setMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

  const selectedChannelName = selectedChannelId != null ? channelsById[selectedChannelId]?.name : undefined

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-background">
      <div className="flex h-10 shrink-0 items-center border-b border-border px-4">
        <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Chat</span>
        {selectedChannelName && (
          <span className="ml-2 text-xs text-muted-foreground">in {selectedChannelName}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground opacity-50">
            <MessageSquare className="mb-2 h-8 w-8" />
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          chat.map((m) => {
            const isSystem = m.senderId === 0
            const isMe = m.senderId === selfUserId
            const user = usersById[m.senderId]
            return (
              <div key={m.id} className={cn("flex flex-col gap-1 text-sm animate-in slide-in-from-left-2", isSystem && "items-center")}>
                {!isSystem && (
                  <div className="flex items-baseline gap-2">
                    <span className={cn("font-semibold text-xs", isMe ? "text-primary" : "text-foreground")}>
                      {user?.name || (isMe ? 'Me' : `#${m.senderId}`)}
                    </span>
                    <span className="text-[10px] text-muted-foreground opacity-50">
                      {new Date(m.timestampMs).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                <div className={cn(
                  "rounded-lg px-3 py-2 max-w-[85%]",
                  isSystem ? "bg-muted text-xs text-muted-foreground" :
                    isMe ? "bg-primary text-primary-foreground self-end" : "bg-accent/50 text-foreground self-start"
                )}>
                  {m.message}
                </div>
              </div>
            )
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 pt-2">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!message.trim()) return
            sendTextToSelectedChannel(message)
            setMessage('')
          }}
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={selectedChannelName ? `Message ${selectedChannelName}...` : "Send a message..."}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </main>
  )
}
