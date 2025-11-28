import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Tooltip.css'

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 300,
  disabled = false 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollX = window.scrollX || window.pageXOffset
    const scrollY = window.scrollY || window.pageYOffset

    let x = 0
    let y = 0

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX
        y = triggerRect.top - tooltipRect.height - 8 + scrollY
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX
        y = triggerRect.bottom + 8 + scrollY
        break
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8 + scrollX
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollY
        break
      case 'right':
        x = triggerRect.right + 8 + scrollX
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollY
        break
      default:
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX
        y = triggerRect.top - tooltipRect.height - 8 + scrollY
    }

    // Keep tooltip within viewport
    const padding = 8
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding))
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding))

    setTooltipPosition({ x, y })
  }

  const handleMouseEnter = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setTimeout(calculatePosition, 10) // Small delay to ensure tooltip is rendered
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  if (!content || disabled) {
    return <>{children}</>
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="tooltip-trigger"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`tooltip tooltip-${position}`}
            style={{
              position: 'absolute',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              zIndex: 10000,
            }}
            initial={{ opacity: 0, scale: 0.8, y: position === 'bottom' ? -10 : position === 'top' ? 10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={calculatePosition}
          >
            {content}
            <div className={`tooltip-arrow tooltip-arrow-${position}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Tooltip

