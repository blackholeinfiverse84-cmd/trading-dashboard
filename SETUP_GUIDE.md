# Quick Setup Guide for Karan & Krishna

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
cd trading-dashboard
npm install
```

### 2. Create `.env` File
Create a `.env` file in the `trading-dashboard/` folder:

```env
# Your backend API URL (Krishna & Karan)
VITE_API_BASE_URL=http://localhost:3000/api

# Your auth API URL
VITE_AUTH_API_BASE_URL=http://localhost:5000/api

# Optional: WebSocket URL for real-time feed
VITE_FEED_WS_URL=
```

**Important:** Replace `localhost:3000` and `localhost:5000` with your actual backend URLs!

### 3. Start Development Server
```bash
npm run dev
```

Open: `http://localhost:5173`

### 4. Verify It Works
- ✅ Dashboard loads with mock data
- ✅ No console errors (F12)
- ✅ All components render

### 5. Connect Your Backends

#### For Krishna:
- Start your prediction engine server
- Enable CORS for `http://localhost:5173`
- Test: `curl http://localhost:3000/api/feed/live?symbol=AAPL`

#### For Karan:
- Start your execution engine server
- Enable CORS for `http://localhost:5173`
- Test: `curl -X POST http://localhost:3000/api/tools/confirm -H "Content-Type: application/json" -d '{"symbol":"AAPL","action":"BUY","price":175,"quantity":10}'`

### 6. Test Integration
- Refresh frontend
- Check browser console (F12) → Network tab
- Verify API calls succeed
- Test each feature (Live Feed, Scorecards, Input Panel, etc.)

---

## ✅ Verification Checklist

- [ ] `npm install` completed successfully
- [ ] `.env` file created with correct URLs
- [ ] `npm run dev` starts without errors
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Backend servers running
- [ ] CORS enabled on backends
- [ ] API endpoints accessible
- [ ] Frontend connects to backends successfully

---

## 🆘 Troubleshooting

**CORS Error?**
```python
# Add to your backend (Python/Flask)
from flask_cors import CORS
CORS(app, origins=["http://localhost:5173"])
```

**404 Not Found?**
- Check `.env` file has correct URLs
- Verify backend server is running
- Check endpoint paths match documentation

**401 Unauthorized?**
- Check token in `localStorage.getItem('token')`
- Verify token is valid
- Check Authorization header is sent

---

## 📚 Full Documentation

See `karan-krishna-roadmap.md` for:
- Complete API endpoint specifications
- Request/response formats
- Integration patterns
- Detailed troubleshooting

---

**Status:** ✅ Frontend 100% Ready - Just connect your backends!


