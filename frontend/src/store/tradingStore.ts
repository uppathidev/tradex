import { create } from 'zustand'

export interface TickerData {
  symbol: string
  name: string
  price: number
  change: number
  changePct: number
  prevPrice: number
  volatility: number
  timestamp: number
}

export interface Alert {
  id: string
  symbol: string
  type: 'above' | 'below'
  threshold: number
  triggered: boolean
  createdAt: number
}

interface TradingStore {
  tickers: Record<string, TickerData>
  selectedSymbol: string
  alerts: Alert[]
  notifications: string[]
  tickerNames: Record<string, string>
  tickerOrder: string[]

  updateTicker: (data: TickerData) => void
  setSelected: (symbol: string) => void
  addAlert: (symbol: string, type: 'above' | 'below', threshold: number) => void
  removeAlert: (id: string) => void
  checkAlerts: (data: TickerData) => void
  dismissNotification: (idx: number) => void
  setTickerNames: (names: Record<string, string>, order: string[]) => void
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  tickers: {},
  selectedSymbol: 'AAPL',
  alerts: [],
  notifications: [],
  tickerNames: {},
  tickerOrder: [],

  updateTicker: (data) => {
    set(state => ({
      tickers: { ...state.tickers, [data.symbol]: data }
    }))
    get().checkAlerts(data)
  },

  setSelected: (symbol) => set({ selectedSymbol: symbol }),

  addAlert: (symbol, type, threshold) => {
    const alert: Alert = {
      id: `${Date.now()}-${Math.random()}`,
      symbol,
      type,
      threshold,
      triggered: false,
      createdAt: Date.now(),
    }
    set(state => ({ alerts: [...state.alerts, alert] }))
  },

  removeAlert: (id) =>
    set(state => ({ alerts: state.alerts.filter(a => a.id !== id) })),

  checkAlerts: (data) => {
    const { alerts } = get()
    let triggered = false

    const updated = alerts.map(alert => {
      if (alert.triggered || alert.symbol !== data.symbol) return alert
      const hit =
        (alert.type === 'above' && data.price >= alert.threshold) ||
        (alert.type === 'below' && data.price <= alert.threshold)
      if (hit) {
        triggered = true
        const msg = `🔔 ${data.symbol} ${alert.type === 'above' ? '▲' : '▼'} $${alert.threshold.toFixed(2)} — now $${data.price.toFixed(2)}`
        set(state => ({ notifications: [msg, ...state.notifications.slice(0, 4)] }))
        return { ...alert, triggered: true }
      }
      return alert
    })

    if (triggered) set({ alerts: updated })
  },

  dismissNotification: (idx) =>
    set(state => ({
      notifications: state.notifications.filter((_, i) => i !== idx)
    })),

  setTickerNames: (names, order) =>
    set({ tickerNames: names, tickerOrder: order }),
}))
