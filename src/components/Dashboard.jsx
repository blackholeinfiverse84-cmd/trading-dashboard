import React, { useState, useMemo, lazy, Suspense, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { LangGraphClient } from '../services/langGraphClient'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useIsMobile } from '../hooks/useIsMobile'
import ThemeToggle from './ThemeToggle'
import LiveFeed from './LiveFeed'
import ActionPanel from './ActionPanel'
import InputPanel from './InputPanel'
import InsightsPanel from './InsightsPanel'
import PortfolioOverview from './PortfolioOverview'
import AssetAllocation from './AssetAllocation'
import LangGraphSyncBar from './LangGraphSyncBar'
import RecentDecisions from './RecentDecisions'
import Button from './common/Button'
import ChartToolbar from './common/ChartToolbar'
import ScrollToTop from './common/ScrollToTop'
import HomePage from './pages/HomePage'
import TradingPage from './pages/TradingPage'
import PortfolioPage from './pages/PortfolioPage'
import AnalyticsPage from './pages/AnalyticsPage'
import MorePage from './pages/MorePage'
import BottomNav from './layout/BottomNav'
import './Dashboard.css'

// Lazy load components below the fold for better initial load performance
const FloatingAIAssistant = lazy(() => import('./FloatingAIAssistant'))
const MultiAssetBoard = lazy(() => import('./MultiAssetBoard'))
const FeedbackInsights = lazy(() => import('./FeedbackInsights'))
const MarketEvents = lazy(() => import('./MarketEvents'))
const LangGraphReport = lazy(() => import('./LangGraphReport'))
const Scorecards = lazy(() => import('./Scorecards'))

// Loading fallback component with skeleton
import { SkeletonCard } from './common/Skeleton'

const ComponentLoader = () => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <SkeletonCard />
  </div>
)

