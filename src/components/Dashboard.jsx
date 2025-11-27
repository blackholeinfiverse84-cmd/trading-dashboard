import React, { useState, useMemo } from 'react'
import { LangGraphClient } from '../services/langGraphClient'
import ThemeToggle from './ThemeToggle'
import LiveFeed from './LiveFeed'
import ActionPanel from './ActionPanel'
import InputPanel from './InputPanel'
import ChatPanel from './ChatPanel'
import InsightsPanel from './InsightsPanel'
import MultiAssetBoard from './MultiAssetBoard'
import PortfolioOverview from './PortfolioOverview'
import FeedbackInsights from './FeedbackInsights'
import MarketEvents from './MarketEvents'
import LangGraphReport from './LangGraphReport'
import LangGraphSyncBar from './LangGraphSyncBar'
import './Dashboard.css'

const Dashboard = () => {
  const [decisionData, setDecisionData] = useState(null)
  const [riskContext, setRiskContext] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('trading:riskPrefs') || '{}')
    return {
      stopLoss: saved.stopLoss ?? 5,
      targetReturn: saved.targetReturn ?? 10,
      investmentAmount: saved.investmentAmount ?? 5000,
      riskMode: saved.riskMode || 'auto',
      horizon: saved.horizon || 'week',
      symbol: saved.symbol || 'AAPL',
      assetType: saved.assetType || 'Stock',
    }
  })

  const handleDecisionUpdate = (decision) => {
    setDecisionData(decision)
  }

  const handleRiskUpdate = (payload) => {
    const next = {
      ...riskContext,
      ...payload.parameters,
      symbol: payload.symbol,
      assetType: payload.assetType,
    }
    setRiskContext(next)
    localStorage.setItem('trading:riskPrefs', JSON.stringify(next))
    LangGraphClient.sendRiskSnapshot(next)
  }

  const handleInputSubmit = async (inputData) => {
    handleDecisionUpdate(inputData)
    handleRiskUpdate(inputData)

    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'risk-submission',
      payload: inputData,
    }
    const log = JSON.parse(localStorage.getItem('trading:riskLog') || '[]')
    log.unshift(entry)
    localStorage.setItem('trading:riskLog', JSON.stringify(log.slice(0, 100)))
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
          <ThemeToggle />
        </div>
      </div>

      <LangGraphSyncBar risk={riskContext} />

      <div className="dashboard-grid">
        <div className="dashboard-column dashboard-column-main">
          <LiveFeed signals={dashboardSignals} />
          <div className="dashboard-row">
            <InsightsPanel latestTrade={decisionData} risk={riskContext} />
            <FeedbackInsights risk={riskContext} />
          </div>
          <MultiAssetBoard risk={riskContext} />
          <LangGraphReport />
          <MarketEvents />
          <ChatPanel />
        </div>
        
        <div className="dashboard-column dashboard-column-sidebar">
          <InputPanel onSubmit={handleInputSubmit} />
          <PortfolioOverview />
          <ActionPanel
            decisionData={decisionData}
            onDecisionUpdate={handleDecisionUpdate}
            risk={riskContext}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

