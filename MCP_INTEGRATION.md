# MCP Integration Guide

**Version 1.0**  
**Last Updated:** 2024

This guide provides detailed information about integrating the Trading Dashboard with MCP (Model Context Protocol) endpoints and LangGraph orchestration.

---

## Table of Contents

1. [Overview](#overview)
2. [MCP Endpoint Specifications](#mcp-endpoint-specifications)
3. [Request/Response Formats](#requestresponse-formats)
4. [Integration Steps](#integration-steps)
5. [Mock Endpoint Stubs](#mock-endpoint-stubs)
6. [LangGraph Integration](#langgraph-integration)
7. [Testing](#testing)

---

## Overview

The Trading Dashboard is designed to integrate with MCP-style endpoints for predictions, asset scanning, and trade execution. The system uses a modular architecture that allows easy integration with:

- **Krishna's Prediction Engine**: Live feed and predictions
- **Karan's Execution Engine**: Trade confirmation and decision logic
- **Uniguru Chatbot**: AI assistant for market queries
- **LangGraph Orchestration**: Workflow automation and agent coordination

---

## MCP Endpoint Specifications

### Base URL

```
Frontend API: http://localhost:3000/api (or VITE_API_BASE_URL)
Auth API: http://localhost:5000/api (or VITE_AUTH_API_BASE_URL)
```

### Endpoints

#### 1. `/feed/live` (GET)

**Purpose:** Get live predictions feed from Krishna's endpoint

**Method:** `GET`

**Query Parameters:**
- `symbol` (optional): Asset symbol to fetch data for

**Response:**
```json
{
  "symbol": "AAPL",
  "candles": [
    {
      "time": "2024-01-01T10:00:00Z",
      "open": 175.0,
      "high": 176.5,
      "low": 174.8,
      "close": 175.42,
      "volume": 1000000
    }
  ],
  "predicted_price": 175.42,
  "confidence": 85,
  "action": "BUY"
}
```

**Usage:**
```javascript
import { getLiveFeed } from './services/api'

// Get feed for specific symbol
const feed = await getLiveFeed('AAPL')

// Get general feed
const feed = await getLiveFeed()
```

---

#### 2. `/tools/predict` (POST)

**Purpose:** Get predictions for assets via MCP-style endpoint

**Method:** `POST`

**Request Body:**
```json
{
  "symbols": ["AAPL", "RELIANCE", "HDFCBANK"],
  "riskParams": {
    "stopLoss": 5,
    "targetReturn": 10,
    "capitalAtRisk": 2,
    "horizon": "week"
  },
  "filters": {
    "minScore": 50,
    "minConfidence": 60
  }
}
```

**Response:**
```json
{
  "predictions": [
    {
      "symbol": "AAPL",
      "assetType": "Stock",
      "predicted_price": 175.42,
      "score": 92,
      "action": "BUY",
      "confidence": 88,
      "risk_applied": {
        "stopLoss": 5,
        "targetReturn": 10,
        "capitalAtRisk": 2
      }
    }
  ],
  "timestamp": "2024-01-01T10:00:00Z"
}
```

**Usage:**
```javascript
import { predict } from './services/api'

const predictions = await predict({
  symbols: ['AAPL', 'RELIANCE'],
  riskParams: {
    stopLoss: 5,
    targetReturn: 10,
    capitalAtRisk: 2,
    horizon: 'week'
  }
})
```

---

#### 3. `/tools/scan_all` (POST)

**Purpose:** Scan all assets and return shortlist via MCP-style endpoint

**Method:** `POST`

**Request Body:**
```json
{
  "filters": {
    "minScore": 50,
    "maxRisk": 10,
    "assetTypes": ["Stock", "Crypto"],
    "minConfidence": 60
  },
  "limit": 20,
  "sortBy": "score",
  "sortOrder": "desc"
}
```

**Response:**
```json
{
  "shortlist": [
    {
      "symbol": "AAPL",
      "assetType": "Stock",
      "predicted_price": 175.42,
      "score": 92,
      "action": "BUY",
      "confidence": 88,
      "risk_applied": {
        "stopLoss": 5,
        "targetReturn": 10
      }
    }
  ],
  "total": 150,
  "filtered": 20,
  "timestamp": "2024-01-01T10:00:00Z"
}
```

**Usage:**
```javascript
import { scanAll } from './services/api'

const shortlist = await scanAll({
  filters: {
    minScore: 50,
    maxRisk: 10
  },
  limit: 20
})
```

---

#### 4. `/tools/confirm` (POST)

**Purpose:** Confirm trading decision via Karan's endpoint

**Method:** `POST`

**Request Body:**
```json
{
  "symbol": "AAPL",
  "action": "BUY",
  "price": 175.42,
  "quantity": 10,
  "reason": "Breakout with 1.2% risk",
  "confidence": 88,
  "riskParams": {
    "stopLoss": 5,
    "targetReturn": 10,
    "capitalAtRisk": 2
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-12345",
  "status": "confirmed",
  "filledPrice": 175.42,
  "filledQuantity": 10,
  "timestamp": "2024-01-01T10:00:00Z"
}
```

**Usage:**
```javascript
import { confirmDecision } from './services/api'

const confirmation = await confirmDecision({
  symbol: 'AAPL',
  action: 'BUY',
  price: 175.42,
  quantity: 10,
  reason: 'Breakout with 1.2% risk'
})
```

---

#### 5. `/chat/query` (POST)

**Purpose:** Send chat query to Uniguru chatbot

**Method:** `POST`

**Request Body:**
```json
{
  "query": "What's the trend on TCS?",
  "context": {
    "conversation": [],
    "currentPortfolio": [],
    "riskParams": {}
  }
}
```

**Response:**
```json
{
  "answer": "TCS is showing bullish momentum...",
  "summary": "Trend check: price is holding above the 50-DMA",
  "details": [
    {
      "label": "Bias",
      "value": "Moderately Bullish"
    },
    {
      "label": "Support",
      "value": "₹3,480"
    }
  ]
}
```

**Usage:**
```javascript
import { sendChatQuery } from './services/api'

const response = await sendChatQuery('What\'s the trend on TCS?', {
  conversation: messages
})
```

---

#### 6. `/analytics/sentiment` (GET)

**Purpose:** Fetch sentiment and model insights

**Method:** `GET`

**Response:**
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

**Usage:**
```javascript
import { getSentimentSummary } from './services/api'

const sentiment = await getSentimentSummary()
```

---

## Request/Response Formats

### Standard Request Headers

```
Content-Type: application/json
Authorization: Bearer <token> (if authenticated)
```

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## Integration Steps

### Step 1: Set Up Environment Variables

Create `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AUTH_API_BASE_URL=http://localhost:5000/api
VITE_FEED_WS_URL=wss://feed.yourdomain.com/socket
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure API Client

The API client is already configured in `src/services/api.js`. It includes:
- Request interceptors for authentication
- Response interceptors for error handling
- Automatic token management

### Step 4: Use API Functions

Import and use API functions in your components:

```javascript
import { predict, scanAll, confirmDecision, getLiveFeed } from '../services/api'

// In your component
const handlePredict = async () => {
  try {
    const predictions = await predict({
      symbols: ['AAPL'],
      riskParams: riskContext
    })
    setPredictions(predictions)
  } catch (error) {
    console.error('Prediction failed:', error)
    // Fallback to mock data
  }
}
```

### Step 5: Handle Errors Gracefully

All API functions throw errors that should be caught:

```javascript
try {
  const data = await someApiCall()
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('API Error:', error.response.data)
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error')
  } else {
    // Something else
    console.error('Error:', error.message)
  }
  // Fallback to mock data or show error message
}
```

---

## Mock Endpoint Stubs

For development and testing, mock endpoints can be implemented. Here are example stubs:

### Mock `/tools/predict`

```javascript
// Backend mock endpoint
app.post('/api/tools/predict', (req, res) => {
  const { symbols, riskParams } = req.body
  
  const predictions = symbols.map(symbol => ({
    symbol,
    assetType: 'Stock',
    predicted_price: Math.random() * 200 + 100,
    score: Math.floor(Math.random() * 30) + 70,
    action: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)],
    confidence: Math.floor(Math.random() * 30) + 70,
    risk_applied: riskParams || {}
  }))
  
  res.json({ predictions, timestamp: new Date().toISOString() })
})
```

### Mock `/tools/scan_all`

```javascript
// Backend mock endpoint
app.post('/api/tools/scan_all', (req, res) => {
  const { filters, limit = 20 } = req.body
  
  const allAssets = [
    { symbol: 'AAPL', assetType: 'Stock' },
    { symbol: 'RELIANCE', assetType: 'Stock' },
    { symbol: 'BTCUSD', assetType: 'Crypto' },
    // ... more assets
  ]
  
  const shortlist = allAssets
    .map(asset => ({
      ...asset,
      predicted_price: Math.random() * 200 + 100,
      score: Math.floor(Math.random() * 50) + 50,
      action: 'BUY',
      confidence: Math.floor(Math.random() * 30) + 70
    }))
    .filter(item => item.score >= (filters?.minScore || 0))
    .slice(0, limit)
  
  res.json({
    shortlist,
    total: allAssets.length,
    filtered: shortlist.length,
    timestamp: new Date().toISOString()
  })
})
```

---

## LangGraph Integration

### LangGraph Client

The dashboard includes a LangGraph client (`src/services/langGraphClient.js`) that handles:

1. **Risk Snapshot Logging**
   ```javascript
   await LangGraphClient.sendRiskSnapshot(riskParams)
   ```

2. **Feedback Logging**
   ```javascript
   await LangGraphClient.sendFeedback(feedbackData)
   ```

3. **Sync All Data**
   ```javascript
   await LangGraphClient.syncAll({
     endpoint: '/langgraph/mock-ingest',
     onPayload: (payload) => console.log(payload)
   })
   ```

4. **Export JSON**
   ```javascript
   LangGraphClient.exportJson() // Downloads JSON file
   ```

### LangGraph Adapter Pattern

The LangGraph adapter allows the frontend to communicate with LangGraph nodes:

```javascript
// Example: Trigger prediction via LangGraph
const langGraphAdapter = {
  async triggerPrediction(params) {
    // This would call LangGraph node
    // which then calls MCP endpoint /tools/predict
    return await predict(params)
  }
}
```

---

## Testing

### Manual Testing

1. **Test Prediction Endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/tools/predict \
     -H "Content-Type: application/json" \
     -d '{"symbols": ["AAPL"], "riskParams": {"stopLoss": 5}}'
   ```

2. **Test Scan All:**
   ```bash
   curl -X POST http://localhost:3000/api/tools/scan_all \
     -H "Content-Type: application/json" \
     -d '{"filters": {"minScore": 50}, "limit": 10}'
   ```

### Component Testing

Test components that use API functions:

```javascript
// Example test
import { render, screen, waitFor } from '@testing-library/react'
import { predict } from './services/api'
import Scorecards from './components/Scorecards'

jest.mock('./services/api')

test('displays predictions', async () => {
  predict.mockResolvedValue({
    predictions: [
      { symbol: 'AAPL', score: 90, action: 'BUY' }
    ]
  })
  
  render(<Scorecards risk={{}} />)
  
  await waitFor(() => {
    expect(screen.getByText('AAPL')).toBeInTheDocument()
  })
})
```

---

## Error Handling

### Common Error Codes

- `NETWORK_ERROR`: No response from server
- `AUTH_ERROR`: Authentication failed
- `VALIDATION_ERROR`: Invalid request parameters
- `SERVER_ERROR`: Server-side error (500+)

### Fallback Strategy

The dashboard implements graceful fallbacks:

1. **API Failure → Mock Data**: If API fails, show mock data
2. **WebSocket Failure → Polling**: If WebSocket fails, use HTTP polling
3. **Component Error → Error State**: Show error message, allow retry

---

## Best Practices

1. **Always Handle Errors**: Wrap API calls in try-catch
2. **Use Loading States**: Show loading indicators during API calls
3. **Implement Retry Logic**: Retry failed requests with exponential backoff
4. **Cache Responses**: Cache API responses when appropriate
5. **Validate Input**: Validate request parameters before sending
6. **Log Interactions**: Log all API calls for debugging

---

## Next Steps

1. **Backend Implementation**: Implement actual backend endpoints
2. **WebSocket Setup**: Set up WebSocket server for real-time updates
3. **Authentication**: Implement proper JWT token management
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Monitoring**: Set up monitoring and logging

---

## Support

For questions or issues:
- Check the main README.md
- Review component source code
- Check browser console for errors
- Verify API endpoints are accessible

---

**End of MCP Integration Guide**



