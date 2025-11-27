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
          <div className="sparkline">
            {analytics.scores.slice(0, 15).map((score, idx) => (
              <span
                key={`${score}-${idx}`}
                style={{ height: `${Math.max(5, score)}%` }}
              />
            ))}
          </div>
          <p className="feedback-note">Last {analytics.scores.length} submissions</p>
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
      {analytics.latestComments.length > 0 && (
        <div className="feedback-comments">
          <p className="feedback-label">Recent commentary</p>
          {analytics.latestComments.map((comment) => (
            <div key={comment.id} className="feedback-comment">
              <div className="comment-meta">
                <span className="comment-symbol">{comment.symbol || 'N/A'}</span>
                {comment.action && <span className="comment-action">{comment.action}</span>}
                <span className="comment-score">{comment.score}%</span>
              </div>
              <p className="comment-text">{comment.notes}</p>
            </div>
          ))}
        </div>
      )}
      <p className="feedback-hint">
        Feedback is stored locally (`trading:feedbackLog`). Use it to calibrate RL/MCP actions or export via the sync bar.
      </p>
    </Card>
  )
}

export default FeedbackInsights

