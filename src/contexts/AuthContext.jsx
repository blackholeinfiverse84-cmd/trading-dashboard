import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

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
const TOKEN_KEY = 'token'

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
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
    return Boolean(token && loadStoredUser())
  })

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.verifyToken()
        if (response.success && response.user) {
          const userData = {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
          }
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        } else {
          // Token invalid, clear storage
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(STORAGE_KEY)
          setUser(DEFAULT_USER)
          setIsAuthenticated(false)
        }
      } catch (error) {
        // Token verification failed, clear storage
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(STORAGE_KEY)
        setUser(DEFAULT_USER)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const response = await authAPI.login(username, password)
      if (response.success && response.token && response.user) {
        // Store token and user data
        localStorage.setItem(TOKEN_KEY, response.token)
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        setLoading(false)
        return { success: true, message: response.message }
      } else {
        setLoading(false)
        return { success: false, message: response.message || 'Login failed' }
      }
    } catch (error) {
      setLoading(false)
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.'
      return { success: false, message }
    }
  }

  const register = async (username, email, password) => {
    setLoading(true)
    try {
      const response = await authAPI.register(username, email, password)
      if (response.success && response.token && response.user) {
        // Store token and user data
        localStorage.setItem(TOKEN_KEY, response.token)
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        setLoading(false)
        return { success: true, message: response.message }
      } else {
        setLoading(false)
        return { success: false, message: response.message || 'Registration failed' }
      }
    } catch (error) {
      setLoading(false)
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.'
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(STORAGE_KEY)
    setUser(DEFAULT_USER)
    setIsAuthenticated(false)
  }

  const checkAuth = async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsAuthenticated(false)
      setUser(DEFAULT_USER)
      return
    }

    try {
      const response = await authAPI.verifyToken()
      if (response.success && response.user) {
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
        }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      } else {
        logout()
      }
    } catch (error) {
      logout()
    }
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

