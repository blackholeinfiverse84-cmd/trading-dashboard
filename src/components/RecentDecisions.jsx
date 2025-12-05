import React, { useEffect, useState } from 'react'
import Card from './common/Card'
import './RecentDecisions.css'

const RecentDecisions = ({ refreshKey }) => {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('trading:riskLog') || '[]'
      const parsed = JSON.parse(raw)
      setEntries(Array.isArray(parsed) ? parsed.slice(0, 6) : [])
    } catch (err) {
      console.error('Failed to read trading:riskLog:', err)
      setEntries([])
    }
  }, [refreshKey])

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now'
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!entries.length) {
    return (
      <Card
        title="Recent AI decisions"
        subtitle="Your latest risk snapshots"
        padding="md"
        className="recent-decisions-card"
      >
        <div className="recent-decisions-empty">
          <p>No recent submissions yet.</p>
          <p className="text-muted">Use the input panel to capture a trade idea.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card
      title="Recent AI decisions"
      subtitle="Last few risk snapshots"
      padding="md"
      className="recent-decisions-card"
    >
      <ul className="recent-decisions-list">
        {entries.map((entry) => {
          const payload = entry.payload || {}
          const symbol = payload.symbol || 'Asset'
          const action = (payload.action || 'HOLD').toUpperCase()
          const confidence = payload.confidence ?? null
          const horizon = payload.horizon || payload.parameters?.horizon || 'week'
          const capitalAtRisk = payload.parameters?.capitalAtRisk

          return (
            <li key={entry.id} className="recent-decision-item">
              <div className="recent-decision-main">
                <div className="recent-decision-symbol">
                  <span className="symbol-tag">{symbol}</span>
                  <span className={`action-tag action-${action.toLowerCase()}`}>
                    {action}
                  </span>
                </div>
                <div className="recent-decision-meta">
                  {confidence != null && (
                    <span className="meta-pill">
                      {confidence}% confidence
                    </span>
                  )}
                  {typeof capitalAtRisk === 'number' && (
                    <span className="meta-pill">
                      {capitalAtRisk}% at risk
                    </span>
                  )}
                  {horizon && (
                    <span className="meta-pill meta-light">
                      {horizon.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="recent-decision-footer">
                <span className="timestamp">{formatTime(entry.timestamp)}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export default RecentDecisions





