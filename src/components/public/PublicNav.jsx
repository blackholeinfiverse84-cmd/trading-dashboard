import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../common/Button'
import './Public.css'

const PublicNav = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="public-nav">
      <div className="public-nav-container">
        <Link to="/" className="public-nav-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">Trading Dashboard</span>
        </Link>

        <div className="public-nav-links">
          <Link 
            to="/" 
            className={`public-nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`public-nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`public-nav-link ${isActive('/contact') ? 'active' : ''}`}
          >
            Contact
          </Link>
        </div>

        <div className="public-nav-actions">
          <Link to="/langgraph">
            <Button variant="secondary" size="sm">
              LangGraph Report
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary" size="sm">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default PublicNav

