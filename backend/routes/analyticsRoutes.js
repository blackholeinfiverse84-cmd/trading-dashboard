const express = require('express')
const { getSentiment } = require('../controllers/analyticsController')

const router = express.Router()

// GET /api/analytics/sentiment - Get market sentiment and insights
router.get('/sentiment', getSentiment)

module.exports = router

