import React, { createContext, useContext, useState, useCallback } from 'react'
import ToastStack from '../components/common/ToastStack'

const ToastContext = createContext(null)
const DEFAULT_DURATION = 4500

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(({ title, message, variant = 'info', duration = DEFAULT_DURATION }) => {
    const id = generateId()
    const toast = { id, title, message, variant }
    setToasts((current) => [...current, toast])

    if (duration > 0 && typeof window !== 'undefined') {
      window.setTimeout(() => removeToast(id), duration)
    }

    return id
  }, [removeToast])

  const value = {
    toasts,
    addToast,
    removeToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}


