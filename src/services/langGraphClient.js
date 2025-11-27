const RISK_LOG_KEY = 'trading:riskLog'
const FEEDBACK_LOG_KEY = 'trading:feedbackLog'

const mockDelay = (payload, label = 'mock') =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ ok: true, channel: label, payload }), 350)
  )

const readLog = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch (err) {
    console.error('Failed to parse log', key, err)
    return []
  }
}

const writeLog = (key, entries) => {
  localStorage.setItem(key, JSON.stringify(entries.slice(0, 200)))
}

export const LangGraphClient = {
  sendRiskSnapshot: async (snapshot) => {
    const entry = { id: Date.now(), type: 'risk-snapshot', timestamp: new Date().toISOString(), snapshot }
    const log = readLog(RISK_LOG_KEY)
    log.unshift(entry)
    writeLog(RISK_LOG_KEY, log)
    return mockDelay({ event: 'risk_snapshot', entry }, 'risk')
  },

  sendFeedback: async (feedback) => {
    const entry = { id: Date.now(), type: 'feedback', timestamp: new Date().toISOString(), feedback }
    const log = readLog(FEEDBACK_LOG_KEY)
    log.unshift(entry)
    writeLog(FEEDBACK_LOG_KEY, log)
    return mockDelay({ event: 'feedback', entry }, 'feedback')
  },

  syncAll: async ({ endpoint = '/langgraph/mock-ingest', onPayload } = {}) => {
    const payload = {
      risk: readLog(RISK_LOG_KEY),
      feedback: readLog(FEEDBACK_LOG_KEY),
    }
    if (typeof onPayload === 'function') {
      onPayload(payload)
    }
    // In a real build we would POST to endpoint; for now return mock promise.
    return mockDelay({ event: 'sync_all', endpoint, payload }, 'sync')
  },

  replayLog: (key, limit = 20) => readLog(key).slice(0, limit),

  getAnalytics: () => {
    const feedback = readLog(FEEDBACK_LOG_KEY)
    if (!feedback.length) return null
    const scores = feedback.map((entry) => entry.feedback?.score || 0)
    const avgScore =
      scores.reduce((acc, value) => acc + value, 0) / scores.length
    const horizonCounts = feedback.reduce((acc, item) => {
      const h = item.feedback?.riskSnapshot?.horizon || 'unknown'
      acc[h] = (acc[h] || 0) + 1
      return acc
    }, {})
    const latestComments = feedback
      .filter((entry) => entry.feedback?.notes)
      .slice(0, 3)
      .map((entry) => ({
        id: entry.id,
        symbol: entry.feedback?.symbol || entry.feedback?.riskSnapshot?.symbol,
        action: entry.feedback?.action || entry.feedback?.riskSnapshot?.action,
        notes: entry.feedback?.notes,
        score: entry.feedback?.score,
        timestamp: entry.timestamp,
      }))

    return {
      avgScore: Number(avgScore.toFixed(1)),
      horizonCounts,
      scores,
      latestComments,
    }
  },
}

