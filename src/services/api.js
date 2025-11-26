import axios from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here if needed
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
 * Get live predictions feed from Krishna's endpoint
 * @returns {Promise} Live predictions data
 */
export const getLiveFeed = async () => {
  try {
    const response = await apiClient.get('/feed/live')
    return response.data
  } catch (error) {
    console.error('Error fetching live feed:', error)
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

// Export the axios instance for custom requests
export default apiClient

