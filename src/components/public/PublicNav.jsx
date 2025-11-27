import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../common/Button'
import './Public.css'

const PublicNav = () => {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

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
          {isAuthenticated ? (
            <>
              <span className="public-nav-user">Welcome, {user?.username}</span>
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default PublicNav

