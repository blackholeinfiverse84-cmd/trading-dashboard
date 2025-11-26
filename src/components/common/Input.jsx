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
  ...props
}) => {
  const inputClasses = `input ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''} ${fullWidth ? 'input-full-width' : ''} ${className}`
  
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
          {...props}
        />
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

