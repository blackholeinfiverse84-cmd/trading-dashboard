# Karan & Krishna Integration Guide - Complete Connectivity Details

## 📖 What is this document?

This guide provides **complete connectivity details** for integrating Krishna's prediction engine and Karan's execution engine with the trading dashboard. All API endpoints, request/response formats, and integration patterns are documented here.

---

## 🚀 QUICK START SETUP (For Karan & Krishna)

### Prerequisites

Before connecting your backends, ensure you have:

- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** installed
- Your backend APIs ready (Krishna's prediction engine & Karan's execution engine)

### Step 1: Clone & Install

```bash
# Navigate to project directory
cd trading-dashboard

# Install dependencies
npm install
```

**Expected Output:**
```
✓ Dependencies installed successfully
✓ No errors
```

### Step 2: Environment Configuration

Create a `.env` file in the `trading-dashboard/` folder:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Mac/Linux
touch .env
```

Add the following content to `.env`:

```env
# Main API Base URL (Krishna & Karan)
# Replace with your actual backend URL
VITE_API_BASE_URL=http://localhost:3000/api

# Authentication API Base URL
# Replace with your auth server URL
VITE_AUTH_API_BASE_URL=http://localhost:5000/api

# WebSocket URL (Optional - for real-time feed)
# Leave empty if using REST polling only
VITE_FEED_WS_URL=wss://feed.yourdomain.com/socket
```

**Important Notes:**
- Replace `localhost:3000` with your actual backend server URL
- Replace `localhost:5000` with your actual auth server URL
- If using different ports, update accordingly
- For production, use HTTPS URLs (e.g., `https://api.yourdomain.com`)

### Step 3: Verify Installation

```bash
# Check if dependencies are installed
npm list --depth=0

# Verify build works
npm run build
```

**Expected Output:**
```
✓ Build completed successfully
✓ No TypeScript errors
✓ No linting errors
```

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open your browser:** `http://localhost:5173`

### Step 5: Verify Frontend is Running

1. **Open Browser Console** (F12)
2. **Check for Errors:**
   - Should see: "No errors" or minimal warnings
   - API calls will fail initially (expected - backends not connected yet)

3. **Test Mock Data:**
   - Dashboard should load with mock data
   - Scorecards should show sample predictions
   - Live Feed should display sample chart
   - All components should render without errors

### Step 6: Connect Your Backends

#### For Krishna (Prediction Engine):

1. **Start your backend server** on the port specified in `VITE_API_BASE_URL`
2. **Verify endpoints are accessible:**
   ```bash
   # Test from terminal
   curl http://localhost:3000/api/feed/live?symbol=AAPL
   curl -X POST http://localhost:3000/api/tools/predict -H "Content-Type: application/json" -d '{"symbols":["AAPL"]}'
   curl -X POST http://localhost:3000/api/tools/scan_all -H "Content-Type: application/json" -d '{"filters":{"minScore":50}}'
   ```

3. **Enable CORS** in your backend:
   ```python
   # Python/Flask example
   from flask_cors import CORS
   CORS(app, origins=["http://localhost:5173"])
   ```

#### For Karan (Execution Engine):

1. **Start your backend server** on the port specified in `VITE_API_BASE_URL`
2. **Verify endpoint is accessible:**
   ```bash
   curl -X POST http://localhost:3000/api/tools/confirm \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"symbol":"AAPL","action":"BUY","price":175.42,"quantity":10}'
   ```

3. **Enable CORS** in your backend (same as above)

### Step 7: Test Integration

1. **Refresh the frontend** (`http://localhost:5173`)
2. **Open Browser Console** (F12) → Network tab
3. **Test each feature:**
   - **Live Feed:** Search for a symbol (e.g., "AAPL")
   - **Scorecards:** Should fetch from `/tools/scan_all`
   - **Input Panel:** Fill form and click "Predict + Action Preview"
   - **Action Panel:** Click "Confirm" on a decision
   - **Chat Panel:** Send a message

4. **Verify API Calls:**
   - Check Network tab for successful API calls
   - Verify responses match expected format (see endpoint docs below)
   - Check for CORS errors (should be none)

### Step 8: Troubleshooting

#### Problem: "Cannot connect to backend"

**Solutions:**
- Verify backend server is running
- Check `VITE_API_BASE_URL` in `.env` matches your backend URL
- Verify CORS is enabled on backend
- Check firewall/network settings

#### Problem: "CORS Error"

**Solutions:**
```python
# Backend CORS setup (Python/Flask)
from flask_cors import CORS
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])

# Backend CORS setup (Node.js/Express)
const cors = require('cors')
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
```

#### Problem: "401 Unauthorized"

**Solutions:**
- Check if token is stored: `localStorage.getItem('token')`
- Verify token is valid and not expired
- Check Authorization header is being sent (see Network tab)

#### Problem: "404 Not Found"

**Solutions:**
- Verify endpoint URL is correct
- Check base URL in `.env` file
- Verify backend routes match expected paths

#### Problem: "Build Errors"

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Current Project Status ✅

**Frontend Status:** 100% Complete
- ✅ All components implemented
- ✅ All API functions ready
- ✅ Mock data fallback working
- ✅ Error handling in place
- ✅ Responsive design (mobile/tablet/desktop/4K)
- ✅ Authentication system ready
- ✅ Build passes without errors

