import React from 'react'
import { motion } from 'framer-motion'
import './Card.css'

const Card = ({
  children,
  title,
  subtitle,
  header,
  footer,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  className = '',
  ...props
}) => {
  const cardClasses = `card card-${variant} card-padding-${padding} ${hover ? 'card-hover' : ''} ${onClick ? 'card-clickable' : ''} ${className}`
  
  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {(title || subtitle || header) && (
        <div className="card-header">
          {header || (
            <>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </motion.div>
  )
}

export default Card

