import React, { useState } from 'react'
import Button from './common/Button'
import './LangGraphSyncBar.css'
import { LangGraphClient } from '../services/langGraphClient'

const LangGraphSyncBar = ({ risk }) => {
  const [status, setStatus] = useState(null)

  const handleSync = async () => {
    setStatus({ label: 'Syncing...', type: 'progress' })
    try {
      const response = await LangGraphClient.syncAll({
        onPayload: (payload) => console.log('LangGraph payload', payload),
      })
      setStatus({ label: `Sent ${response.payload.feedback.length + response.payload.risk.length} events`, type: 'success' })
    } catch (err) {
      console.error('LangGraph sync failed', err)
      setStatus({ label: 'Sync failed', type: 'error' })
    }
  }

  return (
    <div className="langgraph-bar">
      <div className="langgraph-info">
        <p className="langgraph-title">LangGraph adapter (mock)</p>
        <p className="langgraph-subtitle">
          Risk & feedback events are ready for RL/MCP consumption. Last horizon: {risk.horizon?.toUpperCase()}.
        </p>
      </div>
      <div className="langgraph-actions">
        {status && <span className={`status-chip ${status.type}`}>{status.label}</span>}
        <Button variant="secondary" size="sm" onClick={handleSync}>
          Sync mock events
        </Button>
      </div>
    </div>
  )
}

export default LangGraphSyncBar

