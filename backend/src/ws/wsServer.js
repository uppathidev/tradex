const { WebSocketServer } = require('ws');

function createWsServer(server, engine) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {

    ws.subscriptions = new Set();

    // Send initial snapshot on connect
    ws.send(JSON.stringify({
      type: 'snapshot',
      data: engine.getSnapshot(),
    }));

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        // Subscribe: { type: 'subscribe', symbols: ['AAPL', 'TSLA'] }
        if (msg.type === 'subscribe' && Array.isArray(msg.symbols)) {
          msg.symbols.forEach(s => ws.subscriptions.add(s.toUpperCase()));
          ws.send(JSON.stringify({ type: 'subscribed', symbols: [...ws.subscriptions] }));
        }

        // Unsubscribe: { type: 'unsubscribe', symbols: ['AAPL'] }
        if (msg.type === 'unsubscribe' && Array.isArray(msg.symbols)) {
          msg.symbols.forEach(s => ws.subscriptions.delete(s.toUpperCase()));
        }

        // Subscribe all
        if (msg.type === 'subscribe_all') {
          engine.getSnapshot().forEach(t => ws.subscriptions.add(t.symbol));
        }

      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      }
    });

    ws.on('error', (err) => console.error('[WS] Error:', err.message));
  });

  // Broadcast price ticks to subscribed clients
  engine.on('tick', (tick) => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN
        const subs = client.subscriptions;
        if (subs.size === 0 || subs.has(tick.symbol)) {
          client.send(JSON.stringify({ type: 'tick', data: tick }));
        }
      }
    });
  });

  return wss;
}

module.exports = { createWsServer };
