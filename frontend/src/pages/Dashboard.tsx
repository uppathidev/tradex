import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../theme/ThemeContext'
import { useWebSocket } from '../hooks/useWebSocket'
import { useFetchTickers } from '../hooks/useFetchTickers'
import { TickerList } from '../components/TickerList'
import { PriceChart } from '../components/PriceChart'
import { AlertPanel } from '../components/AlertPanel'
import { useTradingStore } from '../store/tradingStore'

export function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useWebSocket()
  useFetchTickers()

  const tickers = useTradingStore(s => s.tickers)
  const count = Object.keys(tickers).length
  const isLive = count > 0

  return (
    <div className="flex flex-col h-screen bg-light-950 text-dark-700 font-mono overflow-hidden dark:bg-dark-950 dark:text-dark-300">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-4 sm:px-6 h-nav border-b border-light-700 bg-white dark:border-dark-700 dark:bg-dark-900 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-primary font-heading hidden sm:inline">
            ⬡ TRADEX
          </span>
          <span className="text-xs text-primary sm:hidden">⬡</span>
          <span className="text-xs text-dark-500 dark:text-dark-600 tracking-widest hidden sm:inline">MOCK TERMINAL</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isLive
                  ? 'bg-success shadow-glow-success'
                  : 'bg-danger'
              }`}
            />
            <span className="text-xs text-dark-500 dark:text-dark-600 hidden sm:inline">
              {isLive ? 'LIVE' : 'CONNECTING'}
            </span>
          </div>

          <span className="text-xs text-dark-300 dark:text-dark-700 hidden sm:inline">|</span>

          {/* User info */}
          <span className="text-xs sm:text-sm text-dark-600 dark:text-dark-500 hidden sm:inline">{user}</span>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="px-2.5 py-1.5 text-base border border-dark-300 dark:border-dark-700 rounded-lg bg-light-900 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-light-800 dark:hover:bg-dark-700 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Exit button */}
          <button onClick={logout} className="button-secondary px-2 sm:px-2.5 py-1 text-xs">
            EXIT
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sm:hidden button-secondary px-2 py-1 text-xs"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Main Content - Responsive Grid Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Ticker List (Desktop: Fixed, Mobile: Collapsible) */}
        <div
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } sm:block sm:w-48 md:w-56 border-r border-light-700 dark:border-dark-700 bg-white dark:bg-dark-900 flex-shrink-0 absolute sm:relative w-48 h-[calc(100vh-var(--nav-height))] sm:h-full z-40 sm:z-auto top-nav sm:-mt-[53px] sm:relative`}
          style={{ marginTop: '-53px', position: 'relative' }}
        >
          <TickerList onSelect={() => setSidebarOpen(false)} />
        </div>

        {/* Center - Price Chart & Alerts (Main content) */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <PriceChart />
          
          {/* Mobile/Tablet Alerts Below Chart - Limited Height */}
          <div className="md:hidden h-1/3 border-t border-light-700 dark:border-dark-700 overflow-hidden">
            <AlertPanel />
          </div>
        </div>

        {/* Right Sidebar - Alerts (Desktop: Fixed, md+: Visible) */}
        <div className="hidden md:flex md:flex-col md:w-56 lg:w-60 border-l border-light-700 dark:border-dark-700 bg-white dark:bg-dark-900 flex-shrink-0 overflow-hidden">
          <AlertPanel />
        </div>
      </div>
    </div>
  )
}
