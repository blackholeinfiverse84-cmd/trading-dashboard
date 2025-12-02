import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const DEFAULT_USER = { username: 'Guest Trader', email: null }
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
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize Supabase session on mount and subscribe to auth changes
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setUser(DEFAULT_USER)
          setIsAuthenticated(false)
        } else if (data?.session?.user) {
          const supaUser = data.session.user
          const username = supaUser.user_metadata?.username || supaUser.email?.split('@')[0] || 'Trader'
          const userData = {
            id: supaUser.id,
            username,
            email: supaUser.email,
          }
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        } else {
          setUser(DEFAULT_USER)
          setIsAuthenticated(false)
        }
      } finally {
        setLoading(false)
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const supaUser = session.user
          const username = supaUser.user_metadata?.username || supaUser.email?.split('@')[0] || 'Trader'
          const userData = {
            id: supaUser.id,
            username,
            email: supaUser.email,
          }
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        } else {
          setUser(DEFAULT_USER)
          setIsAuthenticated(false)
          localStorage.removeItem(STORAGE_KEY)
        }
      })

      return () => {
        listener?.subscription?.unsubscribe()
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setLoading(false)
        return { success: false, message: error.message || 'Login failed' }
      }

      const supaUser = data.user
      const username = supaUser.user_metadata?.username || supaUser.email?.split('@')[0] || 'Trader'
      const userData = {
        id: supaUser.id,
        username,
        email: supaUser.email,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      setLoading(false)
      return { success: true, message: 'Login successful' }
    } catch (error) {
      setLoading(false)
      const message = error.message || 'Login failed. Please try again.'
      return { success: false, message }
    }
  }

  const register = async (username, email, password) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) {
        setLoading(false)
        return { success: false, message: error.message || 'Registration failed' }
      }

      const supaUser = data.user
      const derivedUsername = username || supaUser?.email?.split('@')[0] || 'Trader'
      const userData = {
        id: supaUser?.id,
        username: derivedUsername,
        email: supaUser?.email || email,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(Boolean(data.session))
      setLoading(false)
      return {
        success: true,
        message: data.session ? 'Registration successful.' : 'Check your email to confirm your account.',
      }
    } catch (error) {
      setLoading(false)
      const message = error.message || 'Registration failed. Please try again.'
      return { success: false, message }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem(STORAGE_KEY)
    setUser(DEFAULT_USER)
    setIsAuthenticated(false)
  }

  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        const supaUser = data.session.user
        const username = supaUser.user_metadata?.username || supaUser.email?.split('@')[0] || 'Trader'
        const userData = {
          id: supaUser.id,
          username,
          email: supaUser.email,
        }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      } else {
        await logout()
      }
    } catch (error) {
      await logout()
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

