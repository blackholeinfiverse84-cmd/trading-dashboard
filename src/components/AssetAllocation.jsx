import React, { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import Card from './common/Card'
import './AssetAllocation.css'

const ASSET_DATA = {
  'asset-wise': [
    { name: 'Equity', percentage: 40.33, value: 220291, color: '#007AFF' },
    { name: 'Debt', percentage: 29.59, value: 140291, color: '#8E8E93' },
    { name: 'Hybrid', percentage: 17.65, value: 2020291, color: '#5856D6' },
    { name: 'Commodity', percentage: 12.43, value: 680291, color: '#34C759' },
  ],
  'sub-asset-wise': [
    { name: 'Large Cap', percentage: 49.86, value: 137291, color: '#1C1C1E' },
    { name: 'Mid Cap', percentage: 6.41, value: 55800, color: '#636366' },
    { name: 'Small Cap', percentage: 12.13, value: 27200, color: '#AEAEB2' },
    { name: 'RELIANCE', percentage: 33.49, value: 100800, color: '#007AFF' },
    { name: 'TCS', percentage: 3.54, value: 60800, color: '#5AC8FA' },
    { name: 'HDFCBANK', percentage: 2.33, value: 67300, color: '#AF52DE' },
    { name: 'ICICIBANK', percentage: 1.07, value: 29050, color: '#32D74B' },
  ],
  'amc-wise': [
    { name: 'HDFC Mutual Fund', percentage: 28.45, value: 155291, color: '#007AFF' },
    { name: 'ICICI Prudential', percentage: 22.33, value: 121900, color: '#5856D6' },
    { name: 'SBI Mutual Fund', percentage: 18.67, value: 101900, color: '#34C759' },
    { name: 'Axis Mutual Fund', percentage: 15.23, value: 83050, color: '#FF9500' },
    { name: 'Kotak Mutual Fund', percentage: 10.12, value: 55200, color: '#FF3B30' },
    { name: 'Others', percentage: 5.20, value: 28390, color: '#8E8E93' },
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
  
  // Use portfolio data if provided, otherwise use mock
  const portfolio = portfolioData?.portfolio || mockPortfolio
  const totalEquity = portfolio?.totalEquity || mockPortfolio.totalEquity
  
  const assets = ASSET_DATA[activeTab] || []

  // Calculate AUM from portfolio total equity, or sum of assets if not available
  const totalAUM = useMemo(() => {
    if (portfolio?.totalEquity) {
      return portfolio.totalEquity
    }
    return assets.reduce((sum, asset) => sum + asset.value, 0)
  }, [assets, portfolio])
  
  // Scale asset values to match total AUM if using portfolio data
  const scaledAssets = useMemo(() => {
    if (!portfolio?.totalEquity) return assets
    
    const currentSum = assets.reduce((sum, asset) => sum + asset.value, 0)
    if (currentSum === 0) return assets
    
    const scaleFactor = totalAUM / currentSum
    return assets.map(asset => ({
      ...asset,
      value: asset.value * scaleFactor,
    }))
  }, [assets, totalAUM, portfolio])

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

  // Prepare data for recharts
  const chartData = useMemo(() => {
    return scaledAssets.map((asset) => ({
      name: asset.name,
      value: asset.percentage,
      color: asset.color,
      amount: asset.value,
    }))
  }, [scaledAssets])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="chart-tooltip">
          <p className="tooltip-name">{data.name}</p>
          <p className="tooltip-value">{data.value.toFixed(2)}%</p>
        </div>
      )
    }
    return null
  }

  // Group assets by category for sub-asset-wise view
  const groupedAssets = useMemo(() => {
    if (activeTab !== 'sub-asset-wise') {
      return { all: scaledAssets }
    }
    
    const marketCap = scaledAssets.filter(a => 
      a.name.includes('Cap') || a.name === 'Large Cap' || a.name === 'Mid Cap' || a.name === 'Small Cap'
    )
    const stocks = scaledAssets.filter(a => 
      !a.name.includes('Cap') && a.name !== 'Large Cap' && a.name !== 'Mid Cap' && a.name !== 'Small Cap'
    )
    
    return {
      'Market Cap Allocation': marketCap,
      'Top Stock Holdings': stocks,
    }
  }, [scaledAssets, activeTab])

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
            onClick={() => setViewMode('current')}
          >
            Current
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'invested' ? 'active' : ''}`}
            onClick={() => setViewMode('invested')}
          >
            Invested
          </button>
        </div>
        <div className="allocation-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`allocation-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="allocation-content">
        <div className="chart-section">
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
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-center-label">
            {activeTab === 'sub-asset-wise' ? 'Stocks' : activeTab === 'asset-wise' ? 'Assets' : 'AMC'}
          </div>
        </div>

        <div className="legend-section">
          {Object.entries(groupedAssets).map(([category, items]) => (
            <div key={category} className="legend-category">
              {Object.keys(groupedAssets).length > 1 && (
                <h4 className="legend-category-title">{category}</h4>
              )}
              <div className="legend-list">
                {items.map((asset, index) => (
                  <motion.div
                    key={`${asset.name}-${index}`}
                    className="legend-item"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="legend-dot" style={{ backgroundColor: asset.color }} />
                    <span className="legend-name">{asset.name}</span>
                    <span className="legend-percentage">{asset.percentage.toFixed(2)}%</span>
                  </motion.div>
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
