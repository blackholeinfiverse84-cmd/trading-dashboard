import React, { useState, useEffect, useMemo } from 'react'
import Card from './common/Card'
import { predict, scanAll } from '../services/api'
import ConfidenceGauge from './common/ConfidenceGauge'
import './Scorecards.css'

const Scorecards = ({ risk }) => {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('score') // score, confidence, predicted_price
  const [sortOrder, setSortOrder] = useState('desc') // asc, desc

  useEffect(() => {
    fetchPredictions()
    // Refresh every 30 seconds
    const interval = setInterval(fetchPredictions, 30000)
    return () => clearInterval(interval)
  }, [risk])

  const fetchPredictions = async () => {
    setLoading(true)
    setError(null)

    try {
      // Try to get predictions from scan_all first, then predict
      const scanParams = {
        filters: {
          minScore: 50,
          maxRisk: risk?.stopLoss || 10,
        },
        limit: 20,
      }

      let data
      try {
        const scanResult = await scanAll(scanParams)
        data = scanResult.predictions || scanResult.shortlist || []
      } catch (scanError) {
        // Fallback to predict endpoint
        const predictParams = {
          symbols: ['AAPL', 'RELIANCE', 'HDFCBANK', 'TCS', 'INFY', 'BTCUSD', 'ETHUSD', 'GOLD'],
          riskParams: risk || {},
        }
        const predictResult = await predict(predictParams)
        data = Array.isArray(predictResult) ? predictResult : predictResult.predictions || []
      }

      if (data && data.length > 0) {
        setPredictions(normalizePredictions(data))
      } else {
        // Use mock data if API returns empty
        setPredictions(getMockPredictions())
        setError('Using mock predictions data')
      }
    } catch (err) {
      console.error('Failed to fetch predictions:', err)
      setPredictions(getMockPredictions())
      setError('Unable to reach prediction service. Showing mock data.')
    } finally {
      setLoading(false)
    }
  }

  const sortedPredictions = useMemo(() => {
    const sorted = [...predictions]

    sorted.sort((a, b) => {
      let aVal, bVal

      switch (sortBy) {
        case 'score':
          aVal = a.score || 0
          bVal = b.score || 0
          break
        case 'confidence':
          aVal = a.confidence || 0
          bVal = b.confidence || 0
          break
        case 'predicted_price':
          aVal = a.predicted_price || 0
          bVal = b.predicted_price || 0
          break
        case 'symbol':
          aVal = a.symbol || ''
          bVal = b.symbol || ''
          break
        default:
          return 0
      }

      if (sortBy === 'symbol') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    return sorted
  }, [predictions, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getActionColor = (action) => {
    const actionLower = action?.toLowerCase() || ''
    if (actionLower.includes('buy') || actionLower.includes('accumulate')) return 'success'
    if (actionLower.includes('sell') || actionLower.includes('trim')) return 'error'
    return 'neutral'
  }

  return (
    <Card
      title="Scorecards & Rankings"
      subtitle="Top predictions ranked by score and confidence"
      className="scorecards-card"
      padding="md"
    >
      {error && (
        <div className="scorecards-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="scorecards-controls">
        <div className="scorecards-sort">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="score">Score</option>
            <option value="confidence">Confidence</option>
            <option value="predicted_price">Predicted Price</option>
            <option value="symbol">Symbol</option>
          </select>
          <button
            type="button"
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <button
          type="button"
          className="refresh-btn"
          onClick={fetchPredictions}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {loading && predictions.length === 0 ? (
        <div className="scorecards-loading">
          <p>Loading predictions...</p>
        </div>
      ) : sortedPredictions.length === 0 ? (
        <div className="scorecards-empty">
          <p>No predictions available</p>
          <p className="text-muted">Try adjusting your risk parameters</p>
        </div>
      ) : (
        <div className="scorecards-table-wrapper">
          <table className="scorecards-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th onClick={() => handleSort('symbol')} className="sortable">
                  Symbol {sortBy === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('predicted_price')} className="sortable">
                  Predicted Price {sortBy === 'predicted_price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('score')} className="sortable">
                  Score {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Action</th>
                <th onClick={() => handleSort('confidence')} className="sortable">
                  Confidence {sortBy === 'confidence' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Risk Applied</th>
              </tr>
            </thead>
            <tbody>
              {sortedPredictions.map((pred, index) => (
                <tr key={pred.symbol || index} className="scorecards-row">
                  <td className="rank-cell">
                    <span className="rank-badge">{index + 1}</span>
                  </td>
                  <td className="symbol-cell">
                    <strong>{pred.symbol || 'N/A'}</strong>
                    {pred.assetType && (
                      <span className="asset-type-badge">{pred.assetType}</span>
                    )}
                  </td>
                  <td className="price-cell">
                    {pred.predicted_price
                      ? `₹${pred.predicted_price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '—'}
                  </td>
                  <td className="score-cell">
                    <div className="score-display">
                      <span className="score-value">{pred.score || 0}</span>
                      <div className="score-bar">
                        <div
                          className="score-bar-fill"
                          style={{ width: `${Math.min(100, pred.score || 0)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="action-cell">
                    <span className={`action-pill action-${getActionColor(pred.action)}`}>
                      {pred.action || 'HOLD'}
                    </span>
                  </td>
                  <td className="confidence-cell">
                    <ConfidenceGauge value={pred.confidence || 0} label="" size={50} />
                    <span className="confidence-value">{pred.confidence || 0}%</span>
                  </td>
                  <td className="risk-cell">
                    {pred.risk_applied ? (
                      <span className="risk-badge">
                        SL: {pred.risk_applied.stopLoss || '—'}% | TR: {pred.risk_applied.targetReturn || '—'}%
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

const normalizePredictions = (data) => {
  if (!Array.isArray(data)) return []

  return data.map((item) => ({
    symbol: item.symbol || item.Symbol || 'N/A',
    assetType: item.assetType || item.asset_type || item.type || 'Stock',
    predicted_price: Number(item.predicted_price || item.predictedPrice || item.price || 0),
    score: Number(item.score || item.Score || 0),
    action: item.action || item.Action || 'HOLD',
    confidence: Number(item.confidence || item.Confidence || 0),
    risk_applied: item.risk_applied || item.riskApplied || item.risk || null,
  }))
}

const getMockPredictions = () => [
  {
    symbol: 'AAPL',
    assetType: 'Stock',
    predicted_price: 175.42,
    score: 92,
    action: 'BUY',
    confidence: 88,
    risk_applied: { stopLoss: 5, targetReturn: 10 },
  },
  {
    symbol: 'RELIANCE',
    assetType: 'Stock',
    predicted_price: 2615.8,
    score: 87,
    action: 'BUY',
    confidence: 82,
    risk_applied: { stopLoss: 5, targetReturn: 10 },
  },
  {
    symbol: 'HDFCBANK',
    assetType: 'Stock',
    predicted_price: 1575.0,
    score: 85,
    action: 'BUY',
    confidence: 79,
    risk_applied: { stopLoss: 5, targetReturn: 10 },
  },
  {
    symbol: 'TCS',
    assetType: 'Stock',
    predicted_price: 3420.5,
    score: 83,
    action: 'HOLD',
    confidence: 75,
    risk_applied: { stopLoss: 5, targetReturn: 10 },
  },
  {
    symbol: 'BTCUSD',
    assetType: 'Crypto',
    predicted_price: 43250,
    score: 80,
    action: 'ACCUMULATE',
    confidence: 72,
    risk_applied: { stopLoss: 5, targetReturn: 10 },
  },
  {
    symbol: 'ETHUSD',
    assetType: 'Crypto',
    predicted_price: 2325,
    score: 78,
    action: 'WATCH',
    confidence: 70,
    risk_applied: { stopLoss: 5, targetReturn: 10 },
  },
  {
    symbol: 'GOLD',
    assetType: 'Commodity',
    predicted_price: 2045,
    score: 75,
    action: 'HOLD',
    confidence: 68,
    risk_applied: { stopLoss: 5, targetReturn: 10 },
  },
  {
    symbol: 'INFY',
    assetType: 'Stock',
    predicted_price: 1520.3,
    score: 72,
    action: 'HOLD',
    confidence: 65,
    risk_applied: { stopLoss: 5, targetReturn: 10 },
  },
]

export default Scorecards


