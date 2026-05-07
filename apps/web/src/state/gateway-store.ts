'use client'

import { createGatewayStore } from '@mumble-web/sdk'

export type {
  GatewayStore,
  VoiceOpusFrame,
  VoiceMode,
  PlaybackStats,
  CaptureStats,
  ChannelState,
  UserState,
  ChatItem,
  Metrics,
  ServerListEntry,
  MumbleServerConfig,
  ContextAction,
  SavedCredentials,
} from '@mumble-web/sdk'

export const useGatewayStore = createGatewayStore()
