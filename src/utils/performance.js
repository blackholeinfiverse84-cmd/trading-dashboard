/**
 * Performance monitoring utilities
 * Use these in development to identify performance bottlenecks
 */

/**
 * Measure component render time
 * Usage: const measure = usePerformanceMeasure('ComponentName')
 */
export const usePerformanceMeasure = (componentName) => {
  if (process.env.NODE_ENV !== 'development') {
    return () => {} // No-op in production
  }

  return (label = 'render') => {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      if (duration > 16) { // Warn if render takes longer than one frame
        console.warn(`[Performance] ${componentName} ${label} took ${duration.toFixed(2)}ms`)
      }
    }
  }
}

/**
 * Debounce function calls
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function calls
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Memoize expensive calculations
 */
export const memoize = (fn) => {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

