import React, { useState, useMemo, memo, useCallback } from 'react'
import Card from './common/Card'
import Input from './common/Input'
import './MultiAssetBoard.css'

const assetTabs = [
  { label: 'Stocks', value: 'stocks' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Commodities', value: 'commodities' },
]

const mockRows = {
  stocks: [
    { symbol: 'AAPL', asset: 'Apple', price: 175.42, change: 1.32, action: 'BUY', weight: '35%' },
    { symbol: 'RELIANCE', asset: 'Reliance Industries', price: 2615.8, change: -0.45, action: 'HOLD', weight: '22%' },
    { symbol: 'HDFCBANK', asset: 'HDFC Bank', price: 1575.0, change: 0.95, action: 'BUY', weight: '18%' },
    { symbol: 'TCS', asset: 'Tata Consultancy Services', price: 3420.5, change: 0.78, action: 'BUY', weight: '15%' },
    { symbol: 'INFY', asset: 'Infosys Limited', price: 1520.3, change: -0.32, action: 'HOLD', weight: '10%' },
  ],
  crypto: [
    { symbol: 'BTCUSD', asset: 'Bitcoin', price: 43250, change: 2.12, action: 'ACCUMULATE', weight: '—' },
    { symbol: 'ETHUSD', asset: 'Ethereum', price: 2325, change: -1.05, action: 'WATCH', weight: '—' },
    { symbol: 'BNBUSD', asset: 'Binance Coin', price: 315.8, change: 0.45, action: 'HOLD', weight: '—' },
  ],
  commodities: [
    { symbol: 'GOLD', asset: 'Gold Spot', price: 2045, change: 0.32, action: 'HOLD', weight: '—' },
    { symbol: 'CRUDE', asset: 'WTI Crude Oil', price: 79.5, change: -0.85, action: 'SELL', weight: '—' },
    { symbol: 'SILVER', asset: 'Silver Spot', price: 24.8, change: 0.15, action: 'HOLD', weight: '—' },
  ],
}

const MultiAssetBoard = memo(({ risk }) => {
  const [activeTab, setActiveTab] = useState('stocks')
  const [searchQuery, setSearchQuery] = useState('')
  
  const allRows = useMemo(() => mockRows[activeTab] || [], [activeTab])

  const rows = useMemo(() => {
    const adjusted = applyRiskToRows(allRows, risk)
    if (!searchQuery.trim()) return adjusted
    
    const query = searchQuery.toLowerCase().trim()
    return adjusted.filter(
      (row) =>
        row.symbol.toLowerCase().includes(query) ||
        row.asset.toLowerCase().includes(query)
    )
  }, [allRows, searchQuery, risk])

  const handleTabChange = useCallback((tabValue) => {
    setActiveTab(tabValue)
    setSearchQuery('') // Clear search when switching tabs
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <Card
      title="Multi-asset overview"
      subtitle="Unified execution schema across equities, crypto, commodities"
      className="multi-asset-card"
      padding="md"
    >
      <div className="multi-asset-header">
        <div className="asset-tabs">
          {assetTabs.map((tab) => (
            <button
              key={tab.value}
              className={`asset-tab ${activeTab === tab.value ? 'asset-tab-active' : ''}`}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="multi-asset-search">
          <Input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={handleSearchChange}
            icon="🔍"
            fullWidth
          />
        </div>
      </div>

      <div className="asset-table-wrapper">
        {rows.length === 0 ? (
          <p className="asset-table-empty">Coming soon.</p>
        ) : (
          <table className="asset-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Asset</th>
                <th>Price</th>
                <th>Δ%</th>
                <th>Recommended Action</th>
                <th>Portfolio Weight</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.symbol} className="asset-table-row">
                  <td>{row.symbol}</td>
                  <td>{row.asset}</td>
                  <td>{formatNumber(row.price)}</td>
                  <td className={`change ${row.change >= 0 ? 'pos' : 'neg'}`}>
                    {row.change >= 0 ? '+' : ''}
                    {row.change}%
                  </td>
                  <td>
                    <span className={`action-pill action-${row.action.toLowerCase()}`}>
                      {row.action}
                    </span>
                  </td>
                  <td>{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  )
})

MultiAssetBoard.displayName = 'MultiAssetBoard'

const formatNumber = (value) => {
  if (typeof value !== 'number') return value
  return value >= 1000 ? value.toLocaleString() : value.toFixed(2)
}

const applyRiskToRows = (rows, risk = {}) => {
  if (!risk) return rows
  const { targetReturn = 10, stopLoss = 5, horizon = 'week' } = risk
  const bias = targetReturn - stopLoss
  const horizonMultiplier = horizon === 'day' ? 0.5 : horizon === 'month' ? 1.2 : horizon === 'year' ? 1.6 : 1

  return rows.map((row) => {
    const change = Number((row.change + bias * 0.1 * horizonMultiplier).toFixed(2))
    const action = updateAction(row.action, bias)
    const weight = row.weight === '—' ? row.weight : `${Math.min(95, Math.max(5, parseInt(row.weight) + bias * 0.5))}%`

    return {
      ...row,
      change,
      weight,
      action,
    }
  })
}

const updateAction = (current, bias) => {
  if (bias > 5) return 'ACCUMULATE'
  if (bias > 2) return current === 'SELL' ? 'HOLD' : 'BUY'
  if (bias < -3) return current === 'BUY' ? 'TRIM' : 'SELL'
  return current
}

export default MultiAssetBoard

