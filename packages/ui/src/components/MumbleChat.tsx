'use client'

import { useState, useEffect, useRef } from 'react'
import { Chat as HeadlessChat } from '@mumble-web/sdk'
import { Send, MessageSquare } from 'lucide-react'

export interface MumbleChatProps {
  className?: string
}

export function MumbleChat({ className }: MumbleChatProps) {
  const [message, setMessage] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  return (
    <HeadlessChat>
      {({ messages, channelName, send }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          endRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, [messages.length])

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          if (!message.trim()) return
          send(message)
          setMessage('')
        }

        return (
          <div className={`mw-chat ${className ?? ''}`}>
            <div className="mw-chat-header">
              <MessageSquare size={14} />
              <span>Chat</span>
              {channelName && <span className="mw-chat-channel">#{channelName}</span>}
            </div>

            <div className="mw-chat-messages">
              {messages.length === 0 ? (
                <div className="mw-chat-empty">
                  <MessageSquare size={24} />
                  <span>No messages yet</span>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`mw-chat-msg ${m.isSystem ? 'mw-chat-msg-system' : ''}`}>
                    {!m.isSystem && (
                      <div className="mw-chat-msg-header">
                        <span className={`mw-chat-msg-sender ${m.isSelf ? 'mw-chat-msg-self' : ''}`}>
                          {m.senderName || `#${m.senderId}`}
                        </span>
                        <span className="mw-chat-msg-time">
                          {new Date(m.timestampMs).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    <div className={`mw-chat-msg-body ${m.isSelf ? 'mw-chat-msg-body-self' : ''}`}>
                      {m.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={endRef} />
            </div>

            <form className="mw-chat-input" onSubmit={handleSubmit}>
              <input
                className="mw-connect-input"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={channelName ? `Message #${channelName}` : 'Send a message...'}
              />
              <button type="submit" className="mw-chat-send-btn" disabled={!message.trim()}>
                <Send size={14} />
              </button>
            </form>
          </div>
        )
      }}
    </HeadlessChat>
  )
}
