const RISK_LOG_KEY = 'trading:riskLog'
const FEEDBACK_LOG_KEY = 'trading:feedbackLog'

const mockDelay = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve({ ok: true, payload }), 300))

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
    return mockDelay({ event: 'risk_snapshot', entry })
  },

  sendFeedback: async (feedback) => {
    const entry = { id: Date.now(), type: 'feedback', timestamp: new Date().toISOString(), feedback }
    const log = readLog(FEEDBACK_LOG_KEY)
    log.unshift(entry)
    writeLog(FEEDBACK_LOG_KEY, log)
    return mockDelay({ event: 'feedback', entry })
  },

  replayLog: (key, limit = 20) => readLog(key).slice(0, limit),

  getAnalytics: () => {
    const feedback = readLog(FEEDBACK_LOG_KEY)
    if (!feedback.length) return null
    const avgScore =
      feedback.reduce((acc, item) => acc + (item.feedback?.score || 0), 0) / feedback.length
    const horizonCounts = feedback.reduce((acc, item) => {
      const h = item.feedback?.riskSnapshot?.horizon || 'unknown'
      acc[h] = (acc[h] || 0) + 1
      return acc
    }, {})
    return { avgScore: Number(avgScore.toFixed(1)), horizonCounts }
  },
}

