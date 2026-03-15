import type { Translations } from './en'

const zh: Translations = {
  // ── Connect page ──────────────────────────────────────────────
  connect: {
    title: 'Mumble Web',
    description: '\u9AD8\u97F3\u8D28\u3001\u4F4E\u5EF6\u8FDF\u7684\u8BED\u97F3\u804A\u5929\u3002',
    serverLabel: '\u670D\u52A1\u5668',
    serverPlaceholder: '\u9009\u62E9\u670D\u52A1\u5668...',
    identityLabel: '\u8EAB\u4EFD',
    usernamePlaceholder: '\u7528\u6237\u540D',
    passwordPlaceholder: '\u5BC6\u7801\uFF08\u53EF\u9009\uFF09',
    tokensLabel: '\u8BBF\u95EE\u4EE4\u724C',
    tokensPlaceholder: '\u82F1\u6587\u9017\u53F7\u5206\u9694\u7684\u4EE4\u724C',
    rememberCredentials: '\u8BB0\u4F4F\u767B\u5F55\u4FE1\u606F',
    connecting: '\u8FDE\u63A5\u4E2D...',
    connectButton: '\u8FDE\u63A5',
    gatewayStatus: '\u7F51\u5173 {status}',
    cancelReconnect: '\u53D6\u6D88\u91CD\u8FDE',
  },

  // ── Top bar ───────────────────────────────────────────────────
  topBar: {
    title: 'Mumble Web',
    clickForMetrics: '\u70B9\u51FB\u67E5\u770B\u8BE6\u7EC6\u6307\u6807',
    server: '\u670D\u52A1\u5668',
    speakerOverlay: '\u53D1\u8A00\u4EBA\u60AC\u6D6E\u7A97 (PiP)',
    pipNotSupported: '\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 PiP',
    connectionMetrics: '\u8FDE\u63A5\u6307\u6807',
    settings: '\u8BBE\u7F6E',
    disconnect: '\u65AD\u5F00\u8FDE\u63A5',
  },

  // ── Channel sidebar ───────────────────────────────────────────
  channelSidebar: {
    searchPlaceholder: '\u641C\u7D22\u9891\u9053...',
    showUsers: '\u663E\u793A\u7528\u6237',
    you: '\u6211',
    unnamed: '\uFF08\u672A\u547D\u540D\uFF09',
    noEnterPermission: '\u65E0\u8FDB\u5165\u6743\u9650',
  },

  // ── Chat panel ────────────────────────────────────────────────
  chat: {
    title: '\u804A\u5929',
    inChannel: '\u5728 {channel}',
    noMessages: '\u6682\u65E0\u6D88\u606F',
    me: '\u6211',
    messagePlaceholder: '\u53D1\u6D88\u606F\u5230 {channel}...',
    sendPlaceholder: '\u53D1\u9001\u6D88\u606F...',
  },

  // ── User list sidebar ─────────────────────────────────────────
  userList: {
    title: '\u7528\u6237',
    online: '{count} \u5728\u7EBF',
    you: '\u6211',
    suppressedByServer: '\u88AB\u670D\u52A1\u5668\u7981\u8A00',
    mutedByServer: '\u88AB\u670D\u52A1\u5668\u9759\u97F3',
    selfMuted: '\u81EA\u5DF1\u9759\u97F3',
    deafenedByServer: '\u88AB\u670D\u52A1\u5668\u9759\u97F3\uFF08\u542C\uFF09',
    selfDeafened: '\u81EA\u5DF1\u9759\u97F3\uFF08\u542C\uFF09',
  },

  // ── Voice control bar ─────────────────────────────────────────
  voice: {
    muted: '\u5DF2\u9759\u97F3',
    unmuted: '\u672A\u9759\u97F3',
    mode: '\u6A21\u5F0F',
    holdToTalk: '\u6309\u4F4F\u8BF4\u8BDD',
    buffer: '\u7F13\u51B2',
    jitter: '\u6296\u52A8',
    mic: '\u9EA6\u514B\u98CE',
    sending: '\u53D1\u9001\u4E2D',
    silent: '\u9759\u97F3',
    micAccessFailed: '\u65E0\u6CD5\u8BBF\u95EE\u9EA6\u514B\u98CE\uFF1A{error}',
  },

  // ── Disconnected view ─────────────────────────────────────────
  disconnected: {
    reconnecting: '\u91CD\u8FDE\u4E2D...',
    disconnected: '\u5DF2\u65AD\u5F00\u8FDE\u63A5',
    gatewayStatus: '\u7F51\u5173\u72B6\u6001',
    backToLogin: '\u8FD4\u56DE\u767B\u5F55',
    cancelReconnect: '\u53D6\u6D88\u91CD\u8FDE',
  },

  // ── Settings (dialog + page) ──────────────────────────────────
  settings: {
    title: '\u8BBE\u7F6E',
    backToApp: '\u8FD4\u56DE\u5E94\u7528',
    back: '\u8FD4\u56DE',

    // VAD
    vadTitle: '\u8BED\u97F3\u6FC0\u6D3B\u68C0\u6D4B (VAD)',
    sensitivity: '\u7075\u654F\u5EA6',
    sensitivityDesc: '\u503C\u8D8A\u5C0F\u8D8A\u7075\u654F\uFF0C\u73AF\u5883\u566A\u58F0\u5927\u65F6\u53EF\u8C03\u9AD8\u3002',
    holdTime: '\u4FDD\u6301\u65F6\u95F4',
    holdTimeDesc: '\u58F0\u97F3\u6D88\u5931\u540E\u7EE7\u7EED\u53D1\u9001\u7684\u65F6\u957F\uFF0C\u907F\u514D\u8BCD\u8BED\u95F4\u65AD\u3002',

    // PTT
    pttTitle: '\u6309\u952E\u8BF4\u8BDD\u5FEB\u6377\u952E',
    pttKey: 'PTT \u5FEB\u6377\u952E',
    pttKeyDesc: 'PTT \u6A21\u5F0F\u4E0B\u6309\u4F4F\u6B64\u952E\u53D1\u8A00\uFF0C\u677E\u5F00\u505C\u6B62\u3002',

    // Uplink
    uplinkTitle: '\u4E0A\u884C\uFF08\u5F31\u7F51\uFF09',
    enableCongestionControl: '\u542F\u7528\u4E0A\u884C\u62E5\u585E\u63A7\u5236',
    congestionControlDesc: '\u5F53 WebSocket \u53D1\u9001\u7F13\u51B2\u79EF\u538B\u65F6\u4E22\u5F03\u6392\u961F\u5E27\uFF0C\u4FDD\u6301\u8BED\u97F3\u5B9E\u65F6\u6027\u3002',
    maxWsSendBuffer: '\u6700\u5927 WS \u53D1\u9001\u7F13\u51B2',
    maxWsSendBufferDesc: '\u7F13\u51B2\u8D85\u8FC7\u6B64\u9608\u503C\u65F6\u4E22\u5F03/\u6682\u505C\u8BED\u97F3\u5E27\u3002',

    // Audio Quality
    audioQualityTitle: '\u97F3\u9891\u8D28\u91CF',
    opusBitrate: 'Opus \u7801\u7387',
    opusBitrateDesc: '\u964D\u4F4E\u7801\u7387\u6709\u52A9\u4E8E\u4E0D\u7A33\u5B9A\u7684\u4E0A\u884C\u7F51\u7EDC\u3002',

    // Input device
    inputDevice: '\u8F93\u5165\u8BBE\u5907',
    defaultDevice: '\u9ED8\u8BA4\u8BBE\u5907',
    microphoneFallback: '\u9EA6\u514B\u98CE ({id}...)',
    noDevicesDetected: '\u672A\u68C0\u6D4B\u5230\u8BBE\u5907\uFF0C\u8BF7\u5148\u6388\u6743\u9EA6\u514B\u98CE\u6743\u9650\u3002',

    // Mic processing
    micProcessing: '\u9EA6\u514B\u98CE\u5904\u7406',
    rnnoise: 'RNNoise (WASM) \u964D\u566A',
    rnnoiseDesc: '\u6539\u5584\u566A\u58F0\u5927/\u4F4E\u7AEF\u9EA6\u514B\u98CE\u7684\u6548\u679C\uFF0C\u4F46\u4F1A\u589E\u52A0 CPU \u8D1F\u62C5\u3002',
    browserNoiseSuppression: '\u6D4F\u89C8\u5668\u964D\u566A',
    browserNoiseSuppressionDesc: '\u4F7F\u7528 getUserMedia() \u5185\u7F6E\u5904\u7406\u3002',
    echoCancellation: '\u56DE\u58F0\u6D88\u9664',
    echoCancellationDesc: '\u4F7F\u7528\u627C\u58F0\u5668\uFF08\u800C\u975E\u8033\u673A\uFF09\u65F6\u5EFA\u8BAE\u5F00\u542F\u3002',
    agc: '\u81EA\u52A8\u589E\u76CA\u63A7\u5236 (AGC)',
    agcDesc: '\u4F4E\u8D28\u91CF\u9EA6\u514B\u98CE\u53EF\u80FD\u4F1A\u653E\u5927\u80CC\u666F\u566A\u58F0\u3002',
    changesApplyNote: '\u66F4\u6539\u5C06\u5728\u4E0B\u6B21\u5F00\u542F\u9EA6\u514B\u98CE\u65F6\u751F\u6548\u3002',
  },

  // ── Metrics panel ─────────────────────────────────────────────
  metrics: {
    title: '\u8FDE\u63A5\u8D28\u91CF\u76D1\u63A7',

    // Network latency
    networkLatency: '\u7F51\u7EDC\u5EF6\u8FDF',
    wsRtt: 'WebSocket RTT',
    mumbleServerRtt: 'Mumble \u670D\u52A1\u5668 RTT',
    jitter: '\u6296\u52A8',
    wsBuffer: 'WS \u7F13\u51B2',

    // Downlink
    voiceDownlink: '\u8BED\u97F3\u4E0B\u884C\uFF08\u63A5\u6536\uFF09',
    bitrate: '\u6BD4\u7279\u7387',
    frameRate: '\u5E27\u7387',
    playbackBuffer: '\u64AD\u653E\u7F13\u51B2',
    activeStreams: '\u6D3B\u8DC3\u6D41',
    totalFrames: '\u603B\u5E27\u6570',
    totalBytes: '\u603B\u5B57\u8282',
    droppedFrames: '\u4E22\u5E27',
    outOfOrderFrames: '\u4E71\u5E8F\u5E27',
    downlinkBitrate: '\u4E0B\u884C\u6BD4\u7279\u7387',

    // Uplink
    voiceUplink: '\u8BED\u97F3\u4E0A\u884C\uFF08\u53D1\u9001\uFF09',
    micLevel: '\u9EA6\u514B\u98CE\u97F3\u91CF',
    sendStatus: '\u53D1\u9001\u72B6\u6001',
    sending: '\u53D1\u9001\u4E2D',
    silent: '\u9759\u97F3',
    uplinkQueue: '\u4E0A\u884C\u961F\u5217',
    uplinkDropped: '\u4E0A\u884C\u4E22\u5E27',
    gatewayQueue: 'Gateway \u961F\u5217',
    gatewayDropped: 'Gateway \u4E22\u5E27',
    uplinkBitrate: '\u4E0A\u884C\u6BD4\u7279\u7387',
    micLevelChart: '\u9EA6\u514B\u98CE\u7535\u5E73',
  },

  // ── Overlay panel ─────────────────────────────────────────────
  overlay: {
    channel: '\u9891\u9053',
    noUsersInChannel: '\u9891\u9053\u5185\u65E0\u7528\u6237',
    you: '\u6211',
  },

  // ── Language selector ─────────────────────────────────────────
  language: {
    label: '\u8BED\u8A00',
  },
}

export default zh
