# API Endpoints Summary

All endpoints are now ready and implemented in the backend.

## ✅ Available Endpoints

### Authentication Endpoints (Port 5000)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Market Data Endpoints (Port 5000)
- `GET /api/market/candles?symbol=SYMBOL&interval=MINUTES` - Get candlestick data

### Trading Tools Endpoints (Port 5000)
- `POST /api/tools/confirm` - Confirm trading decision
- `POST /api/tools/predict` - Get predictions for assets
- `POST /api/tools/scan_all` - Scan all assets and return shortlist

### Chat Endpoints (Port 5000)
- `POST /api/chat/query` - Send chat query to chatbot

### Analytics Endpoints (Port 5000)
- `GET /api/analytics/sentiment` - Get market sentiment and insights

### Health Check
- `GET /api/health` - Server health check

## ⚠️ Important Note

**Port Configuration:**
- The backend server runs on **port 5000** (default)
- The frontend expects trading APIs on **port 3000** by default
- Auth APIs are correctly configured for port 5000

**To fix the port mismatch, you have two options:**

### Option 1: Update Frontend to use port 5000 for all APIs
Update `trading-dashboard/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
```

### Option 2: Run backend on port 3000
Update `trading-dashboard/backend/server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

Or set environment variable:
```bash
PORT=3000 node server.js
```

## 📝 Endpoint Details

### POST /api/tools/confirm
**Request:**
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
    "targetReturn": 10
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-1234567890-ABC123",
  "status": "confirmed",
  "filledPrice": 175.42,
  "filledQuantity": 10,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### POST /api/tools/predict
**Request:**
```json
{
  "symbols": ["AAPL", "MSFT"],
  "riskParams": {
    "stopLoss": 5,
    "targetReturn": 10
  },
  "horizon": "intraday"
}
```

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "symbol": "AAPL",
      "assetType": "Stock",
      "predicted_price": 175.42,
      "score": 75.5,
      "action": "BUY",
      "confidence": 85.0,
      "risk": {
        "stopLoss": 5,
        "targetReturn": 10
      }
    }
  ],
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### POST /api/tools/scan_all
**Request:**
```json
{
  "filters": {
    "minScore": 50,
    "minConfidence": 60,
    "actions": ["BUY", "HOLD"]
  },
  "limit": 20,
  "sortBy": "score",
  "sortOrder": "desc"
}
```

**Response:**
```json
{
  "success": true,
  "shortlist": [...],
  "total": 20,
  "filtered": 15,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### POST /api/chat/query
**Request:**
```json
{
  "query": "What's the trend on TCS?",
  "context": {
    "conversation": [],
    "currentPortfolio": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Based on current market data...",
  "summary": "Trend check: price is holding above the 50-DMA",
  "details": [
    { "label": "Bias", "value": "Moderately Bullish" },
    { "label": "Support", "value": "₹3,480" }
  ],
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### GET /api/analytics/sentiment
**Response:**
```json
{
  "success": true,
  "sentimentScore": 68.5,
  "sentimentLabel": "Moderately Bullish",
  "marketIndicators": {
    "volatility": 25.3,
    "volume": 1250000,
    "momentum": 0.75
  },
  "recommendations": [...],
  "latestTrades": [...],
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## 🚀 Testing

All endpoints are ready and can be tested. They currently return mock data but are structured to easily integrate with real services.

To test:
```bash
# Start backend
cd trading-dashboard/backend
npm install
node server.js

# Test endpoints
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/tools/predict -H "Content-Type: application/json" -d '{"symbols":["AAPL"]}'
```

