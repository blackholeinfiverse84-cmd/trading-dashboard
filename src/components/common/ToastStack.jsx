import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './ToastStack.css'

const VARIANT_ICONS = {
  success: '✅',
  error: '⚠️',
  warning: '⚠️',
  info: 'ℹ️',
}

const ToastStack = ({ toasts, onDismiss }) => {
  if (!toasts?.length) return null

  return (
    <div className="toast-stack">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={`toast toast-${toast.variant}`}
          >
            <div className="toast-icon">
              {VARIANT_ICONS[toast.variant] || VARIANT_ICONS.info}
            </div>
            <div className="toast-content">
              {toast.title && <p className="toast-title">{toast.title}</p>}
              {toast.message && <p className="toast-message">{toast.message}</p>}
            </div>
            <button
              type="button"
              className="toast-close"
              aria-label="Dismiss notification"
              onClick={() => onDismiss(toast.id)}
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastStack


