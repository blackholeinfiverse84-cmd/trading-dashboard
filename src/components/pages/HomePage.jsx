import React, { Suspense, lazy } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import PortfolioOverview from '../PortfolioOverview'
import AssetAllocation from '../AssetAllocation'
import RecentDecisions from '../RecentDecisions'
import Card from '../common/Card'
import { SkeletonCard } from '../common/Skeleton'

const ComponentLoader = () => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <SkeletonCard />
  </div>
)
import './HomePage.css'

const Scorecards = lazy(() => import('../Scorecards'))

const HomePage = ({ dashboardSignals, riskContext, decisionData }) => {
  const { user } = useAuth()
  const displayName = user?.username || 'Guest Trader'

  return (
    <div className="home-page">
      {/* Quick Stats */}
      <div className="home-stats">
        <Card className="home-stat-card" padding="md">
          <div className="home-stat-label">AUM</div>
          <div className="home-stat-value">
            ₹{((dashboardSignals?.portfolio?.totalEquity || 2450000) / 100000).toFixed(2)} L
          </div>
        </Card>
        <Card className="home-stat-card" padding="md">
          <div className="home-stat-label">Active Positions</div>
          <div className="home-stat-value">
            {dashboardSignals?.portfolio?.holdings?.length || 3}
          </div>
        </Card>
        <Card className="home-stat-card" padding="md">
          <div className="home-stat-label">P&L Today</div>
          <div className="home-stat-value positive">
            +{((dashboardSignals?.portfolio?.dailyPnL || 18500) / (dashboardSignals?.portfolio?.totalEquity || 2450000) * 100).toFixed(2)}%
          </div>
        </Card>
      </div>

      {/* Asset Allocation (Simplified) */}
      <AssetAllocation portfolioData={dashboardSignals} />

      {/* Portfolio Overview */}
      <PortfolioOverview data={dashboardSignals?.portfolio} />

      {/* Recent Decisions */}
      <RecentDecisions refreshKey={decisionData?.id || decisionData?.timestamp} />

      {/* Top Predictions (Simplified) */}
      <Suspense fallback={<ComponentLoader />}>
        <Scorecards risk={riskContext} />
      </Suspense>
    </div>
  )
}

export default HomePage

