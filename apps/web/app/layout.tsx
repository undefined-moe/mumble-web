import type { Metadata } from 'next'
import './globals.css'
import { HtmlLangSync } from './html-lang-sync'
import { VConsoleTrigger } from './vconsole-trigger'

export const metadata: Metadata = {
  title: 'Mumble Web (Next)',
  description: 'Mumble web client (Next.js + WebSocket gateway)'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <HtmlLangSync />
        <VConsoleTrigger />
        {children}
      </body>
    </html>
  )
}