**Ready for Integration:**
- ✅ Krishna's endpoints: `/feed/live`, `/tools/predict`, `/tools/scan_all`
- ✅ Karan's endpoint: `/tools/confirm`
- ✅ Uniguru endpoint: `/chat/query`
- ✅ Analytics endpoint: `/analytics/sentiment`
- ✅ Auth endpoints: `/auth/login`, `/auth/register`, `/auth/verify`

**What You Need to Do:**
1. ✅ Set up `.env` file (Step 2)
2. ✅ Start your backend servers
3. ✅ Enable CORS on your backends
4. ✅ Test endpoints match expected format
5. ✅ Verify integration works

---

## 🎯 Quick Overview

The dashboard connects to **7 main API endpoints**:

1. **Krishna's Feed** → `GET /feed/live` - Live stock price predictions (candlestick charts)
2. **Krishna's Predictions** → `POST /tools/predict` - Get predictions for specific assets
3. **Krishna's Scan** → `POST /tools/scan_all` - Scan and rank all assets
4. **Karan's Execution** → `POST /tools/confirm` - Trading decision confirmations
5. **Uniguru Chat** → `POST /chat/query` - AI chatbot responses
6. **Analytics/Sentiment** → `GET /analytics/sentiment` - Market sentiment and recommendations
7. **Authentication** → `POST /auth/login`, `POST /auth/register`, `GET /auth/verify` - User authentication

---

## 🔌 Complete API Connectivity Map

### Frontend → Backend Connection Flow

```
┌─────────────────┐
│  React Frontend │
│  (Vite + React) │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
    ┌────▼─────────────────────────────────────┐
    │         API Client Layer                 │
    │    (src/services/api.js)                 │
    │  - Axios instances                       │
    │  - Request interceptors                  │
    │  - Response interceptors                 │
    │  - Error handling                        │
    └────┬─────────────────────────────────────┘
         │
         ├─────────────────┬──────────────────┐
         │                 │                  │
    ┌────▼─────┐     ┌────▼─────┐     ┌─────▼─────┐
    │ Krishna  │     │  Karan   │     │ Uniguru   │
    │  APIs    │     │   APIs   │     │   APIs    │
    └──────────┘     └──────────┘     └───────────┘
```

---

## 1. 📈 Krishna's Live Predictions Feed

### Endpoint Details

**Endpoint:** `GET /feed/live?symbol=SYMBOL`  
**Base URL:** `VITE_API_BASE_URL` (default: `http://localhost:3000/api`)  
**Method:** `GET`  
**Authentication:** Optional (Bearer token if required)

### Frontend Implementation

**File:** `src/services/api.js` (lines 80-89)  
**Function:** `getLiveFeed(symbol)`

```javascript
export const getLiveFeed = async (symbol = null) => {
  try {
    const url = symbol ? `/feed/live?symbol=${encodeURIComponent(symbol)}` : '/feed/live'
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching live feed:', error)
    throw error
  }
}
```

**Hook:** `src/hooks/useLiveFeed.js`  
**Component:** `src/components/LiveFeed.jsx`

### Request Format

**URL Examples:**
```
GET /api/feed/live
GET /api/feed/live?symbol=HDFCBANK
GET /api/feed/live?symbol=AAPL
```

