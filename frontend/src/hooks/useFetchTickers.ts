import { useEffect } from 'react'
import { useTradingStore } from '../store/tradingStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function useFetchTickers() {
  const setTickerNames = useTradingStore(s => s.setTickerNames)

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tickers`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const json = await response.json()
        const tickers = json.tickers || []
        
        const names: Record<string, string> = {}
        tickers.forEach((t: any) => {
          names[t.symbol] = t.name
        })
        
        const order = tickers.map((t: any) => t.symbol)
        
        setTickerNames(names, order)
      } catch (err) {
        console.error('[Tickers] Failed to fetch:', err)
      }
    }

    fetchTickers()
  }, [setTickerNames])
}
