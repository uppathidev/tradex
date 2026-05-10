import { useTradingStore, TickerData } from '../store/tradingStore'

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function TickerRow({ ticker, selected, onClick }: { ticker: TickerData, selected: boolean, onClick: () => void }) {
  const tickerNames = useTradingStore(s => s.tickerNames)
  const up = ticker.changePct >= 0

  return (
    <div
      onClick={onClick}
      className={`ticker-row px-4 py-3 cursor-pointer border-l-2 border-l-transparent transition-colors ${
        selected 
          ? 'bg-light-900 dark:bg-dark-900 border-l-primary' 
          : 'border-l-transparent hover:bg-light-800 dark:hover:bg-dark-800'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className={`text-lg font-bold tracking-tight ${
            selected 
              ? 'text-primary' 
              : 'text-dark-700 dark:text-dark-300'
          }`}>
            {ticker.symbol}
          </div>
          <div className="text-xs text-dark-500 dark:text-dark-600 mt-1">
            {tickerNames[ticker.symbol] || ticker.symbol}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-dark-700 dark:text-dark-300">
            ${fmt(ticker.price, ticker.symbol === 'BTC-USD' ? 0 : 2)}
          </div>
          <div className={`text-xs mt-1 ${up ? 'text-success' : 'text-danger'}`}>
            {up ? '+' : ''}{fmt(ticker.changePct, 3)}%
          </div>
        </div>
      </div>
    </div>
  )
}

export function TickerList({ onSelect }: { onSelect?: () => void }) {
  const tickers = useTradingStore(s => s.tickers)
  const tickerNames = useTradingStore(s => s.tickerNames)
  const tickerOrder = useTradingStore(s => s.tickerOrder)
  const selected = useTradingStore(s => s.selectedSymbol)
  const setSelected = useTradingStore(s => s.setSelected)

  // Use fetched order if available, otherwise use available symbols
  const sorted = (tickerOrder.length > 0 ? tickerOrder : Object.keys(tickers))
    .map(s => tickers[s])
    .filter(Boolean)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-900">
      <div className="px-4 py-3 text-xs text-dark-500 dark:text-dark-600 tracking-widest border-b border-light-700 dark:border-dark-700 font-bold flex-shrink-0">
        LIVE TICKERS
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {sorted.length === 0 ? (
          <div className="p-5 text-xs text-dark-500 dark:text-dark-600 text-center">
            Connecting...
          </div>
        ) : (
          sorted.map(t => (
            <TickerRow
              key={t.symbol}
              ticker={t}
              selected={t.symbol === selected}
              onClick={() => {
                setSelected(t.symbol)
                onSelect?.()
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
