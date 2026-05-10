import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useTradingStore } from '../store/tradingStore'
import { useHistory } from '../hooks/useHistory'
import { useTheme } from '../theme/ThemeContext'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

type Range = '1d' | '1w' | '1m'

function fmt(n: number, symbol: string) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: symbol === 'BTC-USD' ? 0 : 2,
    maximumFractionDigits: symbol === 'BTC-USD' ? 0 : 2
  })
}

export function PriceChart() {
  const symbol = useTradingStore(s => s.selectedSymbol)
  const ticker = useTradingStore(s => s.tickers[s.selectedSymbol])
  const { theme } = useTheme()
  const [range, setRange] = useState<Range>('1d')
  const livePoints = useRef<number[]>([])
  const liveLabels = useRef<string[]>([])
  const chartRef = useRef<ChartJS<'line'> | null>(null)

  const { data: history, loading } = useHistory(symbol, range)

  // Seed chart with historical data when history loads
  useEffect(() => {
    if (!history.length) return
    livePoints.current = history.map(p => p.close)
    liveLabels.current = history.map(p => {
      const d = new Date(p.timestamp)
      return range === '1d'
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    })
    if (chartRef.current) {
      chartRef.current.data.labels = liveLabels.current
      chartRef.current.data.datasets[0].data = livePoints.current
      chartRef.current.update('none')
    }
  }, [history, range])

  // Append live tick
  useEffect(() => {
    if (!ticker || !chartRef.current) return
    const chart = chartRef.current
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    livePoints.current.push(ticker.price)
    liveLabels.current.push(now)
    // keep max 200 points
    if (livePoints.current.length > 200) {
      livePoints.current.shift()
      liveLabels.current.shift()
    }
    chart.data.labels = liveLabels.current
    chart.data.datasets[0].data = livePoints.current
    chart.update('none')
  }, [ticker?.price])

  const up = (ticker?.changePct ?? 0) >= 0

  const chartData = {
    labels: liveLabels.current,
    datasets: [{
      data: livePoints.current,
      borderColor: up ? '#00ff88' : '#ff6b6b',
      backgroundColor: up ? 'rgba(0,255,136,0.06)' : 'rgba(255,107,107,0.06)',
      borderWidth: 1.5,
      pointRadius: 0,
      fill: true,
      tension: 0.3,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    interaction: { intersect: false, mode: 'index' as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#0d1017' : '#f5f7fb',
        borderColor: theme === 'dark' ? '#2a3448' : '#d9e2f0',
        borderWidth: 1,
        titleColor: theme === 'dark' ? '#6b7f9e' : '#6b7f9e',
        bodyColor: theme === 'dark' ? '#c8d4e8' : '#2a3f5f',
        callbacks: {
          label: (ctx: any) => ` $${fmt(ctx.raw, symbol)}`
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          color: theme === 'dark' ? '#3d4f68' : '#9ca3af', 
          font: { size: 10 }, 
          maxTicksLimit: 8 
        },
        grid: { color: theme === 'dark' ? '#1e2535' : '#e5e7eb' },
      },
      y: {
        position: 'right' as const,
        ticks: { 
          color: theme === 'dark' ? '#6b7f9e' : '#6b7f9e', 
          font: { size: 10 }, 
          callback: (v: any) => `$${fmt(v, symbol)}` 
        },
        grid: { color: theme === 'dark' ? '#1e2535' : '#e5e7eb' },
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-900 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-light-700 dark:border-dark-700 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 flex-wrap">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-dark-700 dark:text-dark-300 font-heading">
              {symbol}
            </div>
            {ticker && (
              <div className="flex items-baseline gap-2 sm:gap-3 mt-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white">
                  ${fmt(ticker.price, symbol)}
                </span>
                <span className={`text-base ${up ? 'text-success' : 'text-danger'}`}>
                  {up ? '+' : ''}{ticker.changePct.toFixed(3)}%
                </span>
                <span className="text-xs sm:text-sm text-dark-500 dark:text-dark-600">
                  {up ? '▲' : '▼'} ${Math.abs(ticker.change).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Range selector */}
          <div className="flex gap-2">
            {(['1d', '1w', '1m'] as Range[]).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold tracking-widest transition-colors duration-200 ${
                  range === r
                    ? 'border-primary bg-blue-100 dark:bg-primary/10 text-blue-700 dark:text-primary'
                    : 'border-light-700 dark:border-dark-700 text-dark-600 dark:text-dark-600 hover:border-primary/50 dark:hover:border-primary/50 hover:text-primary dark:hover:text-primary/70'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 px-2 sm:px-4 py-3 sm:py-4 relative min-h-[200px] sm:min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-dark-500 dark:text-dark-600 text-xs sm:text-sm">
            Loading history...
          </div>
        ) : (
          <Line ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </div>
  )
}
