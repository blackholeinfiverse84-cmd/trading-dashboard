import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatPanel from './ChatPanel'
import './FloatingAIAssistant.css'

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const buttonRef = useRef(null)

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('ai-assistant-position')
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition)
        setPosition(pos)
      } catch (e) {
        console.error('Failed to load saved position:', e)
      }
    }
  }, [])

  // Save position to localStorage
  const savePosition = (pos) => {
    localStorage.setItem('ai-assistant-position', JSON.stringify(pos))
  }

  const dragTimeoutRef = useRef(null)
  const allowDragRef = useRef(true)

  const handleDoubleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Cancel any pending drag
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current)
      dragTimeoutRef.current = null
    }
    allowDragRef.current = false
    setIsDragging(false)
    setIsOpen(true)
    // Re-enable dragging after a short delay
    setTimeout(() => {
      allowDragRef.current = true
    }, 300)
  }

  const handleMouseDown = (e) => {
    if (!allowDragRef.current) return
    
    // Small delay to allow double-click to cancel
    dragTimeoutRef.current = setTimeout(() => {
      if (allowDragRef.current) {
        setIsDragging(true)
        const rect = buttonRef.current.getBoundingClientRect()
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
      dragTimeoutRef.current = null
    }, 150)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    // Constrain to viewport (accounting for larger button size)
    const maxX = window.innerWidth - 72
    const maxY = window.innerHeight - 72
    const minX = 0
    const minY = 0

    const constrainedX = Math.max(minX, Math.min(maxX, newX))
    const constrainedY = Math.max(minY, Math.min(maxY, newY))

    const newPosition = { x: constrainedX, y: constrainedY }
    setPosition(newPosition)
    savePosition(newPosition)
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        ref={buttonRef}
        className="floating-ai-button"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: isDragging ? 0.95 : 1,
        }}
        drag={false} // We handle dragging manually for better control
        dragConstraints={false}
      >
        <div className="floating-ai-button-icon">
          <span className="ai-icon">🤖</span>
        </div>
        <div className="floating-ai-button-pulse"></div>
        {!isDragging && (
          <motion.div
            className="floating-ai-button-tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Double-click to chat
          </motion.div>
        )}
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="floating-ai-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <motion.div
              className="floating-ai-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="floating-ai-modal-header">
                <h3>Uniguru AI Assistant</h3>
                <button
                  className="floating-ai-close-btn"
                  onClick={handleClose}
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>
              <div className="floating-ai-modal-content">
                <ChatPanel hideTitle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingAIAssistant

