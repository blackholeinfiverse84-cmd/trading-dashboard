import React, { Suspense, lazy } from 'react'
import LiveFeed from '../LiveFeed'
import ActionPanel from '../ActionPanel'
import InputPanel from '../InputPanel'
import InsightsPanel from '../InsightsPanel'
import { SkeletonCard } from '../common/Skeleton'

const ComponentLoader = () => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <SkeletonCard />
  </div>
)
import './TradingPage.css'

const FeedbackInsights = lazy(() => import('../FeedbackInsights'))

const TradingPage = ({ dashboardSignals, activeTool, decisionData, riskContext, onInputSubmit, onDecisionUpdate }) => {
  return (
    <div className="trading-page">
      {/* Main Chart - Takes most of the screen */}
      <LiveFeed signals={dashboardSignals} activeTool={activeTool} />

      {/* Trading Actions */}
      <div className="trading-actions">
        <InputPanel onSubmit={onInputSubmit} />
        <ActionPanel
          decisionData={decisionData}
          onDecisionUpdate={onDecisionUpdate}
          risk={riskContext}
        />
      </div>

      {/* Insights */}
      <div className="trading-insights">
        <InsightsPanel latestTrade={decisionData} risk={riskContext} />
        <Suspense fallback={<ComponentLoader />}>
          <FeedbackInsights risk={riskContext} />
        </Suspense>
      </div>
    </div>
  )
}

export default TradingPage

