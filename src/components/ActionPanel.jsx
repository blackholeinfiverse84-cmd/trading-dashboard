import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './common/Card'
import Button from './common/Button'
import ConfidenceGauge from './common/ConfidenceGauge'
import { confirmDecision } from '../services/api'
import { LangGraphClient } from '../services/langGraphClient'
import { useToast } from '../contexts/ToastContext'
import './ActionPanel.css'

const ActionPanel = ({ decisionData, onDecisionUpdate, risk }) => {
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState({
    open: false,
    decision: null,
    score: 75,
    notes: '',
  })
  const { addToast } = useToast()

  useEffect(() => {
    if (decisionData) {
      addDecision(decisionData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisionData])

  const addDecision = (decision) => {
    const newDecision = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...decision,
    }
    setDecisions((prev) => [newDecision, ...prev].slice(0, 10))
  }

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
      addToast({
        title: 'Order confirmed',
        message: `${decision.symbol} ${decision.action} locked in.`,
        variant: 'success',
      })
    } catch (err) {
      console.error('Failed to confirm decision:', err)
      setError('Failed to confirm decision. Using mock confirmation.')
      setDecisions((prev) =>
        prev.map((d) =>
          d.id === decision.id ? { ...d, confirmed: true, mock: true } : d
        )
      )
      addToast({
        title: 'Confirmation failed',
        message: 'Using mock confirmation while service recovers.',
        variant: 'warning',
      })
    } finally {
      setLoading(false)
    }
  }

  const openFeedback = (decision) => {
    setFeedback({
      open: true,
      decision,
      score: decision?.confidence || 70,
      notes: '',
    })
  }

  const closeFeedback = () => {
    setFeedback((prev) => ({ ...prev, open: false, decision: null, notes: '' }))
  }

  const submitFeedback = () => {
    const entry = {
      id: Date.now(),
      decisionId: feedback.decision?.id,
      symbol: feedback.decision?.symbol,
      action: feedback.decision?.action,
      score: feedback.score,
      notes: feedback.notes,
      timestamp: new Date().toISOString(),
      riskSnapshot: risk,
    }
    LangGraphClient.sendFeedback(entry)
    closeFeedback()
    addToast({
      title: 'Feedback saved',
      message: `Desk context updated for ${feedback.decision?.symbol || 'trade'}.`,
      variant: 'success',
    })
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
                      <div className="decision-price" data-tooltip="Implied fill price">
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
                        <ConfidenceGauge value={decision.confidence} label="desk" size={70} />
                        <div className="confidence-details">
                          <span className="confidence-label">Confidence</span>
                          <span className="confidence-value">{decision.confidence}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="decision-footer">
                    <div className="decision-footer-actions">
                      {!decision.confirmed ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConfirm(decision)}
                          disabled={loading}
                        >
                          {loading ? 'Confirming...' : 'Confirm'}
                        </Button>
                      ) : (
                        <div className="decision-confirmed-badge">
                          <span>✓ Confirmed</span>
                          {decision.mock && <span className="mock-indicator">(Mock)</span>}
                        </div>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openFeedback(decision)}
                      >
                        Feedback
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      {feedback.open && (
        <div className="feedback-modal-overlay" onClick={closeFeedback}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-header">
              <h3>Trade Feedback</h3>
              <p className="text-muted">
                {feedback.decision?.symbol} • {feedback.decision?.action} • {risk?.horizon?.toUpperCase()}
              </p>
            </div>
            <div className="feedback-body">
              <label className="feedback-label">
                Confidence score: <strong>{feedback.score}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={feedback.score}
                onChange={(e) =>
                  setFeedback((prev) => ({ ...prev, score: Number(e.target.value) }))
                }
              />
              <div className="feedback-gauge">
                <span>Bearish</span>
                <span>Neutral</span>
                <span>High conviction</span>
              </div>
              <label className="feedback-label">Notes / Rationale</label>
              <textarea
                value={feedback.notes}
                onChange={(e) =>
                  setFeedback((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="What stood out? Any risk observations or model adjustments?"
              />
            </div>
            <div className="feedback-footer">
              <Button variant="ghost" onClick={closeFeedback}>
                Cancel
              </Button>
              <Button variant="primary" onClick={submitFeedback}>
                Save Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default ActionPanel

