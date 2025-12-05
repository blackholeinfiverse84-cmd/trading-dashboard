const express = require('express')
const { getCandles } = require('../controllers/marketController')

const router = express.Router()

// GET /api/market/candles?symbol=AAPL&interval=5
router.get('/candles', getCandles)

module.exports = router


