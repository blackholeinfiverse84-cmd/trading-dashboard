import React, { createContext, useState, useContext } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const DEFAULT_USER = { username: 'Guest Trader' }
const STORAGE_KEY = 'trading:user'

const loadStoredUser = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('Failed to parse stored user', error)
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadStoredUser() || DEFAULT_USER)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(loadStoredUser()))

  const simulateAuth = (username) => {
    const displayName = username?.trim() || DEFAULT_USER.username
    const nextUser = { username: displayName }
    setUser(nextUser)
    setIsAuthenticated(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    }
    return { success: true }
  }

  const login = async (username) => simulateAuth(username)

  const register = async (username) => simulateAuth(username)

  const logout = () => {
    setUser(DEFAULT_USER)
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const checkAuth = () => {
    const storedUser = loadStoredUser()
    setIsAuthenticated(Boolean(storedUser))
    setUser(storedUser || DEFAULT_USER)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

