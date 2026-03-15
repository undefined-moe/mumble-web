'use client'

import { useGatewayStore } from '../../../src/state/gateway-store'
import { Button } from '../../../components/ui/button'
import { cn } from '../../../src/ui/cn'
import { Activity, Hash, BarChart3, Settings, LogOut, PictureInPicture2 } from 'lucide-react'
import { useT, useLocaleStore, localeLabels, localeList, type Locale } from '../../../src/i18n'

interface TopBarProps {
  pipAvailable: boolean
  showOverlay: boolean
  onShowMetrics: () => void
  onShowSettings: () => void
  onToggleOverlay: () => void
  onDisconnect: () => void
}

export function TopBar({ pipAvailable, showOverlay, onShowMetrics, onShowSettings, onToggleOverlay, onDisconnect }: TopBarProps) {
  const t = useT()
  const locale = useLocaleStore(s => s.locale)
  const setLocale = useLocaleStore(s => s.setLocale)
  const wsRttMs = useGatewayStore(s => s.metrics.wsRttMs)
  const serverRttMs = useGatewayStore(s => s.metrics.serverRttMs)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Hash className="h-4 w-4 text-primary" />
        </div>
        <h1 className="font-semibold text-sm">{t.topBar.title}</h1>
        <div className="mx-2 h-4 w-[1px] bg-border" />
        <p
          className="text-xs text-muted-foreground flex items-center gap-3 cursor-pointer hover:text-foreground transition-colors"
          onClick={onShowMetrics}
          title={t.topBar.clickForMetrics}
        >
          <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {wsRttMs != null ? Math.round(wsRttMs) : '-'}ms</span>
          <span className="hidden sm:inline">{t.topBar.server}: {serverRttMs != null ? Math.round(serverRttMs) : '-'}ms</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={!pipAvailable}
          onClick={onToggleOverlay}
          title={pipAvailable ? t.topBar.speakerOverlay : t.topBar.pipNotSupported}
          className={cn("text-muted-foreground hover:text-foreground", showOverlay && "text-primary")}
        >
          <PictureInPicture2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowMetrics}
          title={t.topBar.connectionMetrics}
          className="text-muted-foreground hover:text-foreground"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title={t.topBar.settings} onClick={onShowSettings} className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
        <div className="flex items-center border-l border-border pl-2 ml-1">
          {localeList.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              className={cn(
                "px-1.5 py-0.5 text-[10px] rounded transition-colors",
                locale === loc ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {localeLabels[loc]}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={onDisconnect} title={t.topBar.disconnect}>
          <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </header>
  )
}
