'use client'

import { useGatewayStore } from '../../../src/state/gateway-store'
import { Button } from '../../../components/ui/button'
import { cn } from '../../../src/ui/cn'
import { Activity, Hash, BarChart3, Settings, LogOut, PictureInPicture2 } from 'lucide-react'

interface TopBarProps {
  pipAvailable: boolean
  showOverlay: boolean
  onShowMetrics: () => void
  onShowSettings: () => void
  onToggleOverlay: () => void
  onDisconnect: () => void
}

export function TopBar({ pipAvailable, showOverlay, onShowMetrics, onShowSettings, onToggleOverlay, onDisconnect }: TopBarProps) {
  const wsRttMs = useGatewayStore(s => s.metrics.wsRttMs)
  const serverRttMs = useGatewayStore(s => s.metrics.serverRttMs)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Hash className="h-4 w-4 text-primary" />
        </div>
        <h1 className="font-semibold text-sm">Mumble Web</h1>
        <div className="mx-2 h-4 w-[1px] bg-border" />
        <p
          className="text-xs text-muted-foreground flex items-center gap-3 cursor-pointer hover:text-foreground transition-colors"
          onClick={onShowMetrics}
          title="点击查看详细指标"
        >
          <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {wsRttMs != null ? Math.round(wsRttMs) : '-'}ms</span>
          <span className="hidden sm:inline">Server: {serverRttMs != null ? Math.round(serverRttMs) : '-'}ms</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={!pipAvailable}
          onClick={onToggleOverlay}
          title={pipAvailable ? 'Speaker Overlay (PiP)' : 'PiP not supported in this browser'}
          className={cn("text-muted-foreground hover:text-foreground", showOverlay && "text-primary")}
        >
          <PictureInPicture2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowMetrics}
          title="Connection Metrics"
          className="text-muted-foreground hover:text-foreground"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Settings" onClick={onShowSettings} className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDisconnect} title="Disconnect">
          <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </header>
  )
}
