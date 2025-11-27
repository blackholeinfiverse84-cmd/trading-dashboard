import React from 'react'
import './ConfidenceGauge.css'

const ConfidenceGauge = ({ value = 0, label = 'Confidence', size = 88 }) => {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0))
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeValue / 100) * circumference

  const tone =
    safeValue >= 70 ? 'positive' : safeValue <= 30 ? 'negative' : 'neutral'

  return (
    <div className={`confidence-gauge ${tone}`} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="gauge-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="8"
        />
        <circle
          className="gauge-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-number">{safeValue}%</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  )
}

export default ConfidenceGauge

