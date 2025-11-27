import React from 'react'
import LangGraphReport from '../LangGraphReport'
import Card from '../common/Card'
import Button from '../common/Button'
import { LangGraphClient } from '../../services/langGraphClient'
import './LangGraphPage.css'

const LangGraphPage = () => {
  const handleClear = () => {
    localStorage.removeItem('trading:riskLog')
    localStorage.removeItem('trading:feedbackLog')
    window.location.reload()
  }

  return (
    <div className="langgraph-page">
      <Card title="LangGraph Adapter" subtitle="Mock events & data feeds" className="langgraph-header">
        <p>
          This view surfaces the local risk and feedback logs that the LangGraph adapter publishes. Use it to validate payloads before wiring the real backend.
        </p>
        <div className="langgraph-actions">
          <Button variant="secondary" onClick={() => LangGraphClient.syncAll()}>
            Trigger Mock Sync
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            Clear Logs
          </Button>
        </div>
      </Card>
      <LangGraphReport />
    </div>
  )
}

export default LangGraphPage

