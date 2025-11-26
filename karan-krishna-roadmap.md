# Karan & Krishna Integration Roadmap

This document explains exactly where to plug in backend APIs for Karan’s execution logic and Krishna’s prediction feeds inside `trading-dashboard/`.

---

## 1. Krishna – Live Predictions Feed

| Path | Purpose |
|------|---------|
| `src/hooks/useLiveFeed.js` | Tries `VITE_FEED_WS_URL` (WebSocket) first, falls back to REST polling. |
| `src/components/LiveFeed.jsx` | Consumes the hook, normalizes data into candles, and displays it. |

**What to do**
1. Provide a WebSocket endpoint (e.g., `wss://krishna.yourdomain.com/feed`). Set `VITE_FEED_WS_URL` in `.env`.
2. REST fallback hits `GET /feed/live` via `getLiveFeed()` (`src/services/api.js`). Ensure it returns either:
   - `{ symbol, candles: [...] }` with OHLC data **or**
   - An array of snapshots `{ price, change, timestamp }` so `normalizeCandles` can build synthetic candles.
3. Optional sentiment data should come from `/analytics/sentiment` (see Insights section).

---

## 2. Karan – Execution & Chat Logic

| Component / File | Endpoint expectation |
|------------------|----------------------|
| `src/components/InputPanel.jsx` | `POST /tools/confirm` (already wired) for final confirmations. Add a real preview endpoint later (e.g., `POST /tools/preview`). |
| `src/components/ActionPanel.jsx` | Displays confirmed trades. Response from `/tools/confirm` should include `action`, `reason`, `confidence`, `timestamp`. |
| `src/components/ChatPanel.jsx` | `POST /chat/query` should return `{ answer, summary, details[] }`. When offline, the UI generates mock rich responses. |

**What to do**
1. Build a preview endpoint in Karan’s backend so `handlePreview` can fetch real recommendations.
2. Ensure `/tools/confirm` returns the same schema ActionPanel expects (symbol, action, price, quantity, confidence, reason, timestamp).
3. For the chatbot, include `summary` + `details` arrays to trigger the rich card layout (see `buildAssistantMessage` in `ChatPanel.jsx`).

---

## 3. Insights & Sentiment

| Path | Purpose |
|------|---------|
| `src/components/InsightsPanel.jsx` | Calls `getSentimentSummary()` (`/analytics/sentiment`). Shows sentiment score, model recommendation, and latest trade. |

**What to do**
1. Implement `/analytics/sentiment` so it returns:
   ```json
   {
     "sentimentScore": 68,
     "sentimentLabel": "Bullish",
     "sentimentContext": "...",
     "action": "BUY",
     "confidence": 82,
     "timeframe": "Next 2 sessions",
     "commentary": "...",
     "latestTrade": { "symbol": "AAPL", "action": "BUY", "timestamp": "...", "reason": "..." }
   }
   ```
2. Until this endpoint exists, InsightsPanel keeps using mock data automatically.

---

## 4. Additional UI Modules

These components currently show mock data but are ready to accept real feeds:

| Component | Mock data location |
|-----------|--------------------|
| `src/components/PortfolioOverview.jsx` | `mockPortfolio` object inside the component. Replace with API response (equity, P&L, exposure, cash buffer, leverage). |
| `src/components/MarketEvents.jsx` | `mockEvents` array. Swap with backend/DB events. |
| `src/components/MultiAssetBoard.jsx` | `mockRows` object. Hook into actual stocks/crypto/commodity tables. |

When wiring these up, keep the schema identical so the UI doesn’t need refactoring.

---

## 5. Environment Summary

Set these in `.env` (see `.env.example`):
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_FEED_WS_URL=wss://feed.yourdomain.com/socket
```

Optional extras (if/when available):
```
VITE_CHAT_MODEL=karan-v1             # for future use
VITE_ANALYTICS_VERSION=2025-Alpha    # for tracking releases
```

---

## 6. Next Steps Checklist

1. Stand up the REST endpoints (`/feed/live`, `/tools/confirm`, `/chat/query`, `/analytics/sentiment`).
2. Provide a WebSocket feed URL for Krishna’s live predictions (or leave `VITE_FEED_WS_URL` blank to stay on polling).
3. Replace mock data objects in the new cards with real responses.
4. Optional: add alert/notification endpoints for Market Events if you want server-driven updates.

Once these are connected, the front-end can be deployed without further code changes.***

