import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import './Auth.css'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!username || !password) {
      setError('Username and password are required')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await register(username, email || undefined, password)
    setLoading(false)

    if (result.success) {
      addToast({
        title: 'Account ready',
        message: 'Welcome aboard! You are now logged in.',
        variant: 'success',
      })
      navigate('/dashboard')
    } else {
      const message = result.message || 'Registration failed. Please try again.'
      setError(message)
      addToast({
        title: 'Registration failed',
        message,
        variant: 'error',
      })
    }
  }

  const highlights = [
    { icon: '🎯', text: 'Guided onboarding with curated playbooks' },
    { icon: '🤝', text: 'Secure collaboration with desk teammates' },
    { icon: '🧠', text: 'LangGraph intelligence on tap' }
  ]

  const metrics = [
    { label: 'Teams onboarded', value: '35+' },
    { label: 'Avg. setup', value: '<4 min' }
  ]

  return (
    <div className="auth-container">
      <div className="auth-grid">
        <div className="auth-highlight-card">
          <span className="auth-highlight-eyebrow">READY TO BUILD</span>
          <h2 className="auth-highlight-title">
            Join a faster, smarter trading workspace
          </h2>
          <p className="auth-highlight-copy">
            Spin up your personal cockpit with streaming sentiment, execution cues, and shared context that keeps the desk aligned.
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
          title="Create Account" 
          subtitle="Join the trading dashboard"
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
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label="Email (Optional)"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <div className="auth-footer">
            <p className="text-muted">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </form>
        </Card>
      </div>
    </div>
  )
}

export default Register

