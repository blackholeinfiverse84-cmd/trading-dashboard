import React, { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import Card from './common/Card'
import './AssetAllocation.css'

// Risk and Profit data for each asset type
const getRiskProfitData = (name) => {
  const data = {
    // Asset Wise - Top level categories
    'Stock': { risk: 70, profit: 30 },
    'Cryptocurrency': { risk: 85, profit: 15 },
    'Commodities': { risk: 75, profit: 25 },
    // Sub Asset Wise - Stock breakdowns
    'Large Cap': { risk: 45, profit: 55 },
    'Mid Cap': { risk: 60, profit: 40 },
    'Small Cap': { risk: 80, profit: 20 },
    'RELIANCE': { risk: 55, profit: 45 },
    'TCS': { risk: 40, profit: 60 },
    'HDFCBANK': { risk: 50, profit: 50 },
    // Sub Asset Wise - Cryptocurrency breakdowns
    'Bitcoin': { risk: 80, profit: 20 },
    'Ethereum': { risk: 85, profit: 15 },
    'Other Crypto': { risk: 90, profit: 10 },
    // Sub Asset Wise - Commodities breakdowns
    'Gold': { risk: 60, profit: 40 },
    'Silver': { risk: 70, profit: 30 },
    'Oil': { risk: 85, profit: 15 },
  }
  return data[name] || { risk: 50, profit: 50 }
}

const ASSET_DATA = {
  // Asset Wise: High-level asset categories
  'asset-wise': [
    { name: 'Stock', percentage: 40.33, value: 220291, color: '#007AFF' },
    { name: 'Cryptocurrency', percentage: 29.59, value: 140291, color: '#8E8E93' },
    { name: 'Commodities', percentage: 30.08, value: 2020291, color: '#34C759' },
  ],
  // Sub Asset Wise: Detailed breakdown within each category
  'sub-asset-wise': [
    // Stock breakdowns
    { name: 'Large Cap', percentage: 20.15, value: 110145, color: '#007AFF' },
    { name: 'Mid Cap', percentage: 12.10, value: 66087, color: '#5AC8FA' },
    { name: 'Small Cap', percentage: 8.08, value: 44058, color: '#AF52DE' },
    // Cryptocurrency breakdowns
    { name: 'Bitcoin', percentage: 18.50, value: 101015, color: '#8E8E93' },
    { name: 'Ethereum', percentage: 8.50, value: 46425, color: '#636366' },
    { name: 'Other Crypto', percentage: 2.59, value: 14151, color: '#48484A' },
    // Commodities breakdowns
    { name: 'Gold', percentage: 18.05, value: 98500, color: '#34C759' },
    { name: 'Silver', percentage: 8.50, value: 46425, color: '#32D74B' },
    { name: 'Oil', percentage: 3.53, value: 19266, color: '#30D158' },
  ],
  // AMC Wise: Shows assets with different allocation percentages (managed view)
  'amc-wise': [
    { name: 'Stock', percentage: 42.50, value: 232000, color: '#007AFF' },
    { name: 'Cryptocurrency', percentage: 28.30, value: 154500, color: '#8E8E93' },
    { name: 'Commodities', percentage: 29.20, value: 159500, color: '#34C759' },
  ],
}

const TABS = [
  { id: 'asset-wise', label: 'Asset Wise' },
  { id: 'sub-asset-wise', label: 'Sub Asset Wise' },
  { id: 'amc-wise', label: 'AMC Wise' },
]

// Mock portfolio data - will be replaced with real data from props
const mockPortfolio = {
  totalEquity: 2450000,
  dailyPnL: 18500,
  exposure: 0.68,
  cashBuffer: 0.22,
}

const AssetAllocation = ({ portfolioData }) => {
  const [activeTab, setActiveTab] = useState('sub-asset-wise')
  const [viewMode, setViewMode] = useState('current') // 'current' or 'invested'
  const [selectedAsset, setSelectedAsset] = useState(null)
  
  // Use portfolio data if provided, otherwise use mock
  const portfolio = portfolioData?.portfolio || mockPortfolio
  const totalEquity = portfolio?.totalEquity || mockPortfolio.totalEquity
  
  // Get base assets for the active tab
  const baseAssets = ASSET_DATA[activeTab] || []

  // Calculate AUM from portfolio total equity
  const totalAUM = useMemo(() => {
    if (portfolio?.totalEquity) {
      return portfolio.totalEquity
    }
    // Calculate from base asset percentages if no portfolio data
    const totalPercentage = baseAssets.reduce((sum, asset) => sum + (asset.percentage || 0), 0)
    if (totalPercentage > 0) {
      // Estimate AUM from first asset's value and percentage
      const firstAsset = baseAssets[0]
      if (firstAsset && firstAsset.value && firstAsset.percentage) {
        return (firstAsset.value / firstAsset.percentage) * 100
      }
    }
    return 2450000 // Default AUM
  }, [baseAssets, portfolio])

  // Calculate actual values and normalize percentages to ensure they sum to 100%
  const scaledAssets = useMemo(() => {
    if (!baseAssets || baseAssets.length === 0) return []
    
    // Calculate total percentage
    const totalPercentage = baseAssets.reduce((sum, asset) => sum + (asset.percentage || 0), 0)
    
    // Normalize percentages if they don't sum to 100%
    const normalizedAssets = totalPercentage > 0 
      ? baseAssets.map(asset => ({
          ...asset,
          percentage: ((asset.percentage || 0) / totalPercentage) * 100,
        }))
      : baseAssets
    
    // Calculate actual values based on AUM and percentages
    return normalizedAssets.map(asset => ({
      ...asset,
      value: (totalAUM * (asset.percentage || 0)) / 100,
    }))
  }, [baseAssets, totalAUM])

  // Handle tab change - clear selection
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSelectedAsset(null) // Clear selection when switching tabs
  }

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`
    }
    return `₹${value.toLocaleString()}`
  }

  // Get risk and profit data for selected asset
  const riskProfitData = useMemo(() => {
    return selectedAsset ? getRiskProfitData(selectedAsset.name) : null
  }, [selectedAsset])

  // Prepare data for recharts - show risk/profit if asset is selected, otherwise show allocation
  const chartData = useMemo(() => {
    if (selectedAsset && riskProfitData) {
      // Show risk vs profit for selected asset
      return [
        { name: 'Risk', value: riskProfitData.risk, color: '#FF3B30' },
        { name: 'Profit', value: riskProfitData.profit, color: '#34C759' },
      ]
    }
    // Show normal allocation data
    if (!scaledAssets || scaledAssets.length === 0) {
      return []
    }
    return scaledAssets.map((asset) => ({
      name: asset.name,
      value: asset.percentage,
      color: asset.color,
      amount: asset.value,
    }))
  }, [scaledAssets, selectedAsset, riskProfitData])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const isRiskProfitView = selectedAsset && riskProfitData
      return (
        <div className="chart-tooltip">
          <p className="tooltip-name">{data.name}</p>
          <p className="tooltip-value">
            {isRiskProfitView ? `${data.value.toFixed(1)}%` : `${data.value.toFixed(2)}%`}
          </p>
          {!isRiskProfitView && data.payload?.amount && (
            <p className="tooltip-amount">{formatCurrency(data.payload.amount)}</p>
          )}
        </div>
      )
    }
    return null
  }

  // Group assets by category for different views
  const groupedAssets = useMemo(() => {
    if (activeTab === 'sub-asset-wise') {
      // Group sub-assets by their parent category
      const stocks = scaledAssets.filter(a => 
        ['Large Cap', 'Mid Cap', 'Small Cap', 'RELIANCE', 'TCS', 'HDFCBANK'].includes(a.name)
      )
      const crypto = scaledAssets.filter(a => 
        ['Bitcoin', 'Ethereum', 'Other Crypto'].includes(a.name)
      )
      const commodities = scaledAssets.filter(a => 
        ['Gold', 'Silver', 'Oil'].includes(a.name)
      )
      
      const groups = {}
      if (stocks.length > 0) groups['Stock Holdings'] = stocks
      if (crypto.length > 0) groups['Cryptocurrency Holdings'] = crypto
      if (commodities.length > 0) groups['Commodity Holdings'] = commodities
      
      return Object.keys(groups).length > 0 ? groups : { all: scaledAssets }
    }
    
    if (activeTab === 'amc-wise') {
      // For AMC-wise, show all assets in a single list (same structure as asset-wise but different percentages)
      return { all: scaledAssets }
    }
    
    // For asset-wise, show all in a single list
    return { all: scaledAssets }
  }, [scaledAssets, activeTab])

  // Handle legend item click - toggle selection
  const handleLegendClick = (asset, event) => {
    if (!asset || !event) return
    event.preventDefault()
    event.stopPropagation()
    // If clicking the same asset, deselect it
    if (selectedAsset && selectedAsset.name === asset.name) {
      setSelectedAsset(null)
    } else {
      setSelectedAsset(asset)
    }
  }

  // Handle view mode change - could affect data in future
  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    // Clear selection when switching view modes
    setSelectedAsset(null)
  }

  return (
    <Card className="asset-allocation-card" padding="md">
      <div className="asset-allocation-header">
        <div className="aum-display">
          <span className="aum-label">AUM</span>
          <span className="aum-value">{formatCurrency(totalAUM)}</span>
        </div>
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === 'current' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('current')}
          >
            Current
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'invested' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('invested')}
          >
            Invested
          </button>
        </div>
        <div className="allocation-tabs">
          {TABS && TABS.length > 0 && TABS.map((tab) => (
            <button
              key={tab?.id || 'tab'}
              className={`allocation-tab ${activeTab === tab?.id ? 'active' : ''}`}
              onClick={() => tab?.id && handleTabChange(tab.id)}
            >
              {tab?.label || 'Tab'}
            </button>
          ))}
        </div>
      </div>

      <div className="allocation-content">
        <div className="chart-section">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={600}
                >
                  {chartData && chartData.length > 0 && chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry?.color || '#8884d8'}
                      stroke="transparent"
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-loading">Loading chart data...</div>
          )}
          <div className="chart-center-label">
            {selectedAsset ? (
              <div className="chart-center-content">
                <div className="chart-center-name">{selectedAsset.name}</div>
                {riskProfitData && activeTab !== 'asset-wise' && (
                  <div className="chart-center-stats">
                    <div className="chart-stat">
                      <span className="chart-stat-label">Risk</span>
                      <span className="chart-stat-value" style={{ color: '#FF3B30' }}>
                        {riskProfitData.risk}%
                      </span>
                    </div>
                    <div className="chart-stat">
                      <span className="chart-stat-label">Profit</span>
                      <span className="chart-stat-value" style={{ color: '#34C759' }}>
                        {riskProfitData.profit}%
                      </span>
                    </div>
                  </div>
                )}
                {riskProfitData && activeTab === 'asset-wise' && (
                  <div className="chart-center-stats">
                    <div className="chart-stat">
                      <span className="chart-stat-label">Risk</span>
                      <span className="chart-stat-value" style={{ color: '#FF3B30' }}>
                        {riskProfitData.risk}
                      </span>
                    </div>
                    <div className="chart-stat">
                      <span className="chart-stat-label">Profit</span>
                      <span className="chart-stat-value" style={{ color: '#34C759' }}>
                        {riskProfitData.profit}
                      </span>
                    </div>
                  </div>
                )}
                <button 
                  className="chart-close-btn"
                  onClick={() => setSelectedAsset(null)}
                  title="Close"
                >
                  ×
                </button>
              </div>
            ) : (
              activeTab === 'asset-wise' ? 'Assets' : 
              activeTab === 'sub-asset-wise' ? 'Sub Assets' : 
              'AMC'
            )}
          </div>
        </div>

        <div className="legend-section">
          {Object.entries(groupedAssets).map(([category, items]) => (
            <div key={category} className="legend-category">
              {Object.keys(groupedAssets).length > 1 && (
                <h4 className="legend-category-title">{category}</h4>
              )}
              <div className="legend-list">
                {items && items.length > 0 && items.map((asset, index) => (
                  <motion.button
                    key={`${asset?.name || 'asset'}-${index}`}
                    className={`legend-item legend-item-button ${
                      selectedAsset && selectedAsset.name === asset?.name ? 'selected' : ''
                    }`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={(e) => asset && handleLegendClick(asset, e)}
                  >
                    <div className="legend-dot" style={{ backgroundColor: asset?.color || '#8884d8' }} />
                    <span className="legend-name">{asset?.name || 'Unknown'}</span>
                    <span className="legend-percentage">{(asset?.percentage || 0).toFixed(2)}%</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </Card>
  )
}

export default AssetAllocation
