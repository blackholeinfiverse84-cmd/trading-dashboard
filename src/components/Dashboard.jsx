import React, { useState, useMemo } from 'react'
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
  const [riskContext, setRiskContext] = useState({
    stopLoss: 5,
    targetReturn: 10,
    investmentAmount: 5000,
    riskMode: 'auto',
    horizon: 'week',
  })

  const handleDecisionUpdate = (decision) => {
    setDecisionData(decision)
  }

  const handleRiskUpdate = (riskPayload) => {
    setRiskContext(riskPayload.parameters)
  }

  const handleInputSubmit = async (inputData) => {
    handleDecisionUpdate(inputData)
    handleRiskUpdate(inputData)
  }

  const dashboardSignals = useMemo(() => ({
    latestDecision: decisionData,
    risk: riskContext,
    horizonLabel: riskContext.horizon?.charAt(0).toUpperCase() + riskContext.horizon?.slice(1),
  }), [decisionData, riskContext])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Trading Dashboard</h1>
          <p className="text-muted">Multi-asset trading interface</p>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-status">
            <span className="status-indicator"></span>
            <span>Live</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-column dashboard-column-main">
          <LiveFeed signals={dashboardSignals} />
          <InsightsPanel latestTrade={decisionData} risk={riskContext} />
          <MultiAssetBoard risk={riskContext} />
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

