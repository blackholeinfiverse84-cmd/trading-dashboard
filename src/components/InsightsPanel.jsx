import React, { useState, useEffect } from 'react'
import Card from './common/Card'
import { getSentimentSummary } from '../services/api'
import './InsightsPanel.css'

const InsightsPanel = ({ latestTrade, risk }) => {
  const [insights, setInsights] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const fetchInsights = async () => {
      try {
        setError(null)
        const data = await getSentimentSummary()
        if (mounted) {
          setInsights(normalizeInsights(data))
        }
      } catch (err) {
        console.error('Sentiment fetch failed:', err)
        if (mounted) {
          setError('Showing mock sentiment data')
          setInsights(getMockInsights())
        }
      }
    }

    fetchInsights()
    const interval = setInterval(fetchInsights, 15000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const stats = insights ? blendRisk(insights, risk) : blendRisk(getMockInsights(), risk)
  const latest = latestTrade || stats.latestTrade

  return (
    <div className="insights-grid">
      <Card className="insight-card" title="Market Sentiment" padding="md">
        <div className="sentiment-score">
          <span
            className={`sentiment-badge sentiment-${stats.sentimentLabel.toLowerCase()}`}
          >
            {stats.sentimentLabel}
          </span>
          <p className="sentiment-value">{stats.sentimentScore}%</p>
        </div>
        <p className="sentiment-context">{stats.sentimentContext}</p>
        {error && <p className="insight-warning">⚠️ {error}</p>}
      </Card>

      <Card className="insight-card" title="Model Recommendation" padding="md">
        <div className="recommendation">
          <div>
            <p className="insight-label">Action</p>
            <p className={`insight-value ${stats.action.toLowerCase()}`}>{stats.action}</p>
          </div>
          <div>
            <p className="insight-label">Confidence</p>
            <p className="insight-value">{stats.confidence}%</p>
          </div>
          <div>
            <p className="insight-label">Timeframe</p>
            <p className="insight-value">{stats.timeframe}</p>
          </div>
        </div>
        <p className="insight-summary">{stats.commentary}</p>
      </Card>

      <Card className="insight-card" title="Latest Executed Trade" padding="md">
        <div className="latest-trade">
          <div>
            <p className="insight-label">Symbol</p>
            <p className="insight-value">{latest.symbol || '—'}</p>
          </div>
          <div>
            <p className="insight-label">Action</p>
            <p className={`insight-value ${latest.action?.toLowerCase() || ''}`}>
              {latest.action || '—'}
            </p>
          </div>
          <div>
            <p className="insight-label">Filled</p>
            <p className="insight-value">
              {latest.timestamp
                ? new Date(latest.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'}
            </p>
          </div>
        </div>
        <p className="insight-summary">
          {latest.reason || 'Awaiting first confirmation.'}
        </p>
      </Card>
    </div>
  )
}

const normalizeInsights = (payload) => {
  if (!payload) return getMockInsights()

  return {
    sentimentScore: Number(payload.sentimentScore ?? 62),
    sentimentLabel: payload.sentimentLabel || labelFromScore(payload.sentimentScore),
    sentimentContext:
      payload.sentimentContext || 'Balanced flows with bullish bias in large caps.',
    action: payload.action || 'BUY',
    confidence: Number(payload.confidence ?? 78).toFixed(1),
    timeframe: payload.timeframe || 'Next 3 sessions',
    commentary:
      payload.commentary ||
      'Momentum indicators support incremental accumulation on dips.',
    latestTrade: payload.latestTrade || getMockInsights().latestTrade,
  }
}

const labelFromScore = (score = 50) => {
  if (score >= 65) return 'Bullish'
  if (score <= 40) return 'Bearish'
  return 'Neutral'
}

const getMockInsights = () => ({
  sentimentScore: 68,
  sentimentLabel: 'Bullish',
  sentimentContext: 'Options positioning indicates steady buying interest.',
  action: 'BUY',
  confidence: 82,
  timeframe: 'Next 2 sessions',
  commentary: 'Look to accumulate quality banks with tight stops.',
  latestTrade: {
    symbol: 'AAPL',
    action: 'BUY',
    timestamp: new Date().toISOString(),
    reason: 'Follow-through on breakout with 1.2% risk.',
  },
})

const blendRisk = (base, risk = {}) => {
  if (!risk) return base
  const modifier = risk.targetReturn - risk.stopLoss
  const adjustedConfidence = Math.max(40, Math.min(99, base.confidence + modifier * 0.5))
  const adjustedScore = Math.max(0, Math.min(100, base.sentimentScore + modifier * 0.3))

  return {
    ...base,
    sentimentScore: Number(adjustedScore.toFixed(1)),
    confidence: Number(adjustedConfidence.toFixed(1)),
    sentimentContext: `${base.sentimentContext} Horizon: ${risk.horizon || 'week'} · Stop ${risk.stopLoss}% · Target ${risk.targetReturn}%.`,
  }
}

export default InsightsPanel

