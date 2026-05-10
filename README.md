# TradeEx — Real-Time Mock Trading Dashboard

TradeEx is a modern real-time trading dashboard that simulates live financial market activity using WebSockets, interactive charts, and configurable price alerts.

Built with a modular architecture using React, TypeScript, Node.js, Socket.IO, and Chart.js.

---

# ✨ Features

## 🔐 Authentication

- Mock user authentication
- Login / Logout functionality
- Session persistence

---

## 📈 Market Dashboard

- Live ticker price updates (mock market feed)
- Real-time WebSocket streaming
- Interactive price charts using Chart.js
- Historical market data for:
  - 1D
  - 1W
  - 1M

- Client-side caching for historical chart data
- Responsive and modern UI

---

## ⚡ Real-Time Streaming

- WebSocket-based market updates
- Streaming interval: every ~800ms
- Efficient subscription-based ticker updates
- Auto reconnection support

---

## 🔔 Price Alerts

- Create price threshold alerts
- Alert conditions:
  - Above target price
  - Below target price

- Real-time alert triggering
- Persisted alert configuration

---

## 🌗 Theme Support

- Dark and Light theme modes
- Smooth theme switching experience
- Persistent theme preference using localStorage
- Tailwind CSS dark mode implementation

---

# 🛠️ Technology Stack

## Frontend

- React 18.2
- TypeScript
- Vite
- Tailwind CSS 3.4
- Zustand
- Chart.js
- Socket.IO Client

## Backend

- Node.js 20 LTS
- Express 4.18
- Socket.IO

## Infrastructure

- Docker
- Kubernetes

---

# 🚀 Quick Start (Local Development)

## 1️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs at: **http://localhost:4000**

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

# 🔑 Demo Credentials

Use any of the following demo accounts:

| Username | Password |
| -------- | -------- |
| demo     | demo123  |
| trader   | trade456 |
| admin    | admin789 |

---

# 🐳 Run with Docker

```bash
docker-compose up --build
```

Application URL:

```text
http://localhost:3000
```

---

# 📡 REST API

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/api/tickers`                  | List all available tickers |
| GET    | `/api/snapshot`                 | Current market snapshot    |
| GET    | `/api/history/:symbol?range=1d` | Historical OHLCV data      |
| GET    | `/api/health`                   | Health check endpoint      |

---

# 🔌 WebSocket API

Connect to:

```text
ws://localhost:4000
```

## Client Messages

### Subscribe to all tickers

```json
{ "type": "subscribe_all" }
```

### Subscribe to selected tickers

```json
{ "type": "subscribe", "symbols": ["AAPL", "TSLA"] }
```

### Unsubscribe from tickers

```json
{ "type": "unsubscribe", "symbols": ["AAPL"] }
```

---

## Server Messages

### Market snapshot

```json
{
  "type": "snapshot",
  "data": []
}
```

### Real-time ticker update

```json
{
  "type": "tick",
  "data": {
    "symbol": "AAPL",
    "price": 190.5,
    "changePct": 0.3
  }
}
```

---

# 🧪 Running Tests

## Backend Tests

```bash
cd backend
npm test
```

## Frontend Tests

```bash
cd frontend
npm test
```

---

# 🏗️ Project Structure

```text
tradeex/
├── backend/
│   ├── src/
│   │   ├── engine/
│   │   │   └── priceEngine.js       # Mock market simulation
│   │   ├── ws/
│   │   │   └── wsServer.js          # WebSocket server
│   │   ├── api/
│   │   │   └── routes.js            # REST API routes
│   │   ├── cache/
│   │   │   └── historyCache.js      # Historical data cache
│   │   ├── alerts/
│   │   ├── auth/
│   │   └── index.js                 # Application entry point
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   │   └── AuthContext.tsx      # Authentication context
│   │   ├── store/
│   │   │   └── tradingStore.ts      # Zustand store
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts      # WebSocket hook
│   │   │   └── useHistory.ts        # History + caching
│   │   ├── components/
│   │   │   ├── TickerList.tsx       # Live ticker sidebar
│   │   │   ├── PriceChart.tsx       # Chart.js chart
│   │   │   └── AlertPanel.tsx       # Price alerts UI
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── Dashboard.tsx
│   │   └── App.tsx
│   └── Dockerfile
│
├── k8s/
│   └── manifests.yaml
│
├── docker-compose.yml
└── README.md
```

---

# 📊 Supported Market Tickers

| Symbol  | Name       | Base Price |
| ------- | ---------- | ---------- |
| AAPL    | Apple Inc. | $293.32    |
| TSLA    | Tesla Inc. | $428.00    |
| BTC-USD | Bitcoin    | $77,400    |
| MSFT    | Microsoft  | $415.00    |
| NVDA    | NVIDIA     | $215.00    |

Prices are simulated using a random-walk algorithm and update approximately every 800ms.

---

# 🧠 Architecture Highlights

- Modular monolith architecture
- Event-driven real-time updates
- WebSocket room-based subscriptions
- Scalable service boundaries
- Client-side caching strategy
- Dockerized deployment workflow
- Kubernetes-ready manifests

---

# 🔮 Future Improvements

- Kafka event streaming
- Real brokerage API integration
- Advanced chart indicators
- Portfolio tracking

---

# 📄 License

This project is intended for educational and assessment purposes.
