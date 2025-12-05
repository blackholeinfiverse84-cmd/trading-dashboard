import React, { Suspense, lazy } from 'react'
import { SkeletonCard } from '../common/Skeleton'

const ComponentLoader = () => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <SkeletonCard />
  </div>
)
import './AnalyticsPage.css'

const Scorecards = lazy(() => import('../Scorecards'))
const FeedbackInsights = lazy(() => import('../FeedbackInsights'))
const MultiAssetBoard = lazy(() => import('../MultiAssetBoard'))

const AnalyticsPage = ({ riskContext }) => {
  return (
    <div className="analytics-page">
      {/* Scorecards - Main focus */}
      <Suspense fallback={<ComponentLoader />}>
        <Scorecards risk={riskContext} />
      </Suspense>

      {/* Feedback Insights */}
      <Suspense fallback={<ComponentLoader />}>
        <FeedbackInsights risk={riskContext} />
      </Suspense>

      {/* Multi-Asset Overview */}
      <Suspense fallback={<ComponentLoader />}>
        <MultiAssetBoard risk={riskContext} />
      </Suspense>
    </div>
  )
}

export default AnalyticsPage

