import axios from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:5000/api'

// Create axios instance for trading APIs
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create axios instance for auth APIs
const authApiClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API Service Functions

/**
 * Get live candlestick data from Node backend (Yahoo Finance proxy).
 * @param {string} symbol - Stock symbol to fetch data for (e.g., AAPL, MSFT, TCS.NS)
 * @param {number} intervalMinutes - Interval in minutes (1, 5, 15, 60, 1440)
 * @returns {Promise<{symbol: string, candles: Array}>}
 */
export const getLiveFeed = async (symbol = 'AAPL', intervalMinutes = 5) => {
  try {
    const safeSymbol = symbol || 'AAPL'
    const url = `/market/candles?symbol=${encodeURIComponent(safeSymbol)}&interval=${encodeURIComponent(
      intervalMinutes
    )}`
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching live feed from backend:', error)
    throw error
  }
}

/**
 * Confirm trading decision via Karan's endpoint
 * @param {Object} decisionData - Trading decision data
 * @returns {Promise} Confirmation response
 */
export const confirmDecision = async (decisionData) => {
  try {
    const response = await apiClient.post('/tools/confirm', decisionData)
    return response.data
  } catch (error) {
    console.error('Error confirming decision:', error)
    throw error
  }
}

/**
 * Get predictions for assets via MCP-style endpoint
 * @param {Object} params - Prediction parameters (symbol, risk params, etc.)
 * @returns {Promise} Prediction array with symbol, predicted_price, score, action, confidence, risk
 */
export const predict = async (params = {}) => {
  try {
    const response = await apiClient.post('/tools/predict', params)
    return response.data
  } catch (error) {
    console.error('Error getting predictions:', error)
    throw error
  }
}

/**
 * Scan all assets and return shortlist via MCP-style endpoint
 * @param {Object} params - Scan parameters (filters, criteria, etc.)
 * @returns {Promise} Shortlist JSON with ranked assets
 */
export const scanAll = async (params = {}) => {
  try {
    const response = await apiClient.post('/tools/scan_all', params)
    return response.data
  } catch (error) {
    console.error('Error scanning assets:', error)
    throw error
  }
}

/**
 * Send chat query to Uniguru chatbot
 * @param {string} query - User's chat query
 * @param {Object} context - Optional context data
 * @returns {Promise} Chatbot response
 */
export const sendChatQuery = async (query, context = {}) => {
  try {
    const response = await apiClient.post('/chat/query', {
      query,
      context,
    })
    return response.data
  } catch (error) {
    console.error('Error sending chat query:', error)
    throw error
  }
}

/**
 * Fetch sentiment / model insights
 */
export const getSentimentSummary = async () => {
  try {
    const response = await apiClient.get('/analytics/sentiment')
    return response.data
  } catch (error) {
    console.error('Error fetching sentiment summary:', error)
    throw error
  }
}

// Authentication API Functions
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await authApiClient.post('/auth/login', {
        username,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await authApiClient.post('/auth/register', {
        username,
        email,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Error registering:', error)
      throw error
    }
  },

  verifyToken: async () => {
    try {
      const response = await authApiClient.get('/auth/verify')
      return response.data
    } catch (error) {
      console.error('Error verifying token:', error)
      throw error
    }
  },
}

// Export the axios instance for custom requests
export default apiClient

