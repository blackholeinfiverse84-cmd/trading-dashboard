import React from 'react'
import AssetAllocation from '../AssetAllocation'
import PortfolioOverview from '../PortfolioOverview'
import RecentDecisions from '../RecentDecisions'
import './PortfolioPage.css'

const PortfolioPage = ({ dashboardSignals, decisionData }) => {
  return (
    <div className="portfolio-page">
      {/* Asset Allocation - Main focus */}
      <AssetAllocation portfolioData={dashboardSignals} />

      {/* Portfolio Overview */}
      <PortfolioOverview data={dashboardSignals?.portfolio} />

      {/* Recent Decisions */}
      <RecentDecisions refreshKey={decisionData?.id || decisionData?.timestamp} />
    </div>
  )
}

export default PortfolioPage

