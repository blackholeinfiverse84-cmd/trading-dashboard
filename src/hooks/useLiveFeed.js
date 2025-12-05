import { useEffect, useRef, useState } from 'react'
import { getLiveFeed } from '../services/api'

const WS_URL = import.meta.env.VITE_FEED_WS_URL

export const useLiveFeed = (symbol = null, interval = 5) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('polling')
  const wsRef = useRef(null)
  const reconnectTimeout = useRef(null)
  const symbolRef = useRef(symbol)
  const intervalRef = useRef(interval)

  // We send minutes to the backend; it maps to provider intervals

  const connectWebSocket = () => {
    if (!WS_URL || wsRef.current) return

    try {
      wsRef.current = new WebSocket(WS_URL)
      wsRef.current.onopen = () => {
        setSource('websocket')
      }
      wsRef.current.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          setData(payload)
          setError(null)
        } catch (err) {
          console.error('WS parse error:', err)
        }
      }
      wsRef.current.onerror = (err) => {
        console.error('WebSocket error:', err)
        setError('Real-time feed unavailable, using polling.')
      }
      wsRef.current.onclose = () => {
        wsRef.current = null
        setSource('polling')
        if (!reconnectTimeout.current) {
          reconnectTimeout.current = setTimeout(() => {
            reconnectTimeout.current = null
            connectWebSocket()
          }, 5000)
        }
      }
    } catch (err) {
      console.error('WebSocket init failed:', err)
      setSource('polling')
    }
  }

  const fetchPolling = async (symbolToFetch = null, intervalMinutes = null) => {
    try {
      const currentSymbol = symbolToFetch || symbolRef.current || 'AAPL'
      const currentInterval = intervalMinutes !== null ? intervalMinutes : intervalRef.current

      // Fetch real candlestick data from Node backend (Yahoo Finance proxy)
      const response = await getLiveFeed(currentSymbol, currentInterval)
      setData(response)
      setError(null)
      setSource('yfinance') // Indicate we're using yfinance data
    } catch (err) {
      console.error('Polling feed error:', err)
      setError('Unable to reach live candlestick feed.')
    }
  }

  // Update refs when they change
  useEffect(() => {
    symbolRef.current = symbol
    intervalRef.current = interval
    // Fetch immediately when symbol or interval changes
    if (symbol) {
      fetchPolling(symbol, interval)
    }
  }, [symbol, interval])

  useEffect(() => {
    connectWebSocket()

    // Poll every 30 seconds for real-time updates (adjust as needed)
    const interval = setInterval(() => {
      fetchPolling()
    }, 30000)
    
    // Initial fetch
    if (symbol) {
      fetchPolling(symbol, interval)
    }

    return () => {
      clearInterval(interval)
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
    }
  }, [])

  return {
    feed: data,
    error,
    source,
  }
}

