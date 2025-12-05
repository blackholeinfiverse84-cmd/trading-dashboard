const express = require('express')
const { confirmDecision, predict, scanAll } = require('../controllers/toolsController')

const router = express.Router()

// POST /api/tools/confirm - Confirm trading decision
router.post('/confirm', confirmDecision)

// POST /api/tools/predict - Get predictions for assets
router.post('/predict', predict)

// POST /api/tools/scan_all - Scan all assets and return shortlist
router.post('/scan_all', scanAll)

module.exports = router

