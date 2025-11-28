import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Hook for managing chart drawing interactions
 * Handles tool selection, drawing state, and coordinate conversion
 */
export const useChartDrawing = (chartRef, activeTool) => {
  const [drawings, setDrawings] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState(null)
  const drawingStartRef = useRef(null)
  const activeToolRef = useRef(activeTool)
  
  // Keep activeTool ref in sync
  useEffect(() => {
    activeToolRef.current = activeTool
  }, [activeTool])

  // Convert screen coordinates to chart container coordinates
  const screenToChart = useCallback((screenX, screenY, containerElement) => {
    if (!containerElement) return null
    
    const rect = containerElement.getBoundingClientRect()
    
    // Get relative position within chart container
    // Account for padding and borders
    const x = screenX - rect.left
    const y = screenY - rect.top
    
    // Clamp coordinates to container bounds
    const clampedX = Math.max(0, Math.min(x, rect.width))
    const clampedY = Math.max(0, Math.min(y, rect.height))
    
    return { x: clampedX, y: clampedY }
  }, [])

  // Handle mouse down - start drawing
  const handleMouseDown = useCallback((e, containerElement) => {
    const tool = activeToolRef.current
    if (tool === 'cursor' || !containerElement) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const coords = screenToChart(e.clientX, e.clientY, containerElement)
    if (!coords) return

    setIsDrawing(true)
    drawingStartRef.current = coords

    if (tool === 'trend-line') {
      setCurrentDrawing({
        type: 'line',
        id: Date.now(),
        start: coords,
        end: coords,
        color: '#007AFF',
        width: 2,
      })
    } else if (tool === 'horizontal-line') {
      setCurrentDrawing({
        type: 'horizontal-line',
        id: Date.now(),
        y: coords.y,
        color: '#FF9500',
        width: 2,
        dashArray: '5,5',
      })
    } else if (tool === 'text') {
      const text = prompt('Enter annotation text:', 'Note')
      if (text) {
        const textDrawing = {
          type: 'text',
          id: Date.now(),
          position: coords,
          text: text,
          color: '#FFFFFF',
          fontSize: 14,
        }
        setDrawings(prev => [...prev, textDrawing])
        setIsDrawing(false) // Text is placed immediately
        return
      }
    }
  }, [screenToChart])

  // Handle mouse move - update drawing
  // Use refs to avoid recreating callback on every state change
  const isDrawingRef = useRef(false)
  const currentDrawingRef = useRef(null)
  const throttleRef = useRef(null)
  
  // Keep refs in sync with state
  useEffect(() => {
    isDrawingRef.current = isDrawing
    currentDrawingRef.current = currentDrawing
  }, [isDrawing, currentDrawing])

  const handleMouseMove = useCallback((e, containerElement) => {
    if (!isDrawingRef.current || !currentDrawingRef.current || !containerElement) return

    // Throttle mousemove events for better performance
    if (throttleRef.current) {
      cancelAnimationFrame(throttleRef.current)
    }
    
    throttleRef.current = requestAnimationFrame(() => {
      const coords = screenToChart(e.clientX, e.clientY, containerElement)
      if (!coords) return

      const drawing = currentDrawingRef.current
      if (drawing?.type === 'line') {
        setCurrentDrawing(prev => ({
          ...prev,
          end: coords,
        }))
      } else if (drawing?.type === 'horizontal-line') {
        setCurrentDrawing(prev => ({
          ...prev,
          y: coords.y,
        }))
      }
    })
  }, [screenToChart])

  // Handle mouse up - finish drawing
  const handleMouseUp = useCallback(() => {
    if (!isDrawingRef.current || !currentDrawingRef.current) return

    // Text drawings are already added on mousedown, skip here
    if (currentDrawingRef.current.type !== 'text') {
      setDrawings(prev => [...prev, currentDrawingRef.current])
    }
    setCurrentDrawing(null)
    setIsDrawing(false)
    drawingStartRef.current = null
  }, [])

  // Delete a drawing
  const deleteDrawing = useCallback((id) => {
    setDrawings(prev => prev.filter(d => d.id !== id))
  }, [])

  // Clear all drawings
  const clearDrawings = useCallback(() => {
    setDrawings([])
  }, [])

  return {
    drawings,
    currentDrawing,
    isDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    deleteDrawing,
    clearDrawings,
  }
}

