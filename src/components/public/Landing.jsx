import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../common/Button'
import Card from '../common/Card'
import './Public.css'

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="landing-hero-content"
          >
            <h1 className="landing-title">
              Professional Trading Dashboard
            </h1>
            <p className="landing-subtitle">
              Real-time market insights, AI-powered predictions, and intelligent trading decisions
              all in one powerful platform.
            </p>
            <div className="landing-cta">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-container">
          <h2 className="landing-section-title">Powerful Features</h2>
          <div className="features-grid">
            <Card variant="elevated" className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Live Market Data</h3>
              <p>Real-time candlestick charts with WebSocket support for instant price updates across multiple assets.</p>
            </Card>

            <Card variant="elevated" className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Insights</h3>
              <p>Get intelligent trading recommendations with confidence scores and detailed market sentiment analysis.</p>
            </Card>

            <Card variant="elevated" className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Uniguru Chat Assistant</h3>
              <p>Ask questions about trades, risk management, or market education and get instant expert answers.</p>
            </Card>

            <Card variant="elevated" className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Multi-Asset Trading</h3>
              <p>Trade stocks, crypto, commodities, and indices all from one unified interface with advanced search.</p>
            </Card>

            <Card variant="elevated" className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Portfolio Management</h3>
              <p>Track your equity, P&L, exposure, and leverage in real-time with comprehensive portfolio overview.</p>
            </Card>

            <Card variant="elevated" className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Execution</h3>
              <p>Confirm trades instantly with detailed reasoning, confidence levels, and risk parameters.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how-it-works">
        <div className="landing-container">
          <h2 className="landing-section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your free account in seconds. No credit card required.</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Connect</h3>
              <p>Link your trading accounts or use our demo mode to explore features.</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Trade Smart</h3>
              <p>Get AI recommendations, analyze markets, and execute trades with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <Card variant="elevated" className="cta-card">
            <h2>Ready to Start Trading?</h2>
            <p>Join thousands of traders using our platform to make smarter investment decisions.</p>
            <div className="landing-cta">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Landing

