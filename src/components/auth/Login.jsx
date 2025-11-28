import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import './Auth.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!username || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const result = await login(username, password)
    setLoading(false)

    if (result.success) {
      addToast({
        title: 'Signed in',
        message: `Welcome back, ${username || 'trader'}!`,
        variant: 'success'
      })
      navigate('/dashboard')
    } else {
      const message = result.message || 'Login failed. Please try again.'
      setError(message)
      addToast({
        title: 'Login failed',
        message,
        variant: 'error'
      })
    }
  }

  const highlights = [
    { icon: '⚡', text: 'Instant AI-assisted risk insights' },
    { icon: '🛡️', text: 'Personalized guardrails for every trade' },
    { icon: '📈', text: 'Portfolio-level market awareness' }
  ]

  const metrics = [
    { label: 'Signals/day', value: '120+' },
    { label: 'Latency', value: '<200ms' }
  ]

  return (
    <div className="auth-container">
      <div className="auth-grid">
        <div className="auth-highlight-card">
          <span className="auth-highlight-eyebrow">TRADING CO-PILOT</span>
          <h2 className="auth-highlight-title">
            Reconnect to your<br />real-time alpha stream
          </h2>
          <p className="auth-highlight-copy">
            Centralize your market context, alerts, and LangGraph-guided execution all from one control surface.
          </p>
          <ul className="auth-highlight-list">
            {highlights.map((item) => (
              <li key={item.text} className="auth-highlight-item">
                <span className="auth-highlight-icon">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className="auth-metrics">
            {metrics.map((metric) => (
              <div key={metric.label} className="auth-metric-card">
                <p className="auth-metric-label">{metric.label}</p>
                <p className="auth-metric-value">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <Card 
          title="Welcome Back" 
          subtitle="Sign in to your trading dashboard"
          variant="elevated"
          className="auth-card auth-form-card"
        >
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="auth-footer">
            <p className="text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </form>
        </Card>
      </div>
    </div>
  )
}

export default Login

