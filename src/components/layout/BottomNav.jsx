import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './BottomNav.css'

const navItems = [
  { id: 'home', icon: '🏠', label: 'Home', path: '/dashboard' },
  { id: 'trading', icon: '📈', label: 'Trading', path: '/dashboard/trading' },
  { id: 'portfolio', icon: '💼', label: 'Portfolio', path: '/dashboard/portfolio' },
  { id: 'analytics', icon: '📊', label: 'Analytics', path: '/dashboard/analytics' },
  { id: 'more', icon: '⚙️', label: 'More', path: '/dashboard/more' },
]

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    }
    return location.pathname.startsWith(path)
  }

  const handleNavClick = (path) => {
    navigate(path)
  }

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const active = isActive(item.path)
        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
            aria-label={item.label}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav

