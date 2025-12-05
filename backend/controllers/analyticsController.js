/**
 * Analytics Controller
 * Handles analytics and sentiment endpoints
 */

// GET /api/analytics/sentiment - Get market sentiment and insights
exports.getSentiment = async (req, res) => {
  try {
    // Mock sentiment data - in production, this would calculate from real market data
    const sentimentScore = 60 + Math.random() * 20 // 60-80 range
    const sentimentLabels = ['Bearish', 'Neutral', 'Moderately Bullish', 'Bullish', 'Very Bullish']
    const sentimentIndex = Math.min(
      Math.floor(sentimentScore / 20),
      sentimentLabels.length - 1
    )

    const response = {
      success: true,
      sentimentScore: Number(sentimentScore.toFixed(1)),
      sentimentLabel: sentimentLabels[sentimentIndex],
      marketIndicators: {
        volatility: Number((20 + Math.random() * 15).toFixed(1)),
        volume: Number((1000000 + Math.random() * 500000).toFixed(0)),
        momentum: Number((0.5 + Math.random() * 0.5).toFixed(2)),
      },
      recommendations: [
        {
          symbol: 'AAPL',
          action: 'BUY',
          confidence: 85,
          reason: 'Strong technical breakout',
        },
        {
          symbol: 'TCS',
          action: 'HOLD',
          confidence: 72,
          reason: 'Stable trend continuation',
        },
        {
          symbol: 'RELIANCE',
          action: 'SELL',
          confidence: 68,
          reason: 'Resistance level reached',
        },
      ],
      latestTrades: [
        {
          symbol: 'AAPL',
          action: 'BUY',
          price: 175.42,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          symbol: 'MSFT',
          action: 'SELL',
          price: 380.15,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
      timestamp: new Date().toISOString(),
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error('Error fetching sentiment:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sentiment',
      error: error.message,
    })
  }
}

