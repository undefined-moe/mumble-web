'use client'

import { ChannelList as HeadlessChannelList, type ChannelNode } from '@mumble-web/sdk'
import { Volume2 } from 'lucide-react'

export interface MumbleChannelListProps {
  className?: string
}

export function MumbleChannelList({ className }: MumbleChannelListProps) {
  return (
    <HeadlessChannelList>
      {({ channels, selectChannel, joinChannel }) => (
        <div className={`mw-channel-list ${className ?? ''}`}>
          {channels.map((ch) => (
            <button
              key={ch.id}
              className="mw-channel-item"
              data-selected={ch.isSelected}
              data-joined={ch.isJoined}
              style={{ paddingLeft: 8 + ch.depth * 16 }}
              onClick={() => selectChannel(ch.id)}
              onDoubleClick={() => joinChannel(ch.id)}
            >
              <Volume2 size={14} style={{ opacity: ch.userCount > 0 ? 1 : 0.4, flexShrink: 0 }} />
              <span className="mw-channel-name">{ch.name || 'Unnamed'}</span>
              {ch.userCount > 0 && (
                <span className="mw-channel-user-count">{ch.userCount}</span>
              )}
              {ch.isJoined && <span className="mw-channel-joined-dot" />}
            </button>
          ))}
        </div>
      )}
    </HeadlessChannelList>
  )
}
