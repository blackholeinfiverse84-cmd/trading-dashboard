import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../common/Card'
import Button from '../common/Button'
import './Public.css'

const About = () => {
  return (
    <div className="public-page">
      <div className="public-container">
        <Card variant="elevated" className="public-card">
          <h1>About Trading Dashboard</h1>
          
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              We're building the most intuitive and powerful trading platform that combines 
              real-time market data, AI-powered insights, and professional-grade tools to help 
              traders make informed decisions.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Offer</h2>
            <div className="about-features">
              <div className="about-feature-item">
                <h3>Real-Time Market Data</h3>
                <p>
                  Access live candlestick charts, price movements, and market updates across 
                  stocks, cryptocurrencies, and commodities. Our WebSocket integration ensures 
                  you never miss a market movement.
                </p>
              </div>

              <div className="about-feature-item">
                <h3>AI-Powered Analysis</h3>
                <p>
                  Leverage advanced machine learning models to get trading recommendations, 
                  sentiment analysis, and confidence scores. Our AI assistant, Uniguru, helps 
                  you understand market dynamics and make better decisions.
                </p>
              </div>

              <div className="about-feature-item">
                <h3>Comprehensive Portfolio Management</h3>
                <p>
                  Track your entire portfolio in one place. Monitor equity, daily P&L, exposure 
                  levels, cash buffers, and leverage ratios with real-time updates.
                </p>
              </div>

              <div className="about-feature-item">
                <h3>Multi-Asset Support</h3>
                <p>
                  Trade and analyze stocks, indices, cryptocurrencies, and commodities from 
                  a unified interface. Our advanced search helps you find and track any asset quickly.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Technology Stack</h2>
            <p>
              Built with modern technologies for performance and reliability:
            </p>
            <ul className="tech-list">
              <li><strong>Frontend:</strong> React 19, Vite, Framer Motion</li>
              <li><strong>Charts:</strong> Lightweight Charts for high-performance candlestick visualization</li>
              <li><strong>Backend:</strong> Express.js, MongoDB, JWT Authentication</li>
              <li><strong>Real-time:</strong> WebSocket support for live data streaming</li>
              <li><strong>AI Integration:</strong> Ready for Krishna's predictions and Karan's execution logic</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Our Team</h2>
            <p>
              Developed by a team passionate about finance and technology. We combine expertise 
              in trading, software development, and AI to create tools that traders actually want to use.
            </p>
          </section>

          <section className="about-section">
            <h2>Get Started</h2>
            <p>
              Ready to experience professional-grade trading tools? Create your free account today 
              and start making smarter trading decisions.
            </p>
            <div className="about-cta">
              <Link to="/register">
                <Button variant="primary">Sign Up Free</Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary">Contact Us</Button>
              </Link>
            </div>
          </section>
        </Card>
      </div>
    </div>
  )
}

export default About

