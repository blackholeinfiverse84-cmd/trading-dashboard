import React, { memo } from 'react'
import Card from './common/Card'
import './PortfolioOverview.css'

const formatNumber = (value = 0) => {
  if (value >= 100000) {
    return (value / 100000).toFixed(1) + 'L'
  }
  return value.toLocaleString()
}

const mockPortfolio = {
  totalEquity: 2450000,
  dailyPnL: 18500,
  exposure: 0.68,
  cashBuffer: 0.22,
  leverage: 0.35,
  winners: 12,
  losers: 5,
}

const PortfolioOverview = memo(({ data = mockPortfolio }) => {
  const {
    totalEquity,
    dailyPnL,
    exposure,
    cashBuffer,
    leverage,
    winners,
    losers,
  } = data

  const pnlPositive = dailyPnL >= 0

  return (
    <Card
      title="Portfolio overview"
      subtitle="Equity snapshot & risk posture"
      className="portfolio-card"
      padding="md"
    >
      <div className="portfolio-grid">
        <div className="portfolio-block">
          <p className="portfolio-label">Total Equity</p>
          <p className="portfolio-value">₹{formatNumber(totalEquity)}</p>
          <p className={`portfolio-pnl ${pnlPositive ? 'pos' : 'neg'}`}>
            {pnlPositive ? '+' : '-'}₹{formatNumber(Math.abs(dailyPnL))} today
          </p>
        </div>
        <div className="portfolio-block">
          <p className="portfolio-label">Exposure</p>
          <div className="portfolio-progress">
            <div
              className="portfolio-progress-fill"
              style={{ width: `${exposure * 100}%` }}
            />
          </div>
          <p className="portfolio-note">{(exposure * 100).toFixed(0)}% deployed</p>
        </div>
        <div className="portfolio-block">
          <p className="portfolio-label">Cash Buffer</p>
          <div className="portfolio-progress alt">
            <div
              className="portfolio-progress-fill"
              style={{ width: `${cashBuffer * 100}%` }}
            />
          </div>
          <p className="portfolio-note">{(cashBuffer * 100).toFixed(0)}% liquidity</p>
        </div>
        <div className="portfolio-block">
          <p className="portfolio-label">Leverage</p>
          <p className="portfolio-value">{leverage.toFixed(2)}×</p>
          <p className="portfolio-note">Gross vs net exposure</p>
        </div>
        <div className="portfolio-block">
          <p className="portfolio-label">Trade Stats (today)</p>
          <p className="portfolio-value">
            {winners}/{winners + losers}
          </p>
          <p className="portfolio-note">Winners / total</p>
        </div>
      </div>
    </Card>
  )
})

PortfolioOverview.displayName = 'PortfolioOverview'

export default PortfolioOverview

