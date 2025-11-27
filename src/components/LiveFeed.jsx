import React, { useState, useEffect, useRef } from 'react'
import Card from './common/Card'
import { createChart, ColorType } from 'lightweight-charts'
import { useLiveFeed } from '../hooks/useLiveFeed'
import AssetSearch from './AssetSearch'
import './LiveFeed.css'

const LiveFeed = ({ signals }) => {
  const [candles, setCandles] = useState([])
  const [activeSymbol, setActiveSymbol] = useState('AAPL')
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const candleSeriesRef = useRef(null)
  const { feed, error: feedError, source } = useLiveFeed(selectedSymbol)

  // When symbol changes, reset and fetch new data
  useEffect(() => {
    if (selectedSymbol) {
      setLoading(true)
      setError(null)
    }
  }, [selectedSymbol])

  useEffect(() => {
    if (!feed && !selectedSymbol) return
    
    try {
      const { symbol, candles: normalized } = normalizeCandles(feed)
      if (normalized.length === 0 || !feed) {
        // Generate mock data for the selected symbol
        const mock = getMockCandles(selectedSymbol || activeSymbol, signals?.risk?.horizon)
        setCandles(mock.candles)
        setActiveSymbol(mock.symbol)
        setLastUpdate(new Date())
        setError('No candle data returned. Showing mock feed.')
      } else {
        const adjusted = adjustCandlesByRisk(normalized, signals?.risk)
        setCandles(adjusted)
        setActiveSymbol(symbol || selectedSymbol || 'Asset')
        setLastUpdate(new Date())
        setError(null)
      }
    } catch (err) {
      console.error('Feed normalization failed:', err)
      const mock = getMockCandles(selectedSymbol || activeSymbol, signals?.risk?.horizon)
      setCandles(mock.candles)
      setActiveSymbol(mock.symbol)
      setLastUpdate(new Date())
      setError('Using mock data.')
    } finally {
      setLoading(false)
    }
  }, [feed, selectedSymbol, activeSymbol])

  useEffect(() => {
    if (!chartContainerRef.current) return

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--text-secondary')
          .trim() || '#b3b3b3',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      crosshair: { mode: 0 },
      timeScale: { borderVisible: false },
      rightPriceScale: { borderVisible: false },
      autoSize: true,
    })

    candleSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#34c759',
      borderUpColor: '#34c759',
      wickUpColor: '#34c759',
      downColor: '#ff3b30',
      borderDownColor: '#ff3b30',
      wickDownColor: '#ff3b30',
    })

    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: chartContainerRef.current?.clientWidth ?? 0,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      chartRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (candles.length && candleSeriesRef.current) {
      candleSeriesRef.current.setData(candles)
      chartRef.current?.timeScale().fitContent()
    }
  }, [candles])

  const latestCandle = candles[candles.length - 1]
  const prevCandle = candles[candles.length - 2]
  const latestPrice = latestCandle?.close ?? 0
  const prevPrice = prevCandle?.close ?? latestPrice
  const priceDelta = latestPrice - prevPrice
  const priceDeltaPct = prevPrice ? (priceDelta / prevPrice) * 100 : 0
  const isUp = priceDelta >= 0

  return (
    <Card
      title="Live Predictions Feed"
      subtitle={
        lastUpdate ? `Last updated: ${formatTime(lastUpdate)}` : 'Loading...'
      }
      variant="elevated"
      className="live-feed-card"
    >
      <div className="live-feed-chart-header">
        <div className="live-feed-symbol-section">
          <div className="live-feed-search-wrapper">
            <AssetSearch
              value={selectedSymbol || activeSymbol}
              onChange={(assetData) => {
                if (assetData && assetData.symbol) {
                  setSelectedSymbol(assetData.symbol)
                  setActiveSymbol(assetData.symbol)
                  setLoading(true)
                  // The useLiveFeed hook will automatically fetch new data for this symbol
                  // For mock data, we'll generate it immediately
                  const mock = getMockCandles(assetData.symbol)
                  setCandles(mock.candles)
                  setActiveSymbol(mock.symbol)
                  setLastUpdate(new Date())
                  setLoading(false)
                }
              }}
              placeholder="Search symbol..."
              showLabel={false}
              className="live-feed-search"
            />
          </div>
          <div className="live-feed-price-display">
            <p className="symbol-label">{activeSymbol}</p>
            <p className="symbol-price">
              ${latestPrice?.toFixed(2) || '0.00'}
              <span className={`symbol-change ${isUp ? 'positive' : 'negative'}`}>
                {isUp ? '+' : ''}
                {priceDelta?.toFixed(2)} ({isUp ? '+' : ''}
                {priceDeltaPct?.toFixed(2)}%)
              </span>
            </p>
          </div>
        </div>
        <div className="live-feed-badges">
          {source === 'websocket' ? (
            <span className="live-feed-source live-feed-source-online">Live</span>
          ) : (
            <span className="live-feed-source live-feed-source-offline">
              Polling
            </span>
          )}
          {(error || feedError) && (
            <span className="live-feed-warning">
              ⚠️ {error || feedError}
            </span>
          )}
        </div>
      </div>

      <div className="live-feed-chart" ref={chartContainerRef}>
        {loading && (
          <div className="live-feed-loading compact">
            <div className="spinner"></div>
            <p>Loading chart...</p>
          </div>
        )}
      </div>
    </Card>
  )
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return date.toLocaleTimeString()
}

