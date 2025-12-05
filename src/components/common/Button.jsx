import React from 'react'
import { motion } from 'framer-motion'
import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  ...props
}) => {
  const baseClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${disabled ? 'btn-disabled' : ''}`
  
  const handleClick = (e) => {
    if (onClick && !disabled) {
      onClick(e)
    }
  }

  return (
    <motion.button
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </motion.button>
  )
}

export default Button

