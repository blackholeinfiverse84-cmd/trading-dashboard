const express = require('express')
const { sendChatQuery } = require('../controllers/chatController')

const router = express.Router()

// POST /api/chat/query - Send chat query to chatbot
router.post('/query', sendChatQuery)

module.exports = router

