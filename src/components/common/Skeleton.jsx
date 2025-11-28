import React from 'react'
import { motion } from 'framer-motion'
import './Skeleton.css'

const Skeleton = ({ 
  width, 
  height, 
  variant = 'rectangular',
  className = '',
  count = 1,
  animated = true
}) => {
  const baseClasses = `skeleton skeleton-${variant} ${className}`
  
  const skeletonStyle = {
    width: width || '100%',
    height: height || '1rem',
  }

  const skeletons = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      className={baseClasses}
      style={skeletonStyle}
      animate={animated ? {
        opacity: [0.5, 1, 0.5],
      } : {}}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  ))

  if (count === 1) {
    return skeletons[0]
  }

  return (
    <div className="skeleton-group">
      {skeletons}
    </div>
  )
}

// Predefined skeleton components for common use cases
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton width="60%" height="1.5rem" className="skeleton-title" />
    <Skeleton width="40%" height="1rem" className="skeleton-subtitle" />
    <Skeleton width="100%" height="200px" className="skeleton-content" />
  </div>
)

export const SkeletonText = ({ lines = 3 }) => (
  <div className="skeleton-text">
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton 
        key={i} 
        width={i === lines - 1 ? '80%' : '100%'} 
        height="1rem"
        className="skeleton-line"
      />
    ))}
  </div>
)

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton key={i} width="100%" height="1.5rem" />
      ))}
    </div>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: columns }, (_, colIndex) => (
          <Skeleton key={colIndex} width="100%" height="1rem" />
        ))}
      </div>
    ))}
  </div>
)

export default Skeleton

