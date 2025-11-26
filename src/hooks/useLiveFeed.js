import { useEffect, useRef, useState } from 'react'
import { getLiveFeed } from '../services/api'

const WS_URL = import.meta.env.VITE_FEED_WS_URL

export const useLiveFeed = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('polling')
  const wsRef = useRef(null)
  const reconnectTimeout = useRef(null)

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

  const fetchPolling = async () => {
    try {
      const response = await getLiveFeed()
      setData(response)
      setError(null)
    } catch (err) {
      console.error('Polling feed error:', err)
      setError('Unable to reach live feed.')
    }
  }

  useEffect(() => {
    connectWebSocket()

    const interval = setInterval(fetchPolling, 10000)
    fetchPolling()

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

