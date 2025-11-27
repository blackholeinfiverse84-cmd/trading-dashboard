import React from 'react'
import Card from './common/Card'
import { LangGraphClient } from '../services/langGraphClient'
import './LangGraphReport.css'

const LangGraphReport = () => {
  const risk = LangGraphClient.replayLog('trading:riskLog', 10)
  const feedback = LangGraphClient.replayLog('trading:feedbackLog', 10)

  return (
    <Card title="LangGraph report" subtitle="Latest events ready for agents" className="report-card">
      <div className="report-section">
        <h4>Risk submissions ({risk.length})</h4>
        <div className="report-table">
          {risk.map((row) => (
            <div key={row.id} className="report-row">
              <div>
                <span className="report-label">{row.snapshot?.symbol || 'N/A'}</span>
                <span className="report-sub">{new Date(row.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="report-meta">
                SL {row.snapshot?.stopLoss}% / TR {row.snapshot?.targetReturn}%
              </div>
              <div className="report-meta">{row.snapshot?.horizon}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section">
        <h4>Feedback ({feedback.length})</h4>
        <div className="report-table">
          {feedback.map((item) => (
            <div key={item.id} className="report-row">
              <div>
                <span className="report-label">{item.feedback?.symbol || 'N/A'}</span>
                <span className="report-sub">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="report-meta">{item.feedback?.score}%</div>
              <div className="report-comment">{item.feedback?.notes || 'No notes'}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default LangGraphReport

