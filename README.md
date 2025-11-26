# Trading Dashboard

Production-ready multi-asset trading UI that streams Krishna’s live feed, executes Karan’s decisions, embeds the Uniguru chatbot, and ships with a finance education dataset.

---

## 1. Features
- **Live Predictions Feed** – candlestick view with WebSocket-ready fallback + mock support
- **Execution Console** – confirm trades, see reasons/confidence
- **Input Panel + Predict Preview** – stop-loss/target/amount/risk mode + “Predict + Action Preview” mock
- **Portfolio Overview** – totals, P&L, exposure, cash buffer snapshot
- **Market Events** – mock catalysts (Fed speech, earnings, model refresh) to prime traders
- **Chat Panel** – Uniguru AI assistant with prebuilt prompts and rich responses
- **Multi-asset Board** – Stocks/Crypto/Commodities tabs with unified schema
- **Finance Dataset** – ~200 QA pairs across education/jargon

---

## 2. Getting Started

### Clone & Install
```bash
git clone <repo>
cd trading-dashboard
npm install
```

### Environment
Copy `.env.example` → `.env` and set your API gateway:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_FEED_WS_URL=wss://feed.yourdomain.com/socket  # optional
```

| Path | Description |
|------|-------------|
| `/feed/live` | Krishna’s real-time predictions (REST) |
| `/tools/confirm` | Karan’s decision confirmation endpoint |
| `/chat/query` | Uniguru chatbot proxy |
| `/analytics/sentiment` | Sentiment/model insights for InsightsPanel |

### Scripts
```bash
npm run dev    # local development (Vite + HMR)
npm run build  # production build (tsc + Vite)
npm run preview # preview production bundle
```

---

## 3. Project Structure
```
src/
├── components/
│   ├── common/        # Button, Card, Input primitives
│   ├── LiveFeed.jsx
│   ├── ActionPanel.jsx
│   ├── InputPanel.jsx
│   ├── ChatPanel.jsx
│   ├── PortfolioOverview.jsx
│   ├── MarketEvents.jsx
│   ├── MultiAssetBoard.jsx
│   └── Dashboard.jsx
├── services/
│   └── api.js        # axios instance + endpoint wrappers
├── hooks/
│   └── useLiveFeed.js # websocket + polling fallback
├── styles/
│   ├── global.css
│   └── theme.js
├── App.jsx
└── main.jsx

dataset/finance_edu/
├── education/education_dataset.json
└── trading_jargon/trading_jargon_dataset.json

learning_kit/
├── uiux_finance.md
└── dataset_guide.md
```

---

## 4. Dataset Overview
- Two JSON files (~100 entries each) with schema:
  ```json
  {
    "question": "",
    "answer": "",
    "context": "risk_management",
    "difficulty": "basic|intermediate|advanced"
  }
  ```
- See `learning_kit/dataset_guide.md` for contribution rules, validation, and sourcing tips.

---

## 5. Documentation & Reflection
- `learning_kit/uiux_finance.md`: visual language, layout, motion, accessibility guidelines.
- `learning_kit/dataset_guide.md`: how to extend QA pairs safely.
- `Reflection.md`: humility/gratitude/honesty note after the build.
- `handoff.md` (coming soon): API wiring guide & mock-replacement checklist.

---

## 6. Testing & Quality
```bash
npm run build  # ensures TypeScript + Vite bundle cleanly
```
- LiveFeed automatically flips between WebSocket and polling based on env.
- LiveFeed/ActionPanel/ChatPanel gracefully degrade with mock data if endpoints fail.
- Responsive tested for desktop + iPad widths.

---

## 7. Deployment (Vercel example)
```bash
npm run build
# configure vercel.json or use dashboard
vercel deploy --prod
```
- Set `VITE_API_BASE_URL` in Vercel project settings.
- Ensure backend endpoints allow the Vercel domain (CORS).

---

## 8. Credits
- UI cues from Apple HIG + Bloomberg Terminal UX.
- Motion inspired by Blackhole Infiverse & Framer Motion demos.
- Dataset sources: CFA texts, BIS notes, Zerodha Varsity, institutional desk slang.

This repo now covers UI, data, and learning resources so future contributors can iterate confidently.***