**Query Parameters:**
- `symbol` (optional): Asset symbol (e.g., "HDFCBANK", "AAPL", "BTCUSD")

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token> (if authentication required)
```

### Response Format (Recommended)

```json
{
  "symbol": "HDFCBANK",
  "candles": [
    {
      "time": 1704067200,
      "open": 1575.50,
      "high": 1580.25,
      "low": 1572.30,
      "close": 1578.90,
      "volume": 1000000
    },
    {
      "time": 1704067260,
      "open": 1578.90,
      "high": 1582.10,
      "low": 1576.50,
      "close": 1580.00,
      "volume": 1200000
    }
  ],
  "predicted_price": 1580.00,
  "confidence": 85,
  "action": "BUY",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### Response Format (Alternative - Array of Prices)

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

**Note:** If you send format 2, the frontend automatically converts it to candles.

### WebSocket Support (Optional)

**WebSocket URL:** `VITE_FEED_WS_URL` (e.g., `wss://feed.yourdomain.com/socket`)

**Connection Flow:**
1. Frontend connects to WebSocket URL
2. Sends subscription: `{ "type": "subscribe", "symbol": "HDFCBANK" }`
3. Receives real-time updates: `{ "symbol": "HDFCBANK", "price": 1580.00, ... }`
4. Auto-reconnects if connection drops (5-second delay)

**Fallback:** If WebSocket fails, automatically uses REST API polling (10-second interval)

**Implementation:** `src/hooks/useLiveFeed.js` (lines 14-49)

### Backend Requirements

**What Krishna needs to build:**

1. **REST Endpoint:**
   ```python
   # Example Python/Flask
   @app.route('/api/feed/live', methods=['GET'])
   def get_live_feed():
       symbol = request.args.get('symbol', None)
       # Fetch candle data for symbol
       candles = fetch_candles(symbol)
       return jsonify({
           "symbol": symbol or "DEFAULT",
           "candles": candles,
           "predicted_price": calculate_prediction(symbol),
           "confidence": 85,
           "action": "BUY"
       })
   ```

2. **WebSocket Server (Optional):**
   ```python
   # Example using Flask-SocketIO
   @socketio.on('subscribe')
   def handle_subscribe(data):
       symbol = data.get('symbol')
       # Start streaming data for symbol
       emit('price_update', {
           "symbol": symbol,
           "price": get_current_price(symbol)
       })
   ```

---

## 2. 🎯 Krishna's Prediction Endpoint

### Endpoint Details

**Endpoint:** `POST /tools/predict`  
**Base URL:** `VITE_API_BASE_URL`  
**Method:** `POST`  
**Authentication:** Optional (Bearer token if required)

### Frontend Implementation

**File:** `src/services/api.js` (lines 111-119)  
**Function:** `predict(params)`

```javascript
export const predict = async (params = {}) => {
  try {
    const response = await apiClient.post('/tools/predict', params)
    return response.data
  } catch (error) {
    console.error('Error getting predictions:', error)
    throw error
  }
}
```

**Component:** `src/components/Scorecards.jsx` (uses this endpoint)

### Request Format

**URL:** `POST /api/tools/predict`

**Request Body:**
```json
{
  "symbols": ["AAPL", "RELIANCE", "HDFCBANK", "TCS", "INFY"],
  "riskParams": {
    "stopLoss": 5,
    "targetReturn": 10,
    "capitalAtRisk": 2,
    "horizon": "week",
    "riskMode": "auto"
  },
  "filters": {
    "minScore": 50,
    "minConfidence": 60,
    "assetTypes": ["Stock", "Crypto"]
  }
}
```

**Field Descriptions:**
- `symbols` (array): List of asset symbols to get predictions for
- `riskParams` (object): Risk parameters from user input
  - `stopLoss`: Stop-loss percentage
  - `targetReturn`: Target return percentage
  - `capitalAtRisk`: Capital at risk percentage
  - `horizon`: Time horizon (day/week/month/year)
  - `riskMode`: Risk mode (auto/manual)
- `filters` (object, optional): Filtering criteria
  - `minScore`: Minimum prediction score
  - `minConfidence`: Minimum confidence level
  - `assetTypes`: Array of asset types to include

### Response Format

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
    },
    {
      "symbol": "RELIANCE",
      "assetType": "Stock",
      "predicted_price": 2615.8,
      "score": 87,
      "action": "BUY",
      "confidence": 82,
      "risk_applied": {
        "stopLoss": 5,
        "targetReturn": 10,
        "capitalAtRisk": 2
      }
    }
  ],
  "timestamp": "2024-01-01T10:00:00Z",
  "total": 5
}
```

**Field Descriptions:**
- `predictions` (array): Array of prediction objects
  - `symbol`: Asset symbol
  - `assetType`: Type of asset (Stock/Crypto/Commodity)
  - `predicted_price`: Predicted price
  - `score`: Prediction score (0-100)
  - `action`: Recommended action (BUY/SELL/HOLD/ACCUMULATE)
  - `confidence`: Confidence percentage (0-100)
  - `risk_applied`: Risk parameters used for prediction

### Backend Requirements

**What Krishna needs to build:**

```python
@app.route('/api/tools/predict', methods=['POST'])
def predict():
    data = request.json
    symbols = data.get('symbols', [])
    risk_params = data.get('riskParams', {})
    filters = data.get('filters', {})
    
    predictions = []
    for symbol in symbols:
        # Run prediction model
        prediction = run_prediction_model(
            symbol=symbol,
            stop_loss=risk_params.get('stopLoss', 5),
            target_return=risk_params.get('targetReturn', 10),
            capital_at_risk=risk_params.get('capitalAtRisk', 2),
            horizon=risk_params.get('horizon', 'week')
        )
        
        # Apply filters
        if prediction['score'] >= filters.get('minScore', 0):
            predictions.append({
                "symbol": symbol,
                "assetType": get_asset_type(symbol),
                "predicted_price": prediction['price'],
                "score": prediction['score'],
                "action": prediction['action'],
                "confidence": prediction['confidence'],
                "risk_applied": {
                    "stopLoss": risk_params.get('stopLoss'),
                    "targetReturn": risk_params.get('targetReturn'),
                    "capitalAtRisk": risk_params.get('capitalAtRisk')
                }
            })
    
    return jsonify({
        "predictions": predictions,
        "timestamp": datetime.now().isoformat(),
        "total": len(predictions)
    })
