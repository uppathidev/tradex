const request = require('supertest');
const { PriceEngine, TICKERS } = require('../engine/priceEngine');
const { getHistory, clearCache } = require('../cache/historyCache');

// ── Price Engine ──────────────────────────────────────────────
describe('PriceEngine', () => {
  let engine;

  beforeEach(() => { engine = new PriceEngine(); });
  afterEach(() => { engine.stop(); });

  test('initialises prices for all tickers', () => {
    const snap = engine.getSnapshot();
    expect(snap.length).toBe(Object.keys(TICKERS).length);
    snap.forEach(t => {
      expect(t).toHaveProperty('symbol');
      expect(t).toHaveProperty('price');
      expect(t).toHaveProperty('volatility');
    });
  });

  test('getPrice returns ticker data', () => {
    const price = engine.getPrice('AAPL');
    expect(price).not.toBeNull();
    expect(price.symbol).toBe('AAPL');
    expect(typeof price.price).toBe('number');
  });

  test('getPrice returns null for unknown ticker', () => {
    expect(engine.getPrice('FAKE')).toBeNull();
  });

  test('getTickers returns name + price', () => {
    const tickers = engine.getTickers();
    expect(tickers.length).toBeGreaterThan(0);
    tickers.forEach(t => {
      expect(t).toHaveProperty('symbol');
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('price');
    });
  });

  test('emits tick events after start', (done) => {
    engine.on('tick', (tick) => {
      expect(tick).toHaveProperty('symbol');
      expect(tick).toHaveProperty('price');
      expect(tick).toHaveProperty('changePct');
      engine.stop();
      done();
    });
    engine.start(50);
  });
});

// ── History Cache ─────────────────────────────────────────────
describe('History Cache', () => {
  beforeEach(() => clearCache());

  test('generates history data points for 1d', () => {
    const data = getHistory('AAPL', 189, 0.008, '1d');
    expect(data.length).toBeGreaterThan(0);
    data.forEach(pt => {
      expect(pt).toHaveProperty('timestamp');
      expect(pt).toHaveProperty('open');
      expect(pt).toHaveProperty('high');
      expect(pt).toHaveProperty('low');
      expect(pt).toHaveProperty('close');
      expect(pt).toHaveProperty('volume');
    });
  });

  test('1w returns more data than 1d', () => {
    const day = getHistory('AAPL', 189, 0.008, '1d');
    const week = getHistory('AAPL', 189, 0.008, '1w');
    expect(week.length).toBeGreaterThan(day.length);
  });

  // test('returns cached result on second call', () => {
  //   const first = getHistory('TSLA', 245, 0.018, '1d');
  //   const second = getHistory('TSLA', 245, 0.018, '1d');
  //   expect(first).toBe(second); // same reference = cached
  // });
});

// ── REST API ──────────────────────────────────────────────────
describe('REST API', () => {
  let app, server, engine;

  beforeAll(() => {
    const http = require('http');
    const express = require('express');
    const cors = require('cors');
    const { createRouter } = require('../api/routes');

    engine = new PriceEngine();
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api', createRouter(engine));
    server = http.createServer(app);
  });

  afterAll(() => { engine.stop(); server.close(); });

  test('GET /api/health returns ok', async () => {
    const res = await request(server).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/tickers returns ticker list', async () => {
    const res = await request(server).get('/api/tickers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tickers)).toBe(true);
    expect(res.body.tickers.length).toBeGreaterThan(0);
  });

  test('GET /api/snapshot returns price snapshot', async () => {
    const res = await request(server).get('/api/snapshot');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/history/AAPL?range=1d returns history', async () => {
    const res = await request(server).get('/api/history/AAPL?range=1d');
    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe('AAPL');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/history/FAKE returns 404', async () => {
    const res = await request(server).get('/api/history/FAKE');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/history/AAPL?range=bad returns 400', async () => {
    const res = await request(server).get('/api/history/AAPL?range=bad');
    expect(res.status).toBe(400);
  });
});
