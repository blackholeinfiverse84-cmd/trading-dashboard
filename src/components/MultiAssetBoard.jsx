import React, { useState } from 'react'
import Card from './common/Card'
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
  ],
  crypto: [
    { symbol: 'BTCUSD', asset: 'Bitcoin', price: 43250, change: 2.12, action: 'ACCUMULATE', weight: '—' },
    { symbol: 'ETHUSD', asset: 'Ethereum', price: 2325, change: -1.05, action: 'WATCH', weight: '—' },
  ],
  commodities: [
    { symbol: 'GOLD', asset: 'Gold Spot', price: 2045, change: 0.32, action: 'HOLD', weight: '—' },
    { symbol: 'CRUDE', asset: 'WTI Crude', price: 79.5, change: -0.85, action: 'SELL', weight: '—' },
  ],
}

const MultiAssetBoard = () => {
  const [activeTab, setActiveTab] = useState('stocks')
  const rows = mockRows[activeTab] || []

  return (
    <Card
      title="Multi-asset overview"
      subtitle="Unified execution schema across equities, crypto, commodities"
      className="multi-asset-card"
      padding="md"
    >
      <div className="asset-tabs">
        {assetTabs.map((tab) => (
          <button
            key={tab.value}
            className={`asset-tab ${activeTab === tab.value ? 'asset-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
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
                <tr key={row.symbol}>
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
}

const formatNumber = (value) => {
  if (typeof value !== 'number') return value
  return value >= 1000 ? value.toLocaleString() : value.toFixed(2)
}

export default MultiAssetBoard