```

---

## 3. 🔍 Krishna's Scan All Endpoint

### Endpoint Details

**Endpoint:** `POST /tools/scan_all`  
**Base URL:** `VITE_API_BASE_URL`  
**Method:** `POST`  
**Authentication:** Optional (Bearer token if required)

### Frontend Implementation

**File:** `src/services/api.js` (lines 126-134)  
**Function:** `scanAll(params)`

```javascript
export const scanAll = async (params = {}) => {
  try {
    const response = await apiClient.post('/tools/scan_all', params)
    return response.data
  } catch (error) {
    console.error('Error scanning assets:', error)
    throw error
  }
}
```

**Component:** `src/components/Scorecards.jsx` (uses this endpoint)

### Request Format

**URL:** `POST /api/tools/scan_all`

**Request Body:**
```json
{
  "filters": {
    "minScore": 50,
    "maxRisk": 10,
    "minConfidence": 60,
    "assetTypes": ["Stock", "Crypto", "Commodity"],
    "actions": ["BUY", "ACCUMULATE"]
  },
  "limit": 20,
  "sortBy": "score",
  "sortOrder": "desc"
}
```

**Field Descriptions:**
- `filters` (object): Filtering criteria
  - `minScore`: Minimum prediction score (0-100)
  - `maxRisk`: Maximum risk level
  - `minConfidence`: Minimum confidence (0-100)
  - `assetTypes`: Array of asset types to include
  - `actions`: Array of actions to include (BUY/SELL/HOLD/etc.)
- `limit` (number): Maximum number of results to return
- `sortBy` (string): Field to sort by (score/confidence/predicted_price)
- `sortOrder` (string): Sort order (asc/desc)

### Response Format

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
    },
    {
      "symbol": "RELIANCE",
      "assetType": "Stock",
      "predicted_price": 2615.8,
      "score": 87,
      "action": "BUY",
      "confidence": 82,
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

**Field Descriptions:**
- `shortlist` (array): Ranked list of assets matching filters
- `total` (number): Total assets scanned
- `filtered` (number): Number of assets after filtering
- `timestamp`: When the scan was performed

### Backend Requirements

**What Krishna needs to build:**

```python
@app.route('/api/tools/scan_all', methods=['POST'])
def scan_all():
    data = request.json
    filters = data.get('filters', {})
    limit = data.get('limit', 20)
    sort_by = data.get('sortBy', 'score')
    sort_order = data.get('sortOrder', 'desc')
    
    # Get all available assets
    all_assets = get_all_assets()
    
    # Run predictions for all assets
    predictions = []
    for asset in all_assets:
        prediction = run_prediction_model(asset['symbol'])
        
        # Apply filters
        if (prediction['score'] >= filters.get('minScore', 0) and
            prediction['confidence'] >= filters.get('minConfidence', 0) and
            prediction['action'] in filters.get('actions', ['BUY', 'SELL', 'HOLD'])):
            predictions.append({
                "symbol": asset['symbol'],
                "assetType": asset['type'],
                "predicted_price": prediction['price'],
                "score": prediction['score'],
                "action": prediction['action'],
                "confidence": prediction['confidence'],
                "risk_applied": {
                    "stopLoss": filters.get('maxRisk', 10),
                    "targetReturn": 10
                }
            })
    
    # Sort predictions
    reverse = (sort_order == 'desc')
    predictions.sort(key=lambda x: x[sort_by], reverse=reverse)
    
    # Limit results
    shortlist = predictions[:limit]
    
    return jsonify({
        "shortlist": shortlist,
        "total": len(all_assets),
        "filtered": len(shortlist),
        "timestamp": datetime.now().isoformat()
    })
