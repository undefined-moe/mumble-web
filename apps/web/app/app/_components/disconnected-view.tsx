'use client'

import { useGatewayStore } from '../../../src/state/gateway-store'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Activity } from 'lucide-react'

export function DisconnectedView() {
  const gatewayStatus = useGatewayStore(s => s.gatewayStatus)
  const status = useGatewayStore(s => s.status)
  const connectError = useGatewayStore(s => s.connectError)
  const disconnect = useGatewayStore(s => s.disconnect)

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Activity className="h-5 w-5" />
            {status === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Gateway Status: <span className="font-mono text-foreground">{gatewayStatus}</span></p>
          {connectError ? <p className="text-sm rounded-md bg-destructive/10 p-2 text-destructive">{connectError}</p> : null}
          <div className="flex gap-2">
            <Button onClick={() => (window.location.href = '/')}>Back to Login</Button>
            {status === 'reconnecting' ? (
              <Button variant="secondary" onClick={() => disconnect()}>
                Cancel Reconnect
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
