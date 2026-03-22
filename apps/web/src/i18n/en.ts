/**
 * English translations — this file defines the canonical shape.
 * All other locale files must satisfy `typeof en`.
 */
const en = {
  // ── Connect page ──────────────────────────────────────────────
  connect: {
    title: 'Mumble Web',
    description: 'High quality, low latency voice chat.',
    serverLabel: 'Server',
    serverPlaceholder: 'Select a server...',
    identityLabel: 'Identity',
    usernamePlaceholder: 'Username',
    passwordPlaceholder: 'Password (Optional)',
    tokensLabel: 'Access Tokens',
    tokensPlaceholder: 'Comma,separated,tokens',
    rememberCredentials: 'Remember credentials',
    connecting: 'Connecting...',
    connectButton: 'Connect',
    gatewayStatus: 'Gateway {status}',
    cancelReconnect: 'Cancel Reconnect',
  },

  // ── Top bar ───────────────────────────────────────────────────
  topBar: {
    title: 'Mumble Web',
    clickForMetrics: 'Click for detailed metrics',
    server: 'Server',
    speakerOverlay: 'Speaker Overlay (PiP)',
    pipNotSupported: 'PiP not supported in this browser',
    connectionMetrics: 'Connection Metrics',
    settings: 'Settings',
    disconnect: 'Disconnect',
  },

  // ── Channel sidebar ───────────────────────────────────────────
  channelSidebar: {
    searchPlaceholder: 'Search channels...',
    showUsers: 'Show users',
    you: 'You',
    unnamed: '(unnamed)',
    noEnterPermission: 'No enter permission',
    listen: 'Listen to this channel',
    stopListening: 'Stop listening',
    listening: 'Listening',
  },

  // ── Chat panel ────────────────────────────────────────────────
  chat: {
    title: 'Chat',
    inChannel: 'in {channel}',
    noMessages: 'No messages yet',
    me: 'Me',
    messagePlaceholder: 'Message {channel}...',
    sendPlaceholder: 'Send a message...',
  },

  // ── User list sidebar ─────────────────────────────────────────
  userList: {
    title: 'Users',
    online: '{count} online',
    you: 'You',
    suppressedByServer: 'Suppressed by server',
    mutedByServer: 'Muted by server',
    selfMuted: 'Self muted',
    deafenedByServer: 'Deafened by server',
    selfDeafened: 'Self deafened',
  },

  // ── Voice control bar ─────────────────────────────────────────
  voice: {
    muted: 'Muted',
    unmuted: 'Unmuted',
    mode: 'Mode',
    holdToTalk: 'Hold to Talk',
    buffer: 'Buffer',
    jitter: 'Jitter',
    mic: 'Mic',
    sending: 'Sending',
    silent: 'Silent',
    micAccessFailed: 'Failed to access microphone: {error}',
  },

  // ── Disconnected view ─────────────────────────────────────────
  disconnected: {
    reconnecting: 'Reconnecting...',
    disconnected: 'Disconnected',
    gatewayStatus: 'Gateway Status',
    backToLogin: 'Back to Login',
    cancelReconnect: 'Cancel Reconnect',
  },

  // ── Settings (dialog + page) ──────────────────────────────────
  settings: {
    title: 'Settings',
    backToApp: 'Back to App',
    back: 'Back',

    // VAD
    vadTitle: 'Voice Activation (VAD)',
    sensitivity: 'Sensitivity',
    sensitivityDesc: 'Lower values are more sensitive. Increase when background noise is high.',
    holdTime: 'Hold Time',
    holdTimeDesc: 'Duration to keep transmitting after voice stops, preventing word cutoffs.',

    // PTT
    pttTitle: 'Push-to-Talk Shortcut',
    pttKey: 'PTT Key',
    pttKeyDesc: 'Hold this key to talk in PTT mode, release to stop.',

    // Uplink
    uplinkTitle: 'Uplink (Weak Network)',
    enableCongestionControl: 'Enable uplink congestion control',
    congestionControlDesc: 'Keeps voice realtime by dropping queued frames when the WebSocket send buffer is backed up.',
    maxWsSendBuffer: 'Max WS send buffer',
    maxWsSendBufferDesc: 'Drop/hold voice frames when buffered exceeds this threshold.',

    // Audio Quality
    audioQualityTitle: 'Audio Quality',
    opusBitrate: 'Opus bitrate',
    opusBitrateDesc: 'Lower bitrate can help on unstable uplinks.',

    // Input device
    inputDevice: 'Input Device',
    defaultDevice: 'Default Device',
    microphoneFallback: 'Microphone ({id}...)',
    noDevicesDetected: 'No devices detected. Please grant microphone permission first.',

    // Mic processing
    micProcessing: 'Microphone Processing',
    rnnoise: 'RNNoise (WASM) noise suppression',
    rnnoiseDesc: 'Improves noisy/cheap microphones, but adds CPU usage.',
    browserNoiseSuppression: 'Browser noise suppression',
    browserNoiseSuppressionDesc: 'Uses built-in processing from getUserMedia().',
    echoCancellation: 'Echo cancellation',
    echoCancellationDesc: 'Recommended when using speakers (not headphones).',
    agc: 'Auto gain control (AGC)',
    agcDesc: 'May amplify background noise on low-quality microphones.',
    changesApplyNote: 'Changes apply next time you toggle the microphone on.',
  },

  // ── Metrics panel ─────────────────────────────────────────────
  metrics: {
    title: 'Connection Quality Monitor',

    // Network latency
    networkLatency: 'Network Latency',
    wsRtt: 'WebSocket RTT',
    mumbleServerRtt: 'Mumble Server RTT',
    jitter: 'Jitter',
    wsBuffer: 'WS Buffer',

    // Downlink
    voiceDownlink: 'Voice Downlink (Receive)',
    bitrate: 'Bitrate',
    frameRate: 'Frame Rate',
    playbackBuffer: 'Playback Buffer',
    activeStreams: 'Active Streams',
    totalFrames: 'Total Frames',
    totalBytes: 'Total Bytes',
    droppedFrames: 'Dropped Frames',
    outOfOrderFrames: 'Out-of-Order Frames',
    downlinkBitrate: 'Downlink Bitrate',

    // Uplink
    voiceUplink: 'Voice Uplink (Send)',
    micLevel: 'Mic Level',
    sendStatus: 'Send Status',
    sending: 'Sending',
    silent: 'Silent',
    uplinkQueue: 'Uplink Queue',
    uplinkDropped: 'Uplink Dropped',
    gatewayQueue: 'Gateway Queue',
    gatewayDropped: 'Gateway Dropped',
    uplinkBitrate: 'Uplink Bitrate',
    micLevelChart: 'Mic Level',
  },

  // ── Overlay panel ─────────────────────────────────────────────
  overlay: {
    channel: 'Channel',
    noUsersInChannel: 'No users in channel',
    you: 'You',
  },

  // ── Language selector ─────────────────────────────────────────
  language: {
    label: 'Language',
  },
}

export type Translations = typeof en
export default en
