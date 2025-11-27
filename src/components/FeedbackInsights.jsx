import React, { useMemo } from 'react'
import Card from './common/Card'
import { LangGraphClient } from '../services/langGraphClient'
import './FeedbackInsights.css'

const FeedbackInsights = ({ risk }) => {
  const analytics = useMemo(() => LangGraphClient.getAnalytics(), [risk])

  if (!analytics) {
    return (
      <Card title="Feedback Insights" subtitle="No feedback captured yet" className="feedback-card" />
    )
  }

  return (
    <Card title="Feedback insights" subtitle="What the desk is signaling" className="feedback-card" padding="md">
      <div className="feedback-grid">
        <div className="feedback-stat">
          <p className="feedback-label">Avg. confidence</p>
          <p className="feedback-value">{analytics.avgScore}%</p>
          <p className="feedback-note">Based on recent feedback submissions</p>
        </div>
        <div className="feedback-heat">
          <p className="feedback-label">Horizon mix</p>
          <div className="heat-legend">
            {Object.keys(analytics.horizonCounts).map((horizon) => (
          <div key={horizon} className="heat-item">
            <span className="dot" />
            <span>{horizon}</span>
            <strong>{analytics.horizonCounts[horizon]}</strong>
          </div>
            ))}
          </div>
        </div>
      </div>
      <p className="feedback-hint">
        Feedback is stored locally (`trading:feedbackLog`). Use it to calibrate RL/MCP actions or export via the upcoming LangGraph adapter.
      </p>
    </Card>
  )
}

export default FeedbackInsights

