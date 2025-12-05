const fetch = require('node-fetch')

// Map minutes to Yahoo Finance interval/range defaults
const getYahooParams = (minutes) => {
  if (minutes <= 1) return { interval: '1m', range: '1d' }
  if (minutes <= 5) return { interval: '5m', range: '1d' }
  if (minutes <= 15) return { interval: '15m', range: '5d' }
  if (minutes <= 60) return { interval: '60m', range: '1mo' }
  return { interval: '1d', range: '3mo' }
}

// Normalize Yahoo Finance chart response into candles
const normalizeYahooCandles = (yahooJson) => {
  const result = yahooJson?.chart?.result?.[0]
  if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
    return []
  }

  const { timestamp } = result
  const quote = result.indicators.quote[0]
  const { open, high, low, close } = quote

  const candles = []
  for (let i = 0; i < timestamp.length; i++) {
    const o = open[i]
    const h = high[i]
    const l = low[i]
    const c = close[i]
    if (
      o == null ||
      h == null ||
      l == null ||
      c == null
    ) {
      continue
    }
    candles.push({
      time: timestamp[i],
      open: Number(o),
      high: Number(h),
      low: Number(l),
      close: Number(c),
    })
  }
  return candles
}

// GET /api/market/candles?symbol=AAPL&interval=5
exports.getCandles = async (req, res) => {
  try {
    const rawSymbol = (req.query.symbol || 'AAPL').toString().trim()
    const symbol = rawSymbol.toUpperCase()
    const intervalMinutes = parseInt(req.query.interval, 10) || 5

    const { interval, range } = getYahooParams(intervalMinutes)

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?interval=${interval}&range=${range}`

    const response = await fetch(url)
    if (!response.ok) {
      return res
        .status(502)
        .json({ error: 'Upstream data provider error', status: response.status })
    }

    const data = await response.json()
    const candles = normalizeYahooCandles(data)

    if (!candles.length) {
      return res.status(404).json({ error: 'No candle data available', symbol })
    }

    return res.json({
      symbol,
      candles,
      provider: 'yahoo-finance',
      interval,
      range,
      count: candles.length,
    })
  } catch (err) {
    console.error('Error fetching candles:', err)
    return res.status(500).json({ error: 'Failed to fetch candles', details: err.message })
  }
}