// Mock price ranges for different symbols
const getSymbolBasePrice = (symbol) => {
  const priceMap = {
    'AAPL': 175,
    'TSLA': 250,
    'MSFT': 380,
    'GOOGL': 140,
    'AMZN': 150,
    'META': 320,
    'NVDA': 450,
    'RELIANCE': 2600,
    'TCS': 3420,
    'HDFCBANK': 1575,
    'INFY': 1520,
    'ICICIBANK': 950,
    'BHARTIARTL': 1200,
    'SBIN': 600,
    'WIPRO': 450,
    'NIFTY': 22000,
    'SENSEX': 72000,
    'SPX': 4500,
    'DJI': 35000,
    'BTCUSD': 43250,
    'ETHUSD': 2325,
    'BNBUSD': 315,
    'GOLD': 2045,
    'SILVER': 24.8,
    'CRUDE': 79.5,
  }
  return priceMap[symbol?.toUpperCase()] || 175
}

const getMockCandles = (symbol = 'AAPL', horizon = 'week') => {
  const now = Date.now()
  const basePrice = getSymbolBasePrice(symbol)
  const candles = Array.from({ length: 40 }).map((_, index) => {
    const factor = getHorizonFactor(horizon)
    const time = now - (39 - index) * factor.interval
    const drift = Math.sin(index / 5) * (basePrice * factor.drift)
    const volatility = basePrice * factor.volatility
    const open = basePrice + drift + (Math.random() - 0.5) * volatility
    const close = open + (Math.random() - 0.5) * volatility * 2
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility

    return {
      time: Math.floor(time / 1000),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    }
  })

  return {
    symbol: symbol?.toUpperCase() || 'AAPL',
    candles,
  }
}

const normalizeCandles = (payload) => {
  if (!payload) {
    return { symbol: 'Asset', candles: [] }
  }

  if (payload.candles && Array.isArray(payload.candles)) {
    return {
      symbol: payload.symbol || payload.asset || 'Asset',
      candles: sanitizeCandles(payload.candles),
    }
  }

  if (Array.isArray(payload)) {
    return snapshotsToCandles(payload)
  }

  if (Array.isArray(payload.predictions)) {
    return snapshotsToCandles(payload.predictions)
  }

  if (Array.isArray(payload.data)) {
    return snapshotsToCandles(payload.data)
  }

  return { symbol: 'Asset', candles: [] }
}

const sanitizeCandles = (candles = []) =>
  candles
    .map((candle) => {
      if (
        candle.time === undefined ||
        candle.open === undefined ||
        candle.high === undefined ||
        candle.low === undefined ||
        candle.close === undefined
      ) {
        return null
      }

      return {
        time:
          typeof candle.time === 'number'
            ? candle.time
            : Math.floor(new Date(candle.time).getTime() / 1000),
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close),
      }
    })
    .filter(Boolean)

const snapshotsToCandles = (snapshots = []) => {
  if (!snapshots.length) return { symbol: 'Asset', candles: [] }

  const symbol = snapshots[0]?.symbol || snapshots[0]?.asset || 'Asset'
  const candles = snapshots
    .map((snapshot, index) => createSyntheticCandle(snapshot, index))
    .filter(Boolean)

  return { symbol, candles }
}

const createSyntheticCandle = (snapshot, index) => {
  const close =
    Number(snapshot.price ?? snapshot.currentPrice ?? snapshot.close) || null
  const change = Number(snapshot.change ?? snapshot.priceChange ?? 0) || 0

  if (close === null) return null

  const open = close - change
  const rangeBuffer = Math.max(Math.abs(change), close * 0.002)
  const high = Math.max(open, close) + rangeBuffer
  const low = Math.min(open, close) - rangeBuffer
  const syntheticTimestamp =
    snapshot.timestamp ||
    snapshot.time ||
    new Date(Date.now() - (snapshotsWindow - index) * 60 * 1000).toISOString()

  return {
    time: Math.floor(new Date(syntheticTimestamp).getTime() / 1000),
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
  }
}

const getHorizonFactor = (horizon = 'week') => {
  switch (horizon) {
    case 'day':
      return { interval: 5 * 60 * 1000, drift: 0.002, volatility: 0.003 }
    case 'month':
      return { interval: 2 * 60 * 60 * 1000, drift: 0.015, volatility: 0.01 }
    case 'year':
      return { interval: 24 * 60 * 60 * 1000, drift: 0.025, volatility: 0.02 }
    case 'week':
    default:
      return { interval: 60 * 60 * 1000, drift: 0.01, volatility: 0.005 }
  }
}

const adjustCandlesByRisk = (candles = [], risk = {}) => {
  if (!candles.length) return candles
  const { stopLoss = 5, targetReturn = 10, investmentAmount = 5000 } = risk
  const aggressiveness = Math.max(0.5, Math.min(2, targetReturn / (stopLoss || 1)))
  const scale = 1 + (investmentAmount / 100000) * 0.05

  return candles.map((candle) => {
    const mid = (candle.open + candle.close) / 2
    const spread = (candle.high - candle.low) * aggressiveness * scale * 0.1
    return {
      ...candle,
      high: Number((mid + spread).toFixed(2)),
      low: Number((mid - spread).toFixed(2)),
    }
  })
}

export default LiveFeed

