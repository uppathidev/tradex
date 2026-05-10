const express = require('express');
const { getHistory } = require('../cache/historyCache');
const { TICKERS } = require('../engine/priceEngine');

function createRouter(engine) {
  const router = express.Router();

  // GET /api/tickers - list all available tickers
  router.get('/tickers', (req, res) => {
    res.json({ tickers: engine.getTickers() });
  });

  // GET /api/snapshot - current prices for all tickers
  router.get('/snapshot', (req, res) => {
    res.json({ data: engine.getSnapshot() });
  });

  // GET /api/history/:symbol?range=1d|1w|1m
  router.get('/history/:symbol', (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const range = req.query.range || '1d';

    const ticker = TICKERS[symbol];
    if (!ticker) {
      return res.status(404).json({ error: `Ticker '${symbol}' not found` });
    }

    const validRanges = ['1d', '1w', '1m'];
    if (!validRanges.includes(range)) {
      return res.status(400).json({ error: `Invalid range. Use: ${validRanges.join(', ')}` });
    }

    const history = getHistory(symbol, ticker.price, ticker.volatility, range);
    res.json({ symbol, range, count: history.length, data: history });
  });

  // GET /api/health
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
  });

  return router;
}

module.exports = { createRouter };
