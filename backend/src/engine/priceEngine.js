const { EventEmitter } = require('events');

const TICKERS = {
  'AAPL':    { price: 293.32, volatility: 0.008, name: 'Apple Inc.' },
  'TSLA':    { price: 428.00, volatility: 0.018, name: 'Tesla Inc.' },
  'BTC-USD': { price: 77400,  volatility: 0.022, name: 'Bitcoin' },
  'MSFT':    { price: 415.00, volatility: 0.007, name: 'Microsoft Corp.' },
  'NVDA':    { price: 215.00, volatility: 0.015, name: 'NVIDIA Corp.' },
};

class PriceEngine extends EventEmitter {
  constructor() {
    super();
    this.prices = {};
    this.intervals = {};

    Object.entries(TICKERS).forEach(([symbol, data]) => {
      this.prices[symbol] = { ...data, symbol, change: 0, changePct: 0, prevPrice: data.price };
    });
  }

  _nextPrice(symbol) {
    const ticker = this.prices[symbol];
    const drift = (Math.random() - 0.495) * ticker.volatility;
    const newPrice = parseFloat((ticker.price * (1 + drift)).toFixed(2));
    const change = parseFloat((newPrice - ticker.prevPrice).toFixed(2));
    const changePct = parseFloat(((change / ticker.prevPrice) * 100).toFixed(3));

    this.prices[symbol] = {
      ...ticker,
      price: newPrice,
      change,
      changePct,
      prevPrice: ticker.prevPrice,
      timestamp: Date.now(),
    };

    return this.prices[symbol];
  }

  start(intervalMs = 800) {
    Object.keys(this.prices).forEach(symbol => {
      // stagger start times slightly
      const delay = Math.random() * 400;
      setTimeout(() => {
        this.intervals[symbol] = setInterval(() => {
          const tick = this._nextPrice(symbol);
          this.emit('tick', tick);
          this.emit(`tick:${symbol}`, tick);
        }, intervalMs);
      }, delay);
    });
  }

  stop() {
    Object.values(this.intervals).forEach(clearInterval);
    this.intervals = {};
  }

  getSnapshot() {
    return Object.values(this.prices);
  }

  getPrice(symbol) {
    return this.prices[symbol] || null;
  }

  getTickers() {
    return Object.entries(TICKERS).map(([symbol, data]) => ({
      symbol,
      name: data.name,
      price: this.prices[symbol].price,
    }));
  }
}

module.exports = { PriceEngine, TICKERS };
