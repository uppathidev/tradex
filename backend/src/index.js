const http = require('http');
const express = require('express');
const cors = require('cors');
const { PriceEngine } = require('./engine/priceEngine');
const { createRouter } = require('./api/routes');
const { createWsServer } = require('./ws/wsServer');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

const engine = new PriceEngine();
app.use('/api', createRouter(engine));

const server = http.createServer(app);
createWsServer(server, engine);

engine.start(800);

server.listen(PORT, () => {
  console.log(`\n🚀 Trading Backend running at http://localhost:${PORT}`);
  console.log(`   REST API : http://localhost:${PORT}/api/tickers`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
  console.log(`   Health   : http://localhost:${PORT}/api/health\n`);
});

module.exports = { app, server, engine };
