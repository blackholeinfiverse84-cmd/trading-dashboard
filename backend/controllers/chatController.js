/**
 * Chat Controller
 * Handles chat/query endpoint for Uniguru chatbot
 */

// POST /api/chat/query - Send chat query to chatbot
exports.sendChatQuery = async (req, res) => {
  try {
    const { query, context = {} } = req.body

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'query is required and must be a non-empty string',
      })
    }

    // Mock chatbot response - in production, this would call the actual AI model
    const queryLower = query.toLowerCase()
    let answer = ''
    let summary = ''
    const details = []

    if (queryLower.includes('trend') || queryLower.includes('price')) {
      answer = 'Based on current market data, the asset is showing moderate bullish momentum with strong support levels.'
      summary = 'Trend check: price is holding above the 50-DMA'
      details.push(
        { label: 'Bias', value: 'Moderately Bullish' },
        { label: 'Support', value: '₹3,480' },
        { label: 'Resistance', value: '₹3,650' }
      )
    } else if (queryLower.includes('risk') || queryLower.includes('safe')) {
      answer = 'The current risk profile suggests moderate exposure with well-defined stop-loss levels.'
      summary = 'Risk assessment: balanced portfolio allocation'
      details.push(
        { label: 'Risk Level', value: 'Moderate' },
        { label: 'Stop Loss', value: '5%' },
        { label: 'Target Return', value: '10%' }
      )
    } else if (queryLower.includes('buy') || queryLower.includes('sell')) {
      answer = 'Based on technical analysis, the recommendation is to maintain current positions with careful monitoring.'
      summary = 'Action recommendation: HOLD with watch'
      details.push(
        { label: 'Action', value: 'HOLD' },
        { label: 'Confidence', value: '72%' },
        { label: 'Timeframe', value: '1 week' }
      )
    } else {
      answer = 'I can help you with market trends, risk analysis, and trading recommendations. What would you like to know?'
      summary = 'General query response'
      details.push(
        { label: 'Status', value: 'Ready to assist' },
        { label: 'Capabilities', value: 'Trends, Risk, Recommendations' }
      )
    }

    return res.status(200).json({
      success: true,
      answer,
      summary,
      details,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing chat query:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat query',
      error: error.message,
    })
  }
}

