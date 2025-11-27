import React from 'react'
import LangGraphReport from '../LangGraphReport'
import Card from '../common/Card'
import Button from '../common/Button'
import { LangGraphClient } from '../../services/langGraphClient'
import './LangGraphPage.css'

const LangGraphPage = () => {
  const [status, setStatus] = React.useState(null)

  const handleClear = () => {
    localStorage.removeItem('trading:riskLog')
    localStorage.removeItem('trading:feedbackLog')
    window.location.reload()
  }

  const handleSync = async () => {
    setStatus('Syncing...')
    try {
      await LangGraphClient.syncAll()
      setStatus('Mock sync complete')
    } catch (err) {
      setStatus('Sync failed')
    }
  }

  const handleExport = () => {
    LangGraphClient.exportJson()
    setStatus('Exported JSON')
  }

  return (
    <div className="langgraph-page">
      <Card title="LangGraph Adapter" subtitle="Mock events & data feeds" className="langgraph-header">
        <p>
          This view surfaces the local risk and feedback logs that the LangGraph adapter publishes. Use it to validate payloads before wiring the real backend.
        </p>
        <div className="langgraph-actions">
          <Button variant="secondary" onClick={handleSync}>
            Trigger Mock Sync
          </Button>
          <Button variant="outline" onClick={handleExport}>
            Download JSON
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            Clear Logs
          </Button>
        </div>
        {status && <p className="langgraph-status">{status}</p>}
      </Card>
      <LangGraphReport />
    </div>
  )
}

export default LangGraphPage