const Dashboard = () => {
  // Ensure dashboard always starts at top on load/refresh
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

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
    portfolio: {
      totalEquity: 2450000, // This should come from your portfolio data source
      dailyPnL: 18500,
      exposure: 0.68,
      cashBuffer: 0.22,
      leverage: 0.35,
    },
  }), [decisionData, riskContext])

  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const displayName = user?.username || 'Guest Trader'
  const [activeTool, setActiveTool] = useState('cursor')
  const isMobile = useIsMobile()

  const handleLogout = () => {
    logout()
    addToast({
      title: 'Signed out',
      message: 'You have been logged out successfully.',
      variant: 'info',
    })
    navigate('/login')
  }

  const handleToolChange = (toolId) => {
    // Only update if tool actually changed
    if (activeTool === toolId) return
    setActiveTool(toolId)
    // Removed toast to prevent spam - tool selection is visual feedback enough
  }

  // Keyboard shortcuts
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useKeyboardShortcuts({
    'ctrl+k': () => {
      // Focus search input if available
      const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]')
      if (searchInput) {
        searchInput.focus()
        searchInput.select()
      }
    },
    'escape': () => {
      // Close any open modals or clear focus
      if (document.activeElement) {
        document.activeElement.blur()
      }
    },
    'ctrl+/': () => {
      addToast({
        title: 'Keyboard Shortcuts',
        message: 'Ctrl+K: Search | Esc: Close | Ctrl+/: Help',
        variant: 'info',
        duration: 5000,
      })
    },
    'home': () => scrollToTop(),
  }, [addToast])

  // Determine which page to show based on route (mobile) or show all (desktop)
  const getCurrentPage = () => {
    if (!isMobile) {
      // Desktop: Show everything (current behavior)
      return 'all'
    }

    // Mobile: Show specific page based on route
    const path = location.pathname
    if (path === '/dashboard/trading' || path.startsWith('/dashboard/trading')) {
      return 'trading'
    }
    if (path === '/dashboard/portfolio' || path.startsWith('/dashboard/portfolio')) {
      return 'portfolio'
    }
    if (path === '/dashboard/analytics' || path.startsWith('/dashboard/analytics')) {
      return 'analytics'
    }
    if (path === '/dashboard/more' || path.startsWith('/dashboard/more')) {
      return 'more'
    }
    // Default to home
    return 'home'
  }

  const currentPage = getCurrentPage()

  // Render mobile-specific page or desktop full view
  const renderContent = () => {
    if (!isMobile) {
      // Desktop: Show everything
      return (
        <>
          <ChartToolbar onToolChange={handleToolChange} initialTool={activeTool} />
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
              <div className="dashboard-user-section">
                <div className="dashboard-user-pill">
                  <span className="dashboard-user-avatar">{displayName.charAt(0).toUpperCase()}</span>
                  <div className="dashboard-username">
                    <span className="text-muted">Signed in as</span>
                    <strong>{displayName}</strong>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {!isMobile && <LangGraphSyncBar risk={riskContext} />}

          <div className="dashboard-grid">
            <div className="dashboard-column dashboard-column-main">
              <LiveFeed signals={dashboardSignals} activeTool={activeTool} />
              <div className="dashboard-row">
                <InsightsPanel latestTrade={decisionData} risk={riskContext} />
                <Suspense fallback={<ComponentLoader />}>
                  <FeedbackInsights risk={riskContext} />
                </Suspense>
              </div>
              <Suspense fallback={<ComponentLoader />}>
                <Scorecards risk={riskContext} />
              </Suspense>
              <div className="dashboard-bottom-section">
                <Suspense fallback={<ComponentLoader />}>
                  <LangGraphReport />
                </Suspense>
                <Suspense fallback={<ComponentLoader />}>
                  <MarketEvents />
                </Suspense>
              </div>
              <Suspense fallback={<ComponentLoader />}>
                <MultiAssetBoard risk={riskContext} />
              </Suspense>
            </div>
            
            <div className="dashboard-column dashboard-column-sidebar">
              <AssetAllocation portfolioData={dashboardSignals} />
              <PortfolioOverview data={dashboardSignals.portfolio} />
              <InputPanel onSubmit={handleInputSubmit} />
              <ActionPanel
                decisionData={decisionData}
                onDecisionUpdate={handleDecisionUpdate}
                risk={riskContext}
              />
              <RecentDecisions refreshKey={decisionData?.id || decisionData?.timestamp} />
            </div>
          </div>
        </>
      )
    }

    // Mobile: Show specific page
    return (
      <>
        {/* Simplified Mobile Header */}
        <div className="dashboard-header mobile-header">
          <div className="dashboard-title">
            <h1>Trading Dashboard</h1>
          </div>
          <div className="dashboard-header-right">
            <div className="dashboard-user-section">
              <span className="dashboard-user-avatar">{displayName.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {currentPage === 'home' && (
          <HomePage
            dashboardSignals={dashboardSignals}
            riskContext={riskContext}
            decisionData={decisionData}
          />
        )}
        {currentPage === 'trading' && (
          <TradingPage
            dashboardSignals={dashboardSignals}
            activeTool={activeTool}
            decisionData={decisionData}
            riskContext={riskContext}
            onInputSubmit={handleInputSubmit}
            onDecisionUpdate={handleDecisionUpdate}
          />
        )}
        {currentPage === 'portfolio' && (
          <PortfolioPage
            dashboardSignals={dashboardSignals}
            decisionData={decisionData}
          />
        )}
        {currentPage === 'analytics' && (
          <AnalyticsPage riskContext={riskContext} />
        )}
        {currentPage === 'more' && (
          <MorePage riskContext={riskContext} />
        )}
      </>
    )
  }

  return (
    <div className={`dashboard ${isMobile ? 'mobile' : 'desktop'}`}>
      {renderContent()}
      {isMobile && <BottomNav />}
      <Suspense fallback={null}>
        <FloatingAIAssistant />
      </Suspense>
      {!isMobile && <ScrollToTop />}
    </div>
  )
}

export default Dashboard

