import { useState } from "react";
import { useTradingStore } from "../store/tradingStore";

export function AlertPanel() {
  const symbol = useTradingStore((s) => s.selectedSymbol);
  const ticker = useTradingStore((s) => s.tickers[s.selectedSymbol]);
  const alerts = useTradingStore((s) => s.alerts);
  const notifications = useTradingStore((s) => s.notifications);
  const addAlert = useTradingStore((s) => s.addAlert);
  const removeAlert = useTradingStore((s) => s.removeAlert);
  const dismissNotification = useTradingStore((s) => s.dismissNotification);

  const [type, setType] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState("");

  const handleAdd = () => {
    const val = parseFloat(threshold);
    if (!isNaN(val) && val > 0) {
      addAlert(symbol, type, val);
      setThreshold("");
    }
  };

  const activeAlerts = alerts.filter((a) => a.symbol === symbol);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {notifications.length > 0 && (
        <div className="px-3 sm:px-4 py-2 border-b border-light-700 dark:border-dark-700 flex-shrink-0">
          {notifications.map((n, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700/50 rounded-lg p-2 mb-2 text-xs text-yellow-800 dark:text-warning break-words"
            >
              <span className="flex-1">{n}</span>
              <button
                onClick={() => dismissNotification(i)}
                className="bg-none border-none text-yellow-700 dark:text-yellow-600 cursor-pointer text-lg hover:text-yellow-900 dark:hover:text-yellow-400 flex-shrink-0 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="px-3 sm:px-4 py-3 flex-1 overflow-hidden hover:overflow-y-auto">
        <div className="text-xs text-dark-500 dark:text-dark-600 tracking-widest mb-3 font-bold">
          PRICE ALERTS — {symbol}
        </div>

        <div className="flex flex-col sm:flex-row gap-1.5 mb-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "above" | "below")}
            className="flex-shrink-0 bg-white dark:bg-dark-900 border border-light-700 dark:border-dark-700 rounded-lg text-dark-700 dark:text-dark-300 text-xs px-2 py-1.5 font-mono"
          >
            <option value="above">▲ Above</option>
            <option value="below">▼ Below</option>
          </select>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder={ticker ? `e.g. ${ticker.price.toFixed(0)}` : "Price"}
            className="flex-1 min-w-0 bg-white dark:bg-dark-900 border border-light-700 dark:border-dark-700 rounded-lg text-dark-700 dark:text-dark-300 text-xs px-2 py-1.5 font-mono placeholder-dark-400 dark:placeholder-dark-600"
          />
          <button
            onClick={handleAdd}
            className="flex-shrink-0 bg-blue-100 dark:bg-primary/20 border border-blue-400 dark:border-primary rounded-lg text-blue-700 dark:text-primary text-xs px-2 py-1.5 font-bold font-mono hover:bg-blue-200 dark:hover:bg-primary/30 transition-colors whitespace-nowrap"
          >
            + SET
          </button>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="text-xs text-dark-500 dark:text-dark-600 text-center py-3">
            No alerts set for {symbol}
          </div>
        ) : (
          <div className="space-y-1">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  alert.triggered
                    ? "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-700/50 text-green-800 dark:text-success"
                    : "bg-light-900 dark:bg-dark-900 border-light-700 dark:border-dark-700 text-dark-600 dark:text-dark-300"
                }`}
              >
                <span className="font-bold flex-1 break-words">
                  {alert.type === "above" ? "▲" : "▼"} $
                  {alert.threshold.toFixed(2)}
                  {alert.triggered && " ✓"}
                </span>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="bg-none border-none text-dark-400 dark:text-dark-600 cursor-pointer text-lg hover:text-primary flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
