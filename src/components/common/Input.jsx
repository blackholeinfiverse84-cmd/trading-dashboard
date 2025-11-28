import React from 'react'
import './Input.css'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  fullWidth = false,
  className = '',
  step = 1,
  min,
  max,
  ...props
}) => {
  const inputClasses = `input ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''} ${fullWidth ? 'input-full-width' : ''} ${className}`
  
  const handleStepUp = () => {
    if (disabled) return
    const numValue = Number(value) || 0
    const newValue = max !== undefined ? Math.min(numValue + step, max) : numValue + step
    if (onChange) {
      onChange({ target: { value: newValue.toString() } })
    }
  }
  
  const handleStepDown = () => {
    if (disabled) return
    const numValue = Number(value) || 0
    const newValue = min !== undefined ? Math.max(numValue - step, min) : numValue - step
    if (onChange) {
      onChange({ target: { value: newValue.toString() } })
    }
  }
  
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper-full-width' : ''}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          step={step}
          min={min}
          max={max}
          {...props}
        />
        {type === 'number' && !disabled && (
          <div className="input-spinner-controls">
            <button
              type="button"
              className="input-spinner-btn input-spinner-up"
              onClick={handleStepUp}
              tabIndex={-1}
              aria-label="Increase value"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
            <button
              type="button"
              className="input-spinner-btn input-spinner-down"
              onClick={handleStepDown}
              tabIndex={-1}
              aria-label="Decrease value"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <span className={`input-helper ${error ? 'input-helper-error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  )
}

export default Input

