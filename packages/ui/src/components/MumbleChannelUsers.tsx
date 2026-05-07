'use client'

import { ChannelUsers as HeadlessChannelUsers } from '@mumble-web/sdk'
import { MicOff, VolumeX } from 'lucide-react'

export interface MumbleChannelUsersProps {
  channelId?: number
  className?: string
}

export function MumbleChannelUsers({ channelId, className }: MumbleChannelUsersProps) {
  return (
    <HeadlessChannelUsers channelId={channelId}>
      {({ users }) => (
        <div className={`mw-user-list ${className ?? ''}`}>
          {users.map((u) => (
            <div
              key={u.id}
              className="mw-user-item"
              data-speaking={u.isSpeaking}
            >
              <div className="mw-user-avatar" data-speaking={u.isSpeaking && !u.texture}>
                {u.texture ? (
                  <img src={u.texture} alt="" />
                ) : (
                  u.name.slice(0, 2)
                )}
              </div>
              <span className={`mw-user-name ${u.isSelf ? 'mw-user-self' : ''}`}>
                {u.name}{u.isSelf ? ' (You)' : ''}
              </span>
              <div className="mw-user-badges">
                {(u.isMuted || u.isSelfMuted) && (
                  <MicOff size={14} className={u.isMuted ? 'mw-user-badge-muted' : 'mw-user-badge-self-muted'} />
                )}
                {(u.isDeafened || u.isSelfDeafened) && (
                  <VolumeX size={14} className={u.isDeafened ? 'mw-user-badge-muted' : 'mw-user-badge-self-muted'} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </HeadlessChannelUsers>
  )
}