```

---

## 4. ⚡ Karan's Execution Endpoint

### Endpoint Details

**Endpoint:** `POST /tools/confirm`  
**Base URL:** `VITE_API_BASE_URL`  
**Method:** `POST`  
**Authentication:** Recommended (Bearer token)

### Frontend Implementation

**File:** `src/services/api.js` (lines 96-104)  
**Function:** `confirmDecision(decisionData)`

```javascript
export const confirmDecision = async (decisionData) => {
  try {
    const response = await apiClient.post('/tools/confirm', decisionData)
    return response.data
  } catch (error) {
    console.error('Error confirming decision:', error)
    throw error
  }
}
```

**Component:** `src/components/ActionPanel.jsx` (lines 38-83)

### Request Format

**URL:** `POST /api/tools/confirm`

**Request Body:**
```json
{
  "symbol": "HDFCBANK",
  "action": "BUY",
  "price": 1575.00,
  "quantity": 10,
  "reason": "Strong momentum with 85% confidence. Target 10% with 5% stop-loss.",
  "confidence": 85,
  "riskParams": {
    "stopLoss": 5,
    "targetReturn": 10,
    "capitalAtRisk": 2,
    "investmentAmount": 5000,
    "horizon": "week",
    "riskMode": "auto",
    "executionMode": "approval"
  }
}
```

**Field Descriptions:**
- `symbol`: Asset symbol
- `action`: Trading action (BUY/SELL/HOLD)
- `price`: Entry/execution price
- `quantity`: Number of shares/units
- `reason`: Explanation for the trade
- `confidence`: Confidence percentage (0-100)
- `riskParams`: Complete risk parameters from Input Panel

### Response Format

```json
{
  "success": true,
  "orderId": "ORD-12345",
  "status": "confirmed",
  "symbol": "HDFCBANK",
  "action": "BUY",
  "filledPrice": 1575.00,
  "filledQuantity": 10,
  "confidence": 85,
  "reason": "Strong momentum with 85% confidence. Target 10% with 5% stop-loss.",
  "timestamp": "2024-01-01T10:00:00Z",
  "executionDetails": {
    "broker": "KARAN_EXECUTION_ENGINE",
    "orderType": "MARKET",
    "timeInForce": "DAY"
  }
}
```

**Field Descriptions:**
- `success`: Whether confirmation was successful
- `orderId`: Unique order identifier
- `status`: Order status (confirmed/pending/rejected)
- `filledPrice`: Actual execution price
- `filledQuantity`: Actual executed quantity
- `executionDetails`: Additional execution information

### Backend Requirements

**What Karan needs to build:**

```python
@app.route('/api/tools/confirm', methods=['POST'])
@require_auth  # Require authentication
def confirm_decision():
    data = request.json
    user_id = get_current_user_id()
    
    # Validate request
    required_fields = ['symbol', 'action', 'price', 'quantity']
    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "error": f"Missing required field: {field}"
            }), 400
    
    # Execute trade via Karan's execution engine
    try:
        order = execute_trade(
            user_id=user_id,
            symbol=data['symbol'],
            action=data['action'],
            price=data['price'],
            quantity=data['quantity'],
            reason=data.get('reason', ''),
            risk_params=data.get('riskParams', {})
        )
        
        return jsonify({
            "success": True,
            "orderId": order['id'],
            "status": "confirmed",
            "symbol": data['symbol'],
            "action": data['action'],
            "filledPrice": order['filled_price'],
            "filledQuantity": order['filled_quantity'],
            "confidence": data.get('confidence', 0),
            "reason": data.get('reason', ''),
            "timestamp": datetime.now().isoformat(),
            "executionDetails": {
                "broker": "KARAN_EXECUTION_ENGINE",
                "orderType": order['type'],
                "timeInForce": order['time_in_force']
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
```

---

## 5. 💬 Uniguru Chat Endpoint

### Endpoint Details

**Endpoint:** `POST /chat/query`  
**Base URL:** `VITE_API_BASE_URL`  
**Method:** `POST`  
**Authentication:** Optional (Bearer token if required)

### Frontend Implementation

**File:** `src/services/api.js` (lines 142-153)  
**Function:** `sendChatQuery(query, context)`

```javascript
export const sendChatQuery = async (query, context = {}) => {
  try {
    const response = await apiClient.post('/chat/query', {
      query,
      context,
    })
    return response.data
  } catch (error) {
    console.error('Error sending chat query:', error)
    throw error
  }
}
```

**Component:** `src/components/ChatPanel.jsx` (lines 49-88)

### Request Format

**URL:** `POST /api/chat/query`

**Request Body:**
```json
{
  "query": "What's the trend on TCS?",
  "context": {
    "conversation": [
      {
        "role": "user",
        "content": "What's the trend on TCS?",
        "timestamp": "2024-01-01T10:00:00Z"
      }
    ],
    "currentPortfolio": [],
    "riskParams": {
      "stopLoss": 5,
      "targetReturn": 10,
      "horizon": "week"
    }
  }
}
```

**Field Descriptions:**
- `query`: User's question/query
- `context`: Additional context
  - `conversation`: Previous messages in the chat
  - `currentPortfolio`: User's current portfolio
  - `riskParams`: Current risk parameters

### Response Format (Simple)

```json
{
  "answer": "TCS is showing bullish momentum with steady volume expansion. Current price is holding above 50-DMA with support at ₹3,480."
}
```

### Response Format (Rich - Recommended)

```json
{
  "summary": "Trend check: price is holding above the 50-DMA with steady volume expansion.",
  "details": [
    {
      "label": "Bias",
      "value": "Moderately Bullish"
    },
    {
      "label": "Support",
      "value": "₹3,480"
    },
    {
      "label": "Trigger",
      "value": "Close above ₹3,560"
    },
    {
      "label": "Resistance",
      "value": "₹3,600"
    }
  ],
  "answer": "TCS is showing bullish momentum..."
}
```

**Note:** Rich format displays as a formatted card with labels and values. Simple format displays as plain text.

### Backend Requirements

**What Uniguru needs to build:**

```python
@app.route('/api/chat/query', methods=['POST'])
def chat_query():
    data = request.json
    query = data.get('query', '')
    context = data.get('context', {})
    
    # Process query with AI model
    response = process_chat_query(
        query=query,
        conversation_history=context.get('conversation', []),
        portfolio_context=context.get('currentPortfolio', []),
        risk_params=context.get('riskParams', {})
    )
    
    # Return rich format if available
    if response.get('details'):
        return jsonify({
            "summary": response['summary'],
            "details": response['details'],
            "answer": response.get('answer', response['summary'])
        })
    else:
        return jsonify({
            "answer": response['answer']
        })
```

---

## 6. 📊 Analytics/Sentiment Endpoint

### Endpoint Details

**Endpoint:** `GET /analytics/sentiment`  
**Base URL:** `VITE_API_BASE_URL`  
**Method:** `GET`  
**Authentication:** Optional (Bearer token if required)

### Frontend Implementation

**File:** `src/services/api.js` (lines 158-166)  
**Function:** `getSentimentSummary()`

```javascript
export const getSentimentSummary = async () => {
  try {
    const response = await apiClient.get('/analytics/sentiment')
    return response.data
  } catch (error) {
    console.error('Error fetching sentiment summary:', error)
    throw error
  }
}
```

**Component:** `src/components/InsightsPanel.jsx` (lines 10-36)

### Request Format

**URL:** `GET /api/analytics/sentiment`

**Query Parameters:** None (or optional filters)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token> (if authentication required)
```

### Response Format

```json
{
  "sentimentScore": 68,
  "sentimentLabel": "Bullish",
  "sentimentContext": "Options positioning indicates steady buying interest. Large-cap banks showing strength.",
  "action": "BUY",
  "confidence": 82,
  "timeframe": "Next 2 sessions",
  "commentary": "Look to accumulate quality banks with tight stops. Watch for breakout above resistance.",
  "latestTrade": {
    "symbol": "AAPL",
    "action": "BUY",
    "timestamp": "2024-01-01T10:00:00Z",
    "reason": "Follow-through on breakout with 1.2% risk.",
    "filledPrice": 175.42,
    "filledQuantity": 10
  },
  "marketIndicators": {
    "vix": 15.2,
    "putCallRatio": 0.85,
    "advanceDecline": 1.25
  }
}
```

**Field Descriptions:**
- `sentimentScore`: Number from 0-100 (0 = very bearish, 100 = very bullish)
- `sentimentLabel`: "Bullish", "Bearish", or "Neutral"
- `sentimentContext`: Detailed explanation of sentiment
- `action`: Recommended action (BUY/SELL/HOLD)
- `confidence`: Confidence percentage (0-100)
- `timeframe`: Recommended timeframe for action
- `commentary`: Detailed market commentary
- `latestTrade`: Most recent executed trade
- `marketIndicators`: Additional market indicators (optional)

### Backend Requirements

**What Analytics engine needs to build:**

```python
@app.route('/api/analytics/sentiment', methods=['GET'])
def get_sentiment():
    # Calculate market sentiment
    sentiment = calculate_market_sentiment()
    
    # Get latest trade
    latest_trade = get_latest_executed_trade()
    
    # Get market indicators
    indicators = get_market_indicators()
    
    return jsonify({
        "sentimentScore": sentiment['score'],
        "sentimentLabel": sentiment['label'],
        "sentimentContext": sentiment['context'],
        "action": sentiment['action'],
        "confidence": sentiment['confidence'],
        "timeframe": sentiment['timeframe'],
        "commentary": sentiment['commentary'],
        "latestTrade": {
            "symbol": latest_trade['symbol'],
            "action": latest_trade['action'],
            "timestamp": latest_trade['timestamp'],
            "reason": latest_trade['reason'],
            "filledPrice": latest_trade['price'],
            "filledQuantity": latest_trade['quantity']
        },
        "marketIndicators": indicators
    })
```

---

## 7. 🔐 Authentication Endpoints

### Endpoint Details

**Base URL:** `VITE_AUTH_API_BASE_URL` (default: `http://localhost:5000/api`)  
**Authentication:** JWT tokens

### Frontend Implementation

**File:** `src/services/api.js` (lines 169-206)  
**File:** `src/contexts/AuthContext.jsx` (uses authAPI)

### Endpoints

#### A. Register
**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "username": "trader123",
  "email": "trader@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "username": "trader123",
    "email": "trader@example.com"
  }
}
```

#### B. Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "trader123",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "username": "trader123",
    "email": "trader@example.com"
  }
}
```

#### C. Verify Token
**Endpoint:** `GET /auth/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "username": "trader123",
    "email": "trader@example.com"
  }
}
```

**Backend:** Already implemented in `backend/` folder

---

## 🔄 Complete Data Flow

### User Input → Prediction → Execution Flow

```
1. User fills Input Panel
   ↓
2. User clicks "Predict + Action Preview"
   ↓
3. Frontend calls: POST /tools/predict
   ↓
4. Krishna's engine returns predictions
   ↓
5. Preview shown to user
   ↓
6. User clicks "Submit Trade Inputs"
   ↓
7. Decision sent to Action Panel
   ↓
8. User clicks "Confirm" on decision
   ↓
9. Frontend calls: POST /tools/confirm
   ↓
10. Karan's engine executes trade
   ↓
11. Confirmation returned
   ↓
12. Trade displayed as confirmed
```

### Live Feed Flow

```
1. User selects asset in chart
   ↓
2. Frontend calls: GET /feed/live?symbol=SYMBOL
   ↓
3. Krishna's engine returns candles
   ↓
4. Chart updates with new data
   ↓
5. (Every 10 seconds) Poll again
   OR
   (If WebSocket) Receive real-time updates
```

### Scorecards Flow

```
1. Scorecards component loads
   ↓
2. Frontend calls: POST /tools/scan_all
   ↓
3. Krishna's engine scans all assets
   ↓
4. Returns ranked shortlist
   ↓
5. Scorecards displays ranked table
   ↓
6. (Every 30 seconds) Refresh
```

---

## ⚙️ Environment Configuration

### Required Environment Variables

Create `.env` file in `trading-dashboard/` folder:

```env
# Main API Base URL (Krishna & Karan)
VITE_API_BASE_URL=http://localhost:3000/api

# Authentication API Base URL
VITE_AUTH_API_BASE_URL=http://localhost:5000/api

# WebSocket URL (Optional - for real-time feed)
VITE_FEED_WS_URL=wss://feed.yourdomain.com/socket
```

### Default Values

If environment variables are not set:
- `VITE_API_BASE_URL` defaults to: `http://localhost:3000/api`
- `VITE_AUTH_API_BASE_URL` defaults to: `http://localhost:5000/api`
- `VITE_FEED_WS_URL` defaults to: `undefined` (uses REST polling)

---

## 🔌 Connection Details

### API Client Configuration

**File:** `src/services/api.js`

**Axios Instances:**
1. **apiClient** - For trading APIs (Krishna & Karan)
   - Base URL: `VITE_API_BASE_URL`
   - Timeout: 10 seconds
   - Auto-adds Bearer token from localStorage

2. **authApiClient** - For authentication APIs
   - Base URL: `VITE_AUTH_API_BASE_URL`
   - Timeout: 10 seconds
   - Auto-adds Bearer token from localStorage

**Request Interceptors:**
- Automatically adds `Authorization: Bearer <token>` header if token exists
- Token stored in: `localStorage.getItem('token')`

**Response Interceptors:**
- Handles errors gracefully
- Logs errors to console
- Returns error details for component handling

### Error Handling

All API functions:
1. Try to call the endpoint
2. If error occurs, log to console
3. Throw error for component to handle
4. Components show mock data if API fails

**Error Types:**
- `error.response` - Server responded with error (4xx, 5xx)
- `error.request` - Request made but no response (network error)
- `error.message` - Other errors

---

## 📋 Integration Checklist

### For Krishna (Prediction Engine)

- [ ] Build `GET /feed/live?symbol=SYMBOL` endpoint
- [ ] Build `POST /tools/predict` endpoint
- [ ] Build `POST /tools/scan_all` endpoint
- [ ] (Optional) Set up WebSocket server for real-time feed
- [ ] Test with sample symbols (AAPL, RELIANCE, HDFCBANK, TCS)
- [ ] Verify response formats match specifications
- [ ] Enable CORS for frontend domain
- [ ] Add error handling and validation

### For Karan (Execution Engine)

- [ ] Build `POST /tools/confirm` endpoint
- [ ] Implement trade execution logic
- [ ] Add authentication/authorization
- [ ] Generate unique order IDs
- [ ] Return execution details
- [ ] Test with sample trade confirmations
- [ ] Enable CORS for frontend domain
- [ ] Add error handling and validation

### For Uniguru (Chatbot)

- [ ] Build `POST /chat/query` endpoint
- [ ] Integrate with AI model
- [ ] Support rich response format
- [ ] Handle conversation context
- [ ] Test with sample queries
- [ ] Enable CORS for frontend domain

### For Analytics Engine

- [ ] Build `GET /analytics/sentiment` endpoint
- [ ] Calculate market sentiment
- [ ] Track latest trades
- [ ] Return market indicators
- [ ] Test sentiment calculations
- [ ] Enable CORS for frontend domain

### General Backend Setup

- [ ] Set up CORS to allow frontend domain
- [ ] Add request validation
- [ ] Implement rate limiting
- [ ] Add logging/monitoring
- [ ] Set up error handling
- [ ] Test all endpoints
- [ ] Document API endpoints

---

## 🧪 Testing Endpoints

### Test Krishna's Endpoints

```bash
# Test live feed
curl -X GET "http://localhost:3000/api/feed/live?symbol=AAPL"

# Test predict
curl -X POST "http://localhost:3000/api/tools/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL", "RELIANCE"],
    "riskParams": {
      "stopLoss": 5,
      "targetReturn": 10
    }
  }'

# Test scan_all
curl -X POST "http://localhost:3000/api/tools/scan_all" \
  -H "Content-Type: application/json" \
  -d '{
    "filters": {
      "minScore": 50
    },
    "limit": 10
  }'
```

### Test Karan's Endpoint

```bash
# Test confirm
curl -X POST "http://localhost:3000/api/tools/confirm" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "symbol": "AAPL",
    "action": "BUY",
    "price": 175.42,
    "quantity": 10,
    "reason": "Test trade"
  }'
```

### Test Uniguru Endpoint

```bash
# Test chat
curl -X POST "http://localhost:3000/api/chat/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the trend on TCS?",
    "context": {}
  }'
```

### Test Analytics Endpoint

```bash
# Test sentiment
curl -X GET "http://localhost:3000/api/analytics/sentiment"
```

---

## 🎯 Quick Start Integration

### Step 1: Set Up Backend

1. Create your backend server (Node.js/Python/Go/etc.)
2. Set up CORS to allow frontend domain
3. Create the required endpoints

### Step 2: Configure Frontend

1. Create `.env` file in `trading-dashboard/` folder
2. Set `VITE_API_BASE_URL` to your backend URL
3. Restart frontend dev server

### Step 3: Test Connection

1. Open browser console (F12)
2. Check for API calls
3. Verify responses match expected format
4. Test each endpoint individually

### Step 4: Verify Integration

1. Test live feed with a symbol
2. Test prediction endpoint
3. Test trade confirmation
4. Test chat query
5. Test sentiment endpoint

---

## 🆘 Troubleshooting

### Problem: CORS Errors

**Solution:**
```javascript
// Backend CORS setup (Node.js/Express example)
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}))
```

### Problem: 401 Unauthorized

**Solution:**
- Check if token is being sent in Authorization header
- Verify token is valid
- Check token expiration

### Problem: 404 Not Found

**Solution:**
- Verify endpoint URL is correct
- Check base URL in `.env` file
- Verify backend server is running

### Problem: Network Error

**Solution:**
- Check backend server is running
- Verify URL is accessible
- Check firewall/network settings

### Problem: Wrong Response Format

**Solution:**
- Compare your response with examples above
- Check field names match exactly
- Verify data types are correct

---

## 📝 Summary

**All endpoints are ready to connect:**

1. ✅ **Krishna's Feed** - `GET /feed/live` - Ready
2. ✅ **Krishna's Predict** - `POST /tools/predict` - Ready
3. ✅ **Krishna's Scan** - `POST /tools/scan_all` - Ready
4. ✅ **Karan's Confirm** - `POST /tools/confirm` - Ready
5. ✅ **Uniguru Chat** - `POST /chat/query` - Ready
6. ✅ **Analytics** - `GET /analytics/sentiment` - Ready
7. ✅ **Authentication** - All endpoints ready

**Frontend is 100% ready** - Just connect your backend APIs and everything will work! 🚀

---

## ✅ Integration Verification Checklist

Use this checklist to verify everything is working correctly after connecting your backends:

### Pre-Integration Setup
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with correct URLs
- [ ] Build passes (`npm run build`)
- [ ] Dev server starts (`npm run dev`)
- [ ] Frontend loads without errors (mock data should display)

### Backend Setup
- [ ] Krishna's backend server running
- [ ] Karan's backend server running (or same server)
- [ ] Auth server running (if separate)
- [ ] CORS enabled on all backends
- [ ] Endpoints accessible (test with curl/Postman)

### API Endpoint Verification

#### Krishna's Endpoints
- [ ] `GET /feed/live?symbol=AAPL` returns valid response
- [ ] `POST /tools/predict` accepts request and returns predictions
- [ ] `POST /tools/scan_all` accepts request and returns ranked list
- [ ] Response formats match specifications above

#### Karan's Endpoint
- [ ] `POST /tools/confirm` accepts trade confirmation
- [ ] Returns order ID and execution details
- [ ] Authentication works (Bearer token)

#### Other Endpoints
- [ ] `POST /chat/query` returns chat responses
- [ ] `GET /analytics/sentiment` returns sentiment data
- [ ] Auth endpoints (`/auth/login`, `/auth/register`) work

### Frontend Integration Testing

#### Live Feed
- [ ] Search for symbol (e.g., "AAPL") loads chart
- [ ] Chart displays candlestick data
- [ ] Real-time updates work (if WebSocket enabled)
- [ ] No console errors

#### Scorecards
- [ ] Table displays ranked predictions
- [ ] Sorting works (click column headers)
- [ ] Refresh button updates data
- [ ] Data comes from `/tools/scan_all`

#### Input Panel
- [ ] All fields work (stop-loss, target, amount, etc.)
- [ ] "Predict + Action Preview" button works
- [ ] Preview card displays prediction
- [ ] Submit button sends data correctly

#### Action Panel
- [ ] Decisions display correctly
- [ ] "Confirm" button sends to `/tools/confirm`
- [ ] Success/error messages display
- [ ] Order ID displays after confirmation

#### Chat Panel
- [ ] Messages send to `/chat/query`
- [ ] Responses display correctly
- [ ] Rich format responses render properly
- [ ] Conversation history works

#### Authentication
- [ ] Login page works
- [ ] Register page works
- [ ] Token stored in localStorage
- [ ] Protected routes redirect if not logged in
- [ ] Logout works

### Error Handling
- [ ] API errors display user-friendly messages
- [ ] Network errors handled gracefully
- [ ] Mock data shows if API unavailable
- [ ] No console errors in production build

### Performance
- [ ] Page loads quickly (< 3 seconds)
- [ ] API calls complete in reasonable time
- [ ] No memory leaks (check browser DevTools)
- [ ] Responsive on mobile/tablet/desktop

### Final Verification
- [ ] All features work end-to-end
- [ ] No console errors
- [ ] No network errors (except expected 404s for optional features)
- [ ] Build for production succeeds (`npm run build`)
- [ ] Production preview works (`npm run preview`)

---

## 🎯 Quick Reference: Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run build

# Test API endpoints (from terminal)
curl http://localhost:3000/api/feed/live?symbol=AAPL
curl -X POST http://localhost:3000/api/tools/predict \
  -H "Content-Type: application/json" \
  -d '{"symbols":["AAPL"]}'
```

---

## 📞 Support & Questions

If you encounter issues:

1. **Check Browser Console** (F12) for errors
2. **Check Network Tab** for failed API calls
3. **Verify `.env` file** has correct URLs
4. **Test endpoints directly** with curl/Postman
5. **Check CORS settings** on backend
6. **Verify backend servers are running**

**Common Issues:**
- CORS errors → Enable CORS on backend
- 401 errors → Check token in localStorage
- 404 errors → Verify endpoint URLs
- Network errors → Check backend is running

---

**Last Updated:** 2024  
**Status:** All endpoints documented and ready for integration  
**Frontend Status:** ✅ 100% Complete - Ready for Backend Connection
