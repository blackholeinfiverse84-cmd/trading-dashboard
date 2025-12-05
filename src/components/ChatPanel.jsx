import React, { useState, useRef, useEffect } from 'react'
import Card from './common/Card'
import Button from './common/Button'
import { sendChatQuery } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import './ChatPanel.css'

const QUICK_ACTIONS = [
  'What’s the trend on TCS?',
  'Compare Reliance vs HDFC.',
  'Should I buy NIFTY right now?',
  'Summarise today’s market drivers.',
  'Teach me about stop-loss strategies.',
]

const ChatPanel = ({ hideTitle = false }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        "Hello! I'm Uniguru, your AI trading assistant. I can help you analyze trends, compare assets, assess risks, and explain market concepts. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      role: 'assistant',
      rich: {
        summary: 'You can try asking things like:',
        details: [
          { label: 'Trend', value: '“What’s the trend on TCS?”' },
          { label: 'Comparisons', value: '“Compare Reliance vs HDFC.”' },
          { label: 'Risk', value: '“What’s the risk on this portfolio?”' },
        ],
      },
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const { addToast } = useToast()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!inputValue.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setLoading(true)
    setError(null)

    try {
      const response = await sendChatQuery(userMessage.content, {
        conversation: messages,
      })

      setMessages((prev) => [...prev, buildAssistantMessage(response)])
      addToast({
        title: 'Answer ready',
        message: 'Uniguru responded to your prompt.',
        variant: 'success',
      })
    } catch (err) {
      console.error('Chat error:', err)
      setError('Unable to reach Uniguru, showing mock response.')
      setMessages((prev) => [...prev, buildAssistantMessage(null, userMessage.content)])
      addToast({
        title: 'Chat fallback',
        message: 'Using a mock assistant reply until the service recovers.',
        variant: 'warning',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (prompt) => {
    setInputValue(prompt)
    setTimeout(() => handleSubmit(), 0)
  }

  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift, submit the form
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    // If Shift+Enter, allow default behavior (new line)
  }

  return (
    <Card
      title={hideTitle ? undefined : "Uniguru AI Assistant"}
      subtitle={hideTitle ? undefined : "Your intelligent trading companion"}
      className="chat-panel-card"
      padding="none"
    >
      <div className="chat-panel">
        <div className="quick-actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              className="quick-action-chip"
              onClick={() => handleQuickAction(action)}
              disabled={loading}
            >
              {action}
            </button>
          ))}
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message chat-message-${message.role}`}
            >
              <div className="chat-message-meta">
                <span className="chat-role">
                  {message.role === 'assistant' ? '🤖 Uniguru AI' : 'You'}
                </span>
                <span className="chat-time">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {message.mock && (
                  <span className="chat-badge">Mock response</span>
                )}
              </div>
              <MessageContent message={message} />
            </div>
          ))}
          {loading && (
            <div className="chat-message chat-message-assistant chat-typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className="chat-message-content text-muted">Generating answer...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="chat-error">⚠️ {error}</div>}

        <form className="chat-input-row" onSubmit={handleSubmit}>
          <textarea
            className="chat-input"
            placeholder="Ask about trades, risk, or market education... (Press Enter to send, Shift+Enter for new line)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          ></textarea>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !inputValue.trim()}
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </Card>
  )
}

const MessageContent = ({ message }) => {
  if (message.role === 'assistant' && message.rich) {
    return (
      <div className="chat-rich">
        <p className="chat-rich-summary">{message.rich.summary}</p>
        <ul className="chat-rich-details">
          {message.rich.details.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return <p className="chat-message-content">{message.content}</p>
}

const buildAssistantMessage = (payload, question = '') => {
  const timestamp = new Date().toISOString()
  const richPayload = buildRichPayload(payload, question)

  if (richPayload) {
    return {
      id: Date.now() + 1,
      role: 'assistant',
      rich: richPayload,
      timestamp,
      mock: !payload,
    }
  }

  return {
    id: Date.now() + 1,
    role: 'assistant',
    content:
      payload?.answer ||
      payload?.message ||
      'Here is my perspective on that query.',
    timestamp,
    mock: !payload,
  }
}

const buildRichPayload = (payload, question) => {
  if (payload?.summary || payload?.details) {
    return {
      summary:
        payload.summary || 'Latest signal from Karan’s analysis engine.',
      details:
        payload.details?.length > 0
          ? payload.details
          : payload.blocks?.map((block) => ({
              label: block.title || 'Metric',
              value: block.value || block.text,
            })) || [],
    }
  }

  return buildFallbackInsight(question)
}

const buildFallbackInsight = (question = '') => {
  const topic = deriveTopic(question)

  switch (topic) {
    case 'trend':
      return {
        summary: 'Trend check: price is holding above the 50-DMA with steady volume expansion.',
        details: [
          { label: 'Bias', value: 'Moderately Bullish' },
          { label: 'Support', value: '₹3,480' },
          { label: 'Trigger', value: 'Close above ₹3,560' },
        ],
      }
    case 'compare':
      return {
        summary: 'Relative strength comparison between the requested names:',
        details: [
          { label: 'Momentum', value: 'Reliance +1.2% WoW, HDFC +0.3% WoW' },
          { label: 'Valuation', value: 'Reliance 21x FY26, HDFC 2.3x BV' },
          { label: 'Desk View', value: 'Prefer Reliance on earnings visibility' },
        ],
      }
    case 'risk':
      return {
        summary: 'Risk posture update for the portfolio:',
        details: [
          { label: 'Portfolio VaR', value: '1.9%' },
          { label: 'Leverage', value: '0.6× gross, 0.2× net' },
          { label: 'Action', value: 'Keep stop-loss discipline at 2% per trade' },
        ],
      }
    case 'action':
      return {
        summary: 'Execution preview based on current signals:',
        details: [
          { label: 'Suggested Action', value: 'Trim 10% exposure into strength' },
          { label: 'Confidence', value: '72%' },
          { label: 'Reason', value: 'Momentum cooling while breadth narrows' },
        ],
      }
    case 'education':
      return {
        summary: 'Stop-loss reminder: treat it as a capital-preservation rule.',
        details: [
          { label: 'Sizing', value: 'Risk ≤ 1.5% of capital per trade' },
          { label: 'Placement', value: 'Below structure support / ATR(14)' },
          { label: 'Review', value: 'Recalculate after every major move' },
        ],
      }
    default:
      return {
        summary: 'Here’s the latest color from Karan’s desk:',
        details: [
          { label: 'Market Drivers', value: 'Global cues + domestic flows' },
          { label: 'Preferred Theme', value: 'Large-cap banks + IT leaders' },
          { label: 'Risk Note', value: 'Watch USDINR and crude spikes' },
        ],
      }
  }
}

const deriveTopic = (question = '') => {
  const text = question.toLowerCase()
  if (text.includes('trend') || text.includes('tcs')) return 'trend'
  if (text.includes('compare') || text.includes(' vs ')) return 'compare'
  if (text.includes('risk')) return 'risk'
  if (text.includes('buy') || text.includes('sell') || text.includes('should i')) return 'action'
  if (text.includes('stop-loss') || text.includes('stoploss')) return 'education'
  return 'default'
}

export default ChatPanel

