import { useEffect, useRef, useCallback } from 'react'
import { useTradingStore } from '../store/tradingStore'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4000'

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<number | null>(null)
  const updateTicker = useTradingStore(s => s.updateTicker)

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'subscribe_all' }))
      }

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data)
          if (msg.type === 'tick' && msg.data) {
            updateTicker(msg.data)
          }
          if (msg.type === 'snapshot' && Array.isArray(msg.data)) {
            msg.data.forEach(updateTicker)
          }
        } catch {}
      }

      ws.onclose = () => {
        reconnectTimer.current = window.setTimeout(connect, 3000)
      }

      ws.onerror = () => ws.close()
    } catch (err) {
      console.error('[WS] Failed to connect:', err)
      reconnectTimer.current = window.setTimeout(connect, 3000)
    }
  }, [updateTicker])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])
}
