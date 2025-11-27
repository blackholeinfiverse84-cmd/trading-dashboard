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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEFAULT_USER)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const simulateAuth = (username) => {
    const displayName = username?.trim() || DEFAULT_USER.username
    setUser({ username: displayName })
    setIsAuthenticated(true)
    return { success: true }
  }

  const login = async (username) => simulateAuth(username)

  const register = async (username) => simulateAuth(username)

  const logout = () => {
    setUser(DEFAULT_USER)
    setIsAuthenticated(true)
  }

  const checkAuth = () => {
    setIsAuthenticated(true)
    setUser(DEFAULT_USER)
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

