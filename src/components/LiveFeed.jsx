import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Card from './common/Card'
import { createChart, ColorType } from 'lightweight-charts'
import { useLiveFeed } from '../hooks/useLiveFeed'
import { useChartDrawing } from '../hooks/useChartDrawing'
import AssetSearch from './AssetSearch'
import TimeIntervalSelector from './common/TimeIntervalSelector'
import { useToast } from '../contexts/ToastContext'
import './LiveFeed.css'

const LiveFeed = ({ signals, activeTool = 'cursor' }) => {
  const [candles, setCandles] = useState([])
  const [activeSymbol, setActiveSymbol] = useState('AAPL')
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [selectedInterval, setSelectedInterval] = useState(5) // Default 5 minutes
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const candleSeriesRef = useRef(null)
  const drawingOverlayRef = useRef(null)
  const { feed, error: feedError, source } = useLiveFeed(selectedSymbol)
  const { addToast } = useToast()
  const lastErrorRef = useRef('')
  const mockFeedToastShownRef = useRef(false)
  const parsingErrorToastShownRef = useRef(false)
  
  // Chart drawing hook
  const {
    drawings,
    currentDrawing,
    isDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    deleteDrawing: deleteDrawingOriginal,
    clearDrawings,
  } = useChartDrawing(chartRef, activeTool)
  
  // Wrapper for delete with feedback
  const deleteDrawing = (id) => {
    deleteDrawingOriginal(id)
    addToast({
      title: 'Drawing removed',
      message: 'Annotation deleted successfully.',
      variant: 'info',
      duration: 2000,
    })
  }
  
  // Store handlers in refs to avoid recreating event listeners
  const handlersRef = useRef({ handleMouseDown, handleMouseMove, handleMouseUp })
  useEffect(() => {
    handlersRef.current = { handleMouseDown, handleMouseMove, handleMouseUp }
  }, [handleMouseDown, handleMouseMove, handleMouseUp])

  // When symbol changes, reset and fetch new data
  useEffect(() => {
    if (selectedSymbol) {
      setLoading(true)
      setError(null)
      // Reset toast flags when symbol changes
      mockFeedToastShownRef.current = false
      parsingErrorToastShownRef.current = false
    }
  }, [selectedSymbol])

  useEffect(() => {
    if (!feed && !selectedSymbol) return
    
    try {
      const { symbol, candles: normalized } = normalizeCandles(feed)
      if (normalized.length === 0 || !feed) {
        const mock = getMockCandles(selectedSymbol || activeSymbol, signals?.risk?.horizon, selectedInterval)
        setCandles(mock.candles)
        setActiveSymbol(mock.symbol)
        setLastUpdate(new Date())
        setError('No candle data returned. Showing mock feed.')
        // Only show toast once per symbol
        if (!mockFeedToastShownRef.current) {
          mockFeedToastShownRef.current = true
          addToast({
            title: 'Mock feed engaged',
            message: 'No live candles for this symbol. Displaying simulated stream.',
            variant: 'warning',
            duration: 4000, // Shorter duration
          })
        }
      } else {
        const adjusted = adjustCandlesByRisk(normalized, signals?.risk)
        setCandles(adjusted)
        setActiveSymbol(symbol || selectedSymbol || 'Asset')
        setLastUpdate(new Date())
        setError(null)
        lastErrorRef.current = ''
      }
    } catch (err) {
      console.error('Feed normalization failed:', err)
      const mock = getMockCandles(selectedSymbol || activeSymbol, signals?.risk?.horizon, selectedInterval)
      setCandles(mock.candles)
      setActiveSymbol(mock.symbol)
      setLastUpdate(new Date())
      setError('Using mock data.')
      // Only show toast once per symbol
      if (!parsingErrorToastShownRef.current) {
        parsingErrorToastShownRef.current = true
        addToast({
          title: 'Feed parsing failed',
          message: 'Falling back to mock data while normalizing candles.',
          variant: 'warning',
          duration: 4000, // Shorter duration
        })
      }
    } finally {
      setLoading(false)
    }
  }, [feed, selectedSymbol, activeSymbol, signals?.risk, addToast])

  useEffect(() => {
    if (!feedError) return
    if (lastErrorRef.current === feedError) return
    lastErrorRef.current = feedError
    addToast({
      title: 'Live feed interruption',
      message: feedError,
      variant: 'error',
      duration: 4000, // Shorter duration
    })
  }, [feedError, addToast])

  useEffect(() => {
    if (!chartContainerRef.current) return

    const containerHeight = chartContainerRef.current?.clientHeight || 320
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
      timeScale: { 
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: { borderVisible: false },
      width: chartContainerRef.current?.clientWidth ?? 0,
      height: containerHeight,
      autoSize: true,
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
        axisDoubleClickReset: {
          time: true,
          price: true,
        },
        axisTouchDrag: {
          time: true,
          price: true,
        },
        mouseWheel: true,
        pinch: true,
      },
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
      const container = chartContainerRef.current
      if (!container || !chartRef.current) return
      const maxHeight = 320 // Further reduced
      chartRef.current.applyOptions({
        width: container.clientWidth ?? 0,
        height: Math.min(container.clientHeight ?? maxHeight, maxHeight),
      })
    }

    // Prevent browser zoom on touchpad gestures - let chart handle it
    const container = chartContainerRef.current
    
    const handleWheel = (e) => {
      // On touchpads, Ctrl+wheel is used for zoom gestures
      // Prevent browser zoom but let chart handle it
      if (e.ctrlKey || e.metaKey) {
        // Prevent browser zoom
        e.preventDefault()
        e.stopPropagation()
        
        // Manually trigger chart zoom since preventing default might block chart's handler
        // Convert wheel delta to zoom factor
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
        if (chartRef.current) {
          const timeScale = chartRef.current.timeScale()
          const visibleRange = timeScale.getVisibleRange()
          if (visibleRange) {
            const range = visibleRange.to - visibleRange.from
            const center = (visibleRange.from + visibleRange.to) / 2
            const newRange = range * zoomFactor
            timeScale.setVisibleRange({
              from: center - newRange / 2,
              to: center + newRange / 2,
            })
          }
        }
        return false
      }
    }

    const preventBrowserZoom = (e) => {
      // Prevent browser zoom on touchpad pinch gestures
      if (e.touches && e.touches.length === 2) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    window.addEventListener('resize', handleResize)
    // Prevent browser zoom on Ctrl+wheel when over chart container
    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', preventBrowserZoom, { passive: false })
    container.addEventListener('touchmove', preventBrowserZoom, { passive: false })
    
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', preventBrowserZoom)
      container.removeEventListener('touchmove', preventBrowserZoom)
      chartRef.current?.remove()
    }
  }, [])

  // Set up drawing event listeners
  // Use refs to avoid recreating listeners on every callback change
  const activeToolRef = useRef(activeTool)
  useEffect(() => {
    activeToolRef.current = activeTool
  }, [activeTool])

  useEffect(() => {
    const container = chartContainerRef.current
    if (!container) return

    // Wrapper functions that use refs to avoid dependency issues
    // These should ONLY be called when actually drawing, not in cursor mode
    const handleMouseDownWrapper = (e) => {
      const tool = activeToolRef.current
      // Only handle if we're in a drawing mode (not cursor, not delete)
      if (tool !== 'cursor' && tool !== 'delete' && handlersRef.current.handleMouseDown) {
        handlersRef.current.handleMouseDown(e, container)
      }
      // In cursor mode, let the event pass through to chart
    }
    
    const handleMouseMoveWrapper = (e) => {
      const tool = activeToolRef.current
      // Only handle if we're actively drawing
      if (tool !== 'cursor' && tool !== 'delete' && handlersRef.current.handleMouseMove) {
        handlersRef.current.handleMouseMove(e, container)
      }
      // In cursor mode, let the event pass through to chart
    }
    
    const handleMouseUpWrapper = (e) => {
      const tool = activeToolRef.current
      // Only handle if we're actively drawing
      if (tool !== 'cursor' && tool !== 'delete' && handlersRef.current.handleMouseUp) {
        handlersRef.current.handleMouseUp()
      }
      // In cursor mode, let the event pass through to chart
    }

    // Only add listeners if not cursor mode and not delete mode (delete uses SVG overlay)
    if (activeTool !== 'cursor' && activeTool !== 'delete') {
      // Drawing mode - add listeners for drawing
      container.addEventListener('mousedown', handleMouseDownWrapper, { passive: false })
      container.addEventListener('mousemove', handleMouseMoveWrapper, { passive: true })
      container.addEventListener('mouseup', handleMouseUpWrapper, { passive: false })
      container.style.cursor = activeTool === 'trend-line' || activeTool === 'horizontal-line' ? 'crosshair' : 
                               activeTool === 'text' ? 'text' : 'default'
      container.style.pointerEvents = 'auto'
      // Disable chart interactions when drawing
      if (chartRef.current) {
        chartRef.current.applyOptions({
          handleScroll: {
            mouseWheel: false,
            pressedMouseMove: false,
          },
          handleScale: {
            axisPressedMouseMove: false,
            mouseWheel: false,
          },
        })
      }
    } else if (activeTool === 'delete') {
      // Delete mode - only SVG overlay handles clicks
      container.style.cursor = 'pointer'
      container.style.pointerEvents = 'auto'
      // Disable chart interactions in delete mode
      if (chartRef.current) {
        chartRef.current.applyOptions({
          handleScroll: {
            mouseWheel: false,
            pressedMouseMove: false,
          },
          handleScale: {
            axisPressedMouseMove: false,
            mouseWheel: false,
          },
        })
      }
    } else {
      // Cursor mode - FULLY ENABLE chart interactions
      container.style.cursor = 'default'
      container.style.pointerEvents = 'auto'
      // Re-enable all chart interactions
      if (chartRef.current) {
        chartRef.current.applyOptions({
          handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
            horzTouchDrag: true,
            vertTouchDrag: true,
          },
          handleScale: {
            axisPressedMouseMove: {
              time: true,
              price: true,
            },
            axisDoubleClickReset: {
              time: true,
              price: true,
            },
            axisTouchDrag: {
              time: true,
              price: true,
            },
            mouseWheel: true,
            pinch: true,
          },
        })
      }
    }

    return () => {
      container.removeEventListener('mousedown', handleMouseDownWrapper)
      container.removeEventListener('mousemove', handleMouseMoveWrapper)
      container.removeEventListener('mouseup', handleMouseUpWrapper)
      container.style.cursor = 'default'
    }
  }, [activeTool]) // Only depend on activeTool, not the callbacks

  // Track if this is the first data load to auto-fit only once
  const isInitialLoadRef = useRef(true)
  const updateTimeoutRef = useRef(null)
  
  // Memoize candle data to prevent unnecessary updates
  const memoizedCandles = useMemo(() => candles, [candles.length, candles[0]?.time, candles[candles.length - 1]?.time])
  
  // Debounced chart update function
  const updateChartData = useCallback((data) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (candleSeriesRef.current && data.length > 0) {
        candleSeriesRef.current.setData(data)
        // Only auto-fit on very first load
        if (isInitialLoadRef.current && chartRef.current) {
          chartRef.current.timeScale().fitContent()
          isInitialLoadRef.current = false
        }
      }
    }, 16) // ~60fps update rate
  }, [])
  
  useEffect(() => {
    if (memoizedCandles.length) {
      updateChartData(memoizedCandles)
    }
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [memoizedCandles, updateChartData])

  // Regenerate candles when interval changes
  useEffect(() => {
    if (selectedSymbol) {
      const mock = getMockCandles(selectedSymbol, signals?.risk?.horizon || 'week', selectedInterval)
      setCandles(mock.candles)
      setActiveSymbol(mock.symbol)
      setLastUpdate(new Date())
    }
  }, [selectedInterval, selectedSymbol, signals?.risk?.horizon])

  // Re-enable chart interactions when switching to cursor mode
  useEffect(() => {
    if (activeTool === 'cursor' && chartRef.current) {
      // Ensure chart is fully interactive
      const container = chartContainerRef.current
      if (container) {
        container.style.pointerEvents = 'auto'
        // Force chart to re-enable interactions with full options
        chartRef.current.applyOptions({
          handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
            horzTouchDrag: true,
            vertTouchDrag: true,
          },
          handleScale: {
            axisPressedMouseMove: {
              time: true,
              price: true,
            },
            axisDoubleClickReset: {
              time: true,
              price: true,
            },
            axisTouchDrag: {
              time: true,
              price: true,
            },
            mouseWheel: true,
            pinch: true,
          },
        })
      }
    }
  }, [activeTool])

  // Memoize price calculations
  const priceInfo = useMemo(() => {
    const latestCandle = candles[candles.length - 1]
    const prevCandle = candles[candles.length - 2]
    const latestPrice = latestCandle?.close ?? 0
    const prevPrice = prevCandle?.close ?? latestPrice
    const priceDelta = latestPrice - prevPrice
    const priceDeltaPct = prevPrice ? (priceDelta / prevPrice) * 100 : 0
    return { latestPrice, priceDelta, priceDeltaPct }
  }, [candles.length, candles[candles.length - 1]?.close, candles[candles.length - 2]?.close])
  
  const { latestPrice, priceDelta, priceDeltaPct } = priceInfo
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
                  const mock = getMockCandles(assetData.symbol, signals?.risk?.horizon || 'week', selectedInterval)
                  setCandles(mock.candles)
                  setActiveSymbol(mock.symbol)
                  setLastUpdate(new Date())
                  setLoading(false)
                  addToast({
                    title: 'Symbol updated',
                    message: `Streaming ${assetData.symbol.toUpperCase()} context.`,
                    variant: 'info',
                  })
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
          <TimeIntervalSelector
            value={selectedInterval}
            onChange={setSelectedInterval}
            className="live-feed-interval-selector"
          />
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

      <div className="live-feed-chart-wrapper">
        <div className="live-feed-chart" ref={chartContainerRef}>
          {loading && (
            <div className="live-feed-loading compact">
              <div className="spinner"></div>
              <p>Loading chart...</p>
            </div>
          )}
        </div>
        <svg
          ref={drawingOverlayRef}
          className="live-feed-drawing-overlay"
          style={{
            pointerEvents: activeTool === 'delete' ? 'auto' : 'none',
          }}
          onClick={(e) => {
            // If clicking empty area in delete mode, don't block chart
            if (activeTool === 'delete' && e.target === e.currentTarget) {
              e.stopPropagation()
            }
          }}
        >
          {/* Render completed drawings */}
          {drawings.map((drawing) => {
            const handleDelete = (e) => {
              if (activeTool === 'delete') {
                e.stopPropagation()
                e.preventDefault()
                deleteDrawing(drawing.id)
                return false
              }
            }

            if (drawing.type === 'line') {
              return (
                <g 
                  key={drawing.id} 
                  onClick={handleDelete}
                  onMouseDown={(e) => activeTool === 'delete' && e.stopPropagation()}
                  style={{ cursor: activeTool === 'delete' ? 'pointer' : 'default' }}
                >
                  {/* Invisible wider line for easier clicking in delete mode */}
                  {activeTool === 'delete' && (
                    <line
                      x1={drawing.start.x}
                      y1={drawing.start.y}
                      x2={drawing.end.x}
                      y2={drawing.end.y}
                      stroke="transparent"
                      strokeWidth="15"
                      pointerEvents="all"
                      onClick={handleDelete}
                    />
                  )}
                  <line
                    x1={drawing.start.x}
                    y1={drawing.start.y}
                    x2={drawing.end.x}
                    y2={drawing.end.y}
                    stroke={drawing.color}
                    strokeWidth={activeTool === 'delete' ? drawing.width + 1 : drawing.width}
                    opacity={activeTool === 'delete' ? 0.8 : 1}
                    pointerEvents={activeTool === 'delete' ? 'all' : 'none'}
                    onClick={handleDelete}
                  />
                  {activeTool === 'delete' && (
                    <>
                      <circle
                        cx={drawing.start.x}
                        cy={drawing.start.y}
                        r="6"
                        fill={drawing.color}
                        opacity="0.9"
                        pointerEvents="all"
                        onClick={handleDelete}
                      />
                      <circle
                        cx={drawing.end.x}
                        cy={drawing.end.y}
                        r="6"
                        fill={drawing.color}
                        opacity="0.9"
                        pointerEvents="all"
                        onClick={handleDelete}
                      />
                    </>
                  )}
                </g>
              )
            } else if (drawing.type === 'horizontal-line') {
              const containerWidth = chartContainerRef.current?.clientWidth || 0
              return (
                <g 
                  key={drawing.id} 
                  onClick={handleDelete}
                  onMouseDown={(e) => activeTool === 'delete' && e.stopPropagation()}
                  style={{ cursor: activeTool === 'delete' ? 'pointer' : 'default' }}
                >
                  {/* Invisible wider line for easier clicking in delete mode */}
                  {activeTool === 'delete' && (
                    <line
                      x1="0"
                      y1={drawing.y}
                      x2={containerWidth}
                      y2={drawing.y}
                      stroke="transparent"
                      strokeWidth="15"
                      pointerEvents="all"
                      onClick={handleDelete}
                    />
                  )}
                  <line
                    x1="0"
                    y1={drawing.y}
                    x2={containerWidth}
                    y2={drawing.y}
                    stroke={drawing.color}
                    strokeWidth={activeTool === 'delete' ? drawing.width + 1 : drawing.width}
                    strokeDasharray={drawing.dashArray}
                    opacity={activeTool === 'delete' ? 0.8 : 1}
                    pointerEvents={activeTool === 'delete' ? 'all' : 'none'}
                    onClick={handleDelete}
                  />
                </g>
              )
            } else if (drawing.type === 'text') {
              return (
                <g 
                  key={drawing.id} 
                  onClick={handleDelete}
                  onMouseDown={(e) => activeTool === 'delete' && e.stopPropagation()}
                  style={{ cursor: activeTool === 'delete' ? 'pointer' : 'default' }}
                >
                  <rect
                    x={drawing.position.x - 4}
                    y={drawing.position.y - drawing.fontSize - 4}
                    width={drawing.text.length * 8 + 8}
                    height={drawing.fontSize + 8}
                    fill={activeTool === 'delete' ? 'rgba(255, 59, 48, 0.3)' : 'rgba(0, 0, 0, 0.6)'}
                    rx="4"
                    pointerEvents={activeTool === 'delete' ? 'all' : 'none'}
                    onClick={handleDelete}
                  />
                  <text
                    x={drawing.position.x}
                    y={drawing.position.y}
                    fill={drawing.color}
                    fontSize={drawing.fontSize}
                    fontWeight="500"
                    pointerEvents="none"
                  >
                    {drawing.text}
                  </text>
                  {activeTool === 'delete' && (
                    <circle
                      cx={drawing.position.x + (drawing.text.length * 8) / 2}
                      cy={drawing.position.y - drawing.fontSize / 2}
                      r="8"
                      fill="#FF3B30"
                      opacity="0.9"
                      pointerEvents="all"
                      onClick={handleDelete}
                    />
                  )}
                </g>
              )
            }
            return null
          })}
          
          {/* Render current drawing in progress */}
          {currentDrawing && (
            <>
              {currentDrawing.type === 'line' && (
                <line
                  x1={currentDrawing.start.x}
                  y1={currentDrawing.start.y}
                  x2={currentDrawing.end.x}
                  y2={currentDrawing.end.y}
                  stroke={currentDrawing.color}
                  strokeWidth={currentDrawing.width}
                  strokeDasharray="5,5"
                  opacity="0.7"
                />
              )}
              {currentDrawing.type === 'horizontal-line' && (
                <line
                  x1="0"
                  y1={currentDrawing.y}
                  x2={chartContainerRef.current?.clientWidth || 0}
                  y2={currentDrawing.y}
                  stroke={currentDrawing.color}
                  strokeWidth={currentDrawing.width}
                  strokeDasharray={currentDrawing.dashArray}
                  opacity="0.7"
                />
              )}
            </>
          )}
        </svg>
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

const getMockCandles = (symbol = 'AAPL', horizon = 'week', intervalMinutes = 5) => {
  const now = Date.now()
  const basePrice = getSymbolBasePrice(symbol)
  const intervalMs = intervalMinutes * 60 * 1000 // Convert minutes to milliseconds
  const factor = getHorizonFactor(horizon)
  const candles = Array.from({ length: 40 }).map((_, index) => {
    const time = now - (39 - index) * intervalMs
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

