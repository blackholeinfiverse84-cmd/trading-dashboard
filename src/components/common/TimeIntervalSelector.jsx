import React, { useState, useRef, useEffect } from 'react'
import './TimeIntervalSelector.css'

// Convert interval value to minutes for chart generation
const convertToMinutes = (value, unit) => {
  switch (unit) {
    case 'tick':
      return 1 / 60 // Assume 1 tick = 1 second for simplicity
    case 'second':
      return value / 60
    case 'minute':
      return value
    case 'hour':
      return value * 60
    case 'day':
      return value * 24 * 60
    case 'week':
      return value * 7 * 24 * 60
    case 'month':
      return value * 30 * 24 * 60 // Approximate
    case 'range':
      return 1 // Default to 1 minute for ranges
    default:
      return value
  }
}

// Convert minutes back to display format
const formatInterval = (minutes) => {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60)
    return { value: seconds, unit: 'second', label: `${seconds} second${seconds !== 1 ? 's' : ''}` }
  } else if (minutes < 60) {
    return { value: minutes, unit: 'minute', label: `${minutes} minute${minutes !== 1 ? 's' : ''}` }
  } else if (minutes < 1440) {
    const hours = Math.round(minutes / 60)
    return { value: hours, unit: 'hour', label: `${hours} hour${hours !== 1 ? 's' : ''}` }
  } else {
    const days = Math.round(minutes / 1440)
    return { value: days, unit: 'day', label: `${days} day${days !== 1 ? 's' : ''}` }
  }
}

const INTERVAL_OPTIONS = {
  TICKS: [
    { value: 1, unit: 'tick', label: '1 tick' },
    { value: 10, unit: 'tick', label: '10 ticks' },
    { value: 100, unit: 'tick', label: '100 ticks' },
    { value: 1000, unit: 'tick', label: '1000 ticks' },
  ],
  SECONDS: [
    { value: 1, unit: 'second', label: '1 second' },
    { value: 5, unit: 'second', label: '5 seconds' },
    { value: 10, unit: 'second', label: '10 seconds' },
    { value: 15, unit: 'second', label: '15 seconds' },
    { value: 30, unit: 'second', label: '30 seconds' },
    { value: 45, unit: 'second', label: '45 seconds' },
  ],
  MINUTES: [
    { value: 1, unit: 'minute', label: '1 minute' },
    { value: 2, unit: 'minute', label: '2 minutes' },
    { value: 3, unit: 'minute', label: '3 minutes' },
    { value: 5, unit: 'minute', label: '5 minutes' },
    { value: 10, unit: 'minute', label: '10 minutes' },
    { value: 15, unit: 'minute', label: '15 minutes' },
    { value: 30, unit: 'minute', label: '30 minutes' },
    { value: 45, unit: 'minute', label: '45 minutes' },
  ],
  HOURS: [
    { value: 1, unit: 'hour', label: '1 hour' },
    { value: 2, unit: 'hour', label: '2 hours' },
    { value: 3, unit: 'hour', label: '3 hours' },
    { value: 4, unit: 'hour', label: '4 hours' },
  ],
  DAYS: [
    { value: 1, unit: 'day', label: '1 day' },
    { value: 7, unit: 'week', label: '1 week' },
    { value: 1, unit: 'month', label: '1 month' },
    { value: 3, unit: 'month', label: '3 months' },
    { value: 6, unit: 'month', label: '6 months' },
    { value: 12, unit: 'month', label: '12 months' },
  ],
  RANGES: [
    { value: 1, unit: 'range', label: '1 range' },
    { value: 10, unit: 'range', label: '10 ranges' },
    { value: 100, unit: 'range', label: '100 ranges' },
    { value: 1000, unit: 'range', label: '1000 ranges' },
  ],
}

const TimeIntervalSelector = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({
    TICKS: false,
    SECONDS: false,
    MINUTES: true, // Default to expanded
    HOURS: false,
    DAYS: false,
    RANGES: false,
  })
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Find selected option across all categories by converting to minutes
  const findSelectedOption = () => {
    // value is in minutes, so we need to find the matching option
    for (const category of Object.keys(INTERVAL_OPTIONS)) {
      for (const option of INTERVAL_OPTIONS[category]) {
        const optionMinutes = convertToMinutes(option.value, option.unit)
        if (Math.abs(optionMinutes - value) < 0.01) {
          return option
        }
      }
    }
    // If not found, format as minutes
    return { value, unit: 'minute', label: `${value} minute${value !== 1 ? 's' : ''}` }
  }

  const selectedOption = findSelectedOption()
  const selectedLabel = selectedOption.label

  const handleSelect = (option) => {
    // Convert to minutes for the chart
    const minutes = convertToMinutes(option.value, option.unit)
    onChange(Math.round(minutes))
    setIsOpen(false)
  }

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className={`time-interval-selector ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="interval-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select time interval"
      >
        <span className="interval-selector-label">{selectedLabel}</span>
        <svg
          className={`interval-selector-arrow ${isOpen ? 'open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="interval-dropdown">
          <button
            type="button"
            className="interval-add-custom"
            onClick={() => {
              // Placeholder for custom interval functionality
              console.log('Add custom interval')
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add custom interval...</span>
          </button>

          {Object.entries(INTERVAL_OPTIONS).map(([category, options]) => (
            <div key={category} className="interval-category">
              <button
                type="button"
                className="interval-category-header"
                onClick={() => toggleCategory(category)}
              >
                <svg
                  className={`interval-category-caret ${expandedCategories[category] ? 'expanded' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <span className="interval-category-title">{category}</span>
              </button>
              {expandedCategories[category] && (
                <div className="interval-options">
                  {options.map((option, index) => {
                    const optionMinutes = convertToMinutes(option.value, option.unit)
                    const isActive = Math.abs(optionMinutes - value) < 0.01
                    return (
                      <button
                        key={`${category}-${index}`}
                        type="button"
                        className={`interval-option ${isActive ? 'active' : ''}`}
                        onClick={() => handleSelect(option)}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimeIntervalSelector
