# Karan & Krishna Integration Guide

## 📖 What is this document?

This guide explains **how to connect your backend APIs** to the trading dashboard. Right now, the dashboard works with **mock data** (fake data for testing). This document shows you **exactly what APIs to build** and **how to connect them**.

---

## 🎯 Quick Overview

The dashboard needs **4 main API endpoints**:

1. **Krishna's Feed** → Live stock price predictions (candlestick charts)
2. **Karan's Execution** → Trading decision confirmations
3. **Uniguru Chat** → AI chatbot responses
4. **Analytics/Sentiment** → Market sentiment and recommendations

---

## 1. 📈 Krishna's Live Predictions Feed

### What it does:
Shows real-time candlestick charts for stocks. Users can search for any stock (like HDFCBANK, RELIANCE, etc.) and see its price chart.

### Files involved:
- `src/hooks/useLiveFeed.js` - Fetches data from your API
- `src/components/LiveFeed.jsx` - Displays the chart
- `src/components/AssetSearch.jsx` - Search bar for selecting stocks

### What you need to build:

#### Option 1: REST API (Easier to start)
**Endpoint:** `GET /feed/live?symbol=HDFCBANK`

**Example Request:**
```
GET https://api.yourdomain.com/feed/live?symbol=HDFCBANK
```

**Example Response (Format 1 - Recommended):**
```json
{
  "symbol": "HDFCBANK",
  "candles": [
    {
      "time": 1704067200,
      "open": 1575.50,
      "high": 1580.25,
      "low": 1572.30,
      "close": 1578.90
    },
    {
      "time": 1704067260,
      "open": 1578.90,
      "high": 1582.10,
      "low": 1576.50,
      "close": 1580.00
    }
  ]
}
```

**Example Response (Format 2 - Alternative):**
```json
[
  {
    "symbol": "HDFCBANK",
    "price": 1578.90,
    "change": 3.40,
    "timestamp": "2024-01-01T10:00:00Z"
  },
  {
    "symbol": "HDFCBANK",
    "price": 1580.00,
    "change": 4.50,
    "timestamp": "2024-01-01T10:01:00Z"
  }
]
```

**Important Notes:**
- The `symbol` parameter is **optional**. If not provided, return default data.
- If you send format 2, the frontend will automatically convert it to candles.
- Each candle needs: `time` (Unix timestamp), `open`, `high`, `low`, `close` prices.

#### Option 2: WebSocket (For real-time updates)
**URL:** `wss://feed.yourdomain.com/socket`

**How it works:**
1. Connect to WebSocket
2. Send subscription message: `{ "type": "subscribe", "symbol": "HDFCBANK" }`
3. Receive real-time updates: `{ "symbol": "HDFCBANK", "price": 1580.00, ... }`

**Setup:**
Add to your `.env` file:
```
VITE_FEED_WS_URL=wss://feed.yourdomain.com/socket
```

If WebSocket is not available, the app automatically falls back to REST API polling every 10 seconds.

---

## 2. ⚡ Karan's Execution & Chat

### What it does:
- **InputPanel**: User enters trade parameters (stock, stop-loss, target, etc.)
- **ActionPanel**: Shows trading decisions and confirms them
- **ChatPanel**: AI chatbot (Uniguru) answers questions about trades

### Files involved:
- `src/components/InputPanel.jsx` - Trade input form
- `src/components/ActionPanel.jsx` - Decision confirmation
- `src/components/ChatPanel.jsx` - AI chatbot

### What you need to build:

#### A. Trade Confirmation Endpoint
**Endpoint:** `POST /tools/confirm`

**Example Request:**
```json
{
  "symbol": "HDFCBANK",
  "action": "BUY",
  "price": 1575.00,
  "quantity": 10,
  "reason": "Strong momentum with 85% confidence"
}
```

