# Handoff Checklist

This file summarizes how to connect real data to the UI and what remains mocked as of now.

---

## Environment Variables

| Variable | Purpose | Notes |
|----------|---------|-------|
| `VITE_API_BASE_URL` | Base REST endpoint | Used by axios (`src/services/api.js`). Required for `/feed/live`, `/tools/confirm`, `/chat/query`, `/analytics/sentiment`. |
| `VITE_FEED_WS_URL` | WebSocket endpoint (optional) | `useLiveFeed` tries this first. If absent or fails, it falls back to REST polling every 10s. |

Copy `.env.example` → `.env` and fill these values before running `npm run dev` or `npm run build`.

---

## API Wiring

1. **Live feed (chart)**  
   - Update `VITE_FEED_WS_URL` to point to Krishna’s socket.  
   - If only REST is available, ensure `/feed/live` returns either a candle array or the existing snapshot format so `normalizeCandles` can build synthetic candles.

2. **Sentiment & Insights**  
   - Implement `/analytics/sentiment` in the backend or proxy; it should return `{ sentimentScore, sentimentLabel, action, confidence, timeframe, commentary, latestTrade }`.
   - `InsightsPanel` already shows mock data if the endpoint is missing, so nothing breaks in demo mode.

3. **Action Preview / Confirm**  
   - Replace the mock preview logic in `InputPanel` with a real endpoint when available (e.g., `/preview/action`).  
   - `ActionPanel` already posts to `/tools/confirm`; if that endpoint isn’t ready, the UI marks rows as mock.

4. **Chatbot**  
   - `/chat/query` should return `{ answer, summary, details }` for rich responses.  
   - While offline, the ChatPanel builds fallback insights automatically.

---

## Remaining Mock Data (Safe to Replace Anytime)

- `getMockCandles()` in `LiveFeed.jsx`
- `getMockInsights()` in `InsightsPanel.jsx`
- `mockPortfolio` in `PortfolioOverview.jsx`
- `mockEvents` in `MarketEvents.jsx`
- `mockRows` in `MultiAssetBoard.jsx`

Each of these is isolated in its component so swapping to live data is a single edit.

---

## Suggested Next Tasks

1. Plug in real endpoints and remove console warnings.
2. Add alerting/notification logic (e.g., “refresh predictions at 14:00” banner).
3. Consider code-splitting or `manualChunks` tweaks if bundle size becomes an issue (>500 kB warning).
4. Add QA/regression tests once backend data is stable.

With these steps, the UI is ready for a full backend hookup and eventual deployment.***

