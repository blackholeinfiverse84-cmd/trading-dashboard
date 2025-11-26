import React, { useState } from 'react'
import LiveFeed from './LiveFeed'
import ActionPanel from './ActionPanel'
import InputPanel from './InputPanel'
import ChatPanel from './ChatPanel'
import InsightsPanel from './InsightsPanel'
import MultiAssetBoard from './MultiAssetBoard'
import PortfolioOverview from './PortfolioOverview'
import MarketEvents from './MarketEvents'
import './Dashboard.css'

const Dashboard = () => {
  const [decisionData, setDecisionData] = useState(null)

  // Handle decision updates from other components
  const handleDecisionUpdate = (decision) => {
    setDecisionData(decision)
  }

  const handleInputSubmit = async (inputData) => {
    handleDecisionUpdate(inputData)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Trading Dashboard</h1>
          <p className="text-muted">Multi-asset trading interface</p>
        </div>
        <div className="dashboard-status">
          <span className="status-indicator"></span>
          <span>Live</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-column dashboard-column-main">
          <LiveFeed />
          <InsightsPanel latestTrade={decisionData} />
          <MultiAssetBoard />
          <MarketEvents />
          <ChatPanel />
        </div>
        
        <div className="dashboard-column dashboard-column-sidebar">
          <InputPanel onSubmit={handleInputSubmit} />
          <PortfolioOverview />
          <ActionPanel
            decisionData={decisionData}
            onDecisionUpdate={handleDecisionUpdate}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

