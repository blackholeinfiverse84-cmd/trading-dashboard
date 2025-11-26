import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './common/Card'
import Button from './common/Button'
import { confirmDecision } from '../services/api'
import './ActionPanel.css'

const ActionPanel = ({ decisionData, onDecisionUpdate }) => {
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Update decisions when decisionData prop changes
  useEffect(() => {
    if (decisionData) {
      addDecision(decisionData)
    }
  }, [decisionData])

  // Add new decision to the list
  const addDecision = (decision) => {
    const newDecision = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...decision,
    }
    setDecisions((prev) => [newDecision, ...prev].slice(0, 10)) // Keep last 10
  }

  // Handle decision confirmation
  const handleConfirm = async (decision) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await confirmDecision({
        symbol: decision.symbol,
        action: decision.action,
        price: decision.price,
        quantity: decision.quantity,
        reason: decision.reason,
      })
      
      // Update decision status
      setDecisions((prev) =>
        prev.map((d) =>
          d.id === decision.id
            ? { ...d, confirmed: true, confirmationData: response }
            : d
        )
      )
      
      if (onDecisionUpdate) {
        onDecisionUpdate({ ...decision, confirmed: true, response })
      }
    } catch (err) {
      console.error('Failed to confirm decision:', err)
      setError('Failed to confirm decision. Using mock confirmation.')
      // Mock confirmation for development
      setDecisions((prev) =>
        prev.map((d) =>
          d.id === decision.id ? { ...d, confirmed: true, mock: true } : d
        )
      )
    } finally {
      setLoading(false)
    }
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now'
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  // Get action color
  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'buy':
      case 'long':
        return 'success'
      case 'sell':
      case 'short':
        return 'error'
      default:
        return 'neutral'
    }
  }

  // Get action icon
  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'buy':
      case 'long':
        return '↑'
      case 'sell':
      case 'short':
        return '↓'
      case 'hold':
        return '→'
      default:
        return '•'
    }
  }

  return (
    <Card 
      title="Execution Console" 
      subtitle="Karan's Trading Decisions"
      variant="elevated"
      className="action-panel-card"
    >
      <div className="action-panel-container">
        {error && (
          <div className="action-panel-error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {decisions.length === 0 ? (
          <div className="action-panel-empty">
            <p>No decisions available</p>
            <p className="text-muted">Waiting for trading signals...</p>
          </div>
        ) : (
          <div className="action-panel-list">
            <AnimatePresence>
              {decisions.map((decision) => (
                <motion.div
                  key={decision.id}
                  className={`decision-item ${decision.confirmed ? 'decision-confirmed' : ''}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="decision-header">
                    <div className="decision-symbol">
                      <span className="symbol">{decision.symbol || 'N/A'}</span>
                      <span className={`action-badge action-${getActionColor(decision.action)}`}>
                        {getActionIcon(decision.action)} {decision.action || 'HOLD'}
                      </span>
                    </div>
                    <div className="decision-time">
                      {formatTime(decision.timestamp)}
                    </div>
                  </div>

                  <div className="decision-body">
                    {decision.price && (
                      <div className="decision-price">
                        <span className="price-label">Price:</span>
                        <span className="price-value">${decision.price.toFixed(2)}</span>
                      </div>
                    )}

                    {decision.quantity && (
                      <div className="decision-quantity">
                        <span className="quantity-label">Quantity:</span>
                        <span className="quantity-value">{decision.quantity}</span>
                      </div>
                    )}

                    {decision.reason && (
                      <div className="decision-reason">
                        <span className="reason-label">Reason:</span>
                        <p className="reason-text">{decision.reason}</p>
                      </div>
                    )}

                    {decision.confidence && (
                      <div className="decision-confidence">
                        <span className="confidence-label">Confidence:</span>
                        <span className="confidence-value">{decision.confidence}%</span>
                      </div>
                    )}
                  </div>

                  <div className="decision-footer">
                    {!decision.confirmed ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirm(decision)}
                        disabled={loading}
                        fullWidth
                      >
                        {loading ? 'Confirming...' : 'Confirm Decision'}
                      </Button>
                    ) : (
                      <div className="decision-confirmed-badge">
                        <span>✓ Confirmed</span>
                        {decision.mock && <span className="mock-indicator">(Mock)</span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ActionPanel

