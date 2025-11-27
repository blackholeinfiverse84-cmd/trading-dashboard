import React from 'react'
import { Link } from 'react-router-dom'
import './Public.css'

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="public-footer-container">
        <div className="footer-section">
          <h4>Trading Dashboard</h4>
          <p>Professional trading platform with AI-powered insights and real-time market data.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Trading Dashboard. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default PublicFooter

