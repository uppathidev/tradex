import { useState, useEffect, useRef } from 'react'

interface HistoryPoint {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

const cache = new Map<string, HistoryPoint[]>()

export function useHistory(symbol: string, range: '1d' | '1w' | '1m') {
  const [data, setData] = useState<HistoryPoint[]>([])
  const [loading, setLoading] = useState(false)

  const key = `${symbol}:${range}`
  const prevKey = useRef('')

  useEffect(() => {
    if (prevKey.current === key) return
    prevKey.current = key

    if (cache.has(key)) {
      setData(cache.get(key)!)
      return
    }

    setLoading(true)
    fetch(`/api/history/${symbol}?range=${range}`)
      .then(r => r.json())
      .then(res => {
        cache.set(key, res.data)
        setData(res.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [key, symbol, range])

  return { data, loading }
}