**Example Response:**
```json
{
  "success": true,
  "orderId": "ORD-12345",
  "symbol": "HDFCBANK",
  "action": "BUY",
  "price": 1575.00,
  "quantity": 10,
  "confidence": 85,
  "reason": "Strong momentum with 85% confidence",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

#### B. Trade Preview Endpoint (Optional but recommended)
**Endpoint:** `POST /tools/preview`

**Example Request:**
```json
{
  "symbol": "HDFCBANK",
  "stopLoss": 5,
  "targetReturn": 10,
  "investmentAmount": 5000,
  "riskMode": "auto"
}
```

**Example Response:**
```json
{
  "action": "BUY",
  "confidence": 82.5,
  "summary": "Model recommends BUY with 82.5% confidence. Expect 10% upside vs 5% downside.",
  "recommendedQuantity": 3,
  "estimatedRisk": "Low"
}
```

#### C. Chatbot Endpoint
**Endpoint:** `POST /chat/query`

**Example Request:**
```json
{
  "query": "What's the trend on TCS?",
  "context": {
    "conversation": [...previous messages...]
  }
}
```

**Example Response (Simple):**
```json
{
  "answer": "TCS is showing bullish momentum with steady volume expansion. Current price is holding above 50-DMA."
}
```

**Example Response (Rich Format - Recommended):**
```json
{
  "summary": "Trend check: price is holding above the 50-DMA with steady volume expansion.",
  "details": [
    { "label": "Bias", "value": "Moderately Bullish" },
    { "label": "Support", "value": "₹3,480" },
    { "label": "Trigger", "value": "Close above ₹3,560" }
  ]
}
```

**Note:** If you send the rich format, it will display as a nice card with labels and values. Otherwise, it shows as plain text.

---

## 3. 📊 Insights & Sentiment

### What it does:
Shows market sentiment, AI recommendations, and latest executed trades.

### File involved:
- `src/components/InsightsPanel.jsx`

### What you need to build:

**Endpoint:** `GET /analytics/sentiment`

**Example Response:**
```json
{
  "sentimentScore": 68,
  "sentimentLabel": "Bullish",
  "sentimentContext": "Options positioning indicates steady buying interest.",
  "action": "BUY",
  "confidence": 82,
  "timeframe": "Next 2 sessions",
  "commentary": "Look to accumulate quality banks with tight stops.",
  "latestTrade": {
    "symbol": "AAPL",
    "action": "BUY",
    "timestamp": "2024-01-01T10:00:00Z",
    "reason": "Follow-through on breakout with 1.2% risk."
  }
}
```

**Field Explanations:**
- `sentimentScore`: Number from 0-100 (0 = very bearish, 100 = very bullish)
- `sentimentLabel`: "Bullish", "Bearish", or "Neutral"
- `action`: "BUY", "SELL", or "HOLD"
- `confidence`: Number from 0-100 (how confident the AI is)

---

## 4. 🎨 Other Components (Mock Data)

These components currently use **mock data** (fake data). You can replace them later with real APIs:

| Component | What it shows | Mock data location |
|-----------|---------------|-------------------|
| **PortfolioOverview** | Total equity, daily P&L, exposure | `src/components/PortfolioOverview.jsx` (line 5) |
| **MarketEvents** | Upcoming events (Fed speech, earnings) | `src/components/MarketEvents.jsx` (line 5) |
| **MultiAssetBoard** | Table of stocks/crypto/commodities | `src/components/MultiAssetBoard.jsx` (line 11) |

**To replace with real data:**
1. Find the `mockPortfolio`, `mockEvents`, or `mockRows` object in the component
2. Replace it with an API call
3. Keep the same data structure (same field names)

---

## 5. ⚙️ Environment Setup

Create a `.env` file in the `trading-dashboard` folder:

```env
# Required
VITE_API_BASE_URL=https://api.yourdomain.com

# Optional (for WebSocket)
VITE_FEED_WS_URL=wss://feed.yourdomain.com/socket
```

**How it works:**
- If `VITE_API_BASE_URL` is set, all API calls go to that URL
- If `VITE_FEED_WS_URL` is set, it tries WebSocket first, then falls back to REST
- If not set, the app uses mock data (works offline)

---

## 6. ✅ Step-by-Step Integration Checklist

### Phase 1: Basic Setup
- [ ] Set up your backend server
- [ ] Create `.env` file with `VITE_API_BASE_URL`
- [ ] Test that your API is accessible

### Phase 2: Krishna's Feed (Charts)
- [ ] Build `GET /feed/live?symbol=SYMBOL` endpoint
- [ ] Test with a few symbols (HDFCBANK, RELIANCE, TCS)
- [ ] Verify response format matches examples above
- [ ] (Optional) Set up WebSocket for real-time updates

### Phase 3: Karan's Execution
- [ ] Build `POST /tools/confirm` endpoint
- [ ] Build `POST /tools/preview` endpoint (optional)
- [ ] Test trade confirmations work
- [ ] Verify responses match expected format

### Phase 4: Chatbot
- [ ] Build `POST /chat/query` endpoint
- [ ] Test simple text responses
- [ ] (Optional) Add rich format with `summary` and `details`

### Phase 5: Analytics
- [ ] Build `GET /analytics/sentiment` endpoint
- [ ] Test sentiment scores and recommendations
- [ ] Verify all fields are included

### Phase 6: Polish (Optional)
- [ ] Replace PortfolioOverview mock data
- [ ] Replace MarketEvents mock data
- [ ] Replace MultiAssetBoard mock data
- [ ] Add error handling and loading states

---

## 7. 🎉 Features Already Completed

These features are **already working** in the frontend:

- ✅ **Stock Search**: Users can search for any stock/crypto/commodity
- ✅ **Chart Updates**: Chart automatically updates when a stock is selected
- ✅ **Multi-asset Filtering**: Search bar in MultiAssetBoard to filter assets
- ✅ **Chat Input**: Enter to send message, Shift+Enter for new line
- ✅ **Mock Data Fallback**: Everything works offline with mock data

---

## 8. 🆘 Troubleshooting

### Problem: Chart not showing data
**Solution:** Check that your API returns data in the correct format (see examples above)

### Problem: API calls failing
**Solution:** 
1. Check `VITE_API_BASE_URL` in `.env`
2. Verify CORS is enabled on your backend
3. Check browser console for error messages

### Problem: WebSocket not connecting
**Solution:**
1. Leave `VITE_FEED_WS_URL` blank to use REST API instead
2. The app automatically falls back to REST if WebSocket fails

### Problem: Chat not responding
**Solution:** The chat works with mock data even if API fails. Check that `/chat/query` endpoint returns the expected format.

---

## 📝 Summary

**Minimum to get started:**
1. Build `GET /feed/live?symbol=SYMBOL` → Charts will work
2. Build `POST /tools/confirm` → Trade confirmations will work
3. Build `POST /chat/query` → Chatbot will work
4. Build `GET /analytics/sentiment` → Insights will work

**Everything else is optional and can be added later!**

The frontend is **ready to use** - just connect your APIs and it will work! 🚀
