const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 }); // 5 min TTL

function generateHistory(symbol, basePrice, volatility, days = 30) {
  const points = days * 24; // 1 point per hour
  const history = [];
  let price = basePrice;
  const now = Date.now();

  for (let i = points; i >= 0; i--) {
    const drift = (Math.random() - 0.495) * volatility;
    price = parseFloat((price * (1 + drift)).toFixed(2));
    const open = price;
    const high = parseFloat((price * (1 + Math.random() * volatility)).toFixed(2));
    const low = parseFloat((price * (1 - Math.random() * volatility)).toFixed(2));
    const close = parseFloat((price * (1 + (Math.random() - 0.5) * volatility * 0.5)).toFixed(2));
    const volume = Math.floor(Math.random() * 5000000 + 500000);

    history.push({
      timestamp: now - i * 3600 * 1000,
      open,
      high,
      low,
      close,
      volume,
    });
  }
  return history;
}

function getHistory(symbol, basePrice, volatility, range = '1d') {
  const cacheKey = `${symbol}:${range}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const days = range === '1w' ? 7 : range === '1m' ? 30 : 1;
  const history = generateHistory(symbol, basePrice, volatility, days);
  cache.set(cacheKey, history);
  return history;
}

function clearCache() {
  cache.flushAll();
}

module.exports = { getHistory, clearCache };
