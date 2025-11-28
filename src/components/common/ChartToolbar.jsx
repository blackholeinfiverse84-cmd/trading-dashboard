import React, { useState, useEffect } from 'react'
import './ChartToolbar.css'

const DEFAULT_TOOLS = [
  {
    id: 'cursor',
    label: 'Select',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      </svg>
    ),
  },
  {
    id: 'trend-line',
    label: 'Trend Line',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="20" x2="20" y2="4" />
        <circle cx="4" cy="20" r="2" />
        <circle cx="20" cy="4" r="2" />
      </svg>
    ),
  },
  {
    id: 'horizontal-line',
    label: 'Horizontal Line',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="12" x2="6" y2="9" />
        <line x1="3" y1="12" x2="6" y2="15" />
        <line x1="21" y1="12" x2="18" y2="9" />
        <line x1="21" y1="12" x2="18" y2="15" />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Text Note',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16M6 20V4h4M14 20V4h4" />
        <path d="M6 4h12" />
      </svg>
    ),
  },
  {
    id: 'measure',
    label: 'Measure',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="12" x2="3" y2="8" />
        <line x1="3" y1="12" x2="3" y2="16" />
        <line x1="21" y1="12" x2="21" y2="8" />
        <line x1="21" y1="12" x2="21" y2="16" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="16" x2="16" y2="16" />
      </svg>
    ),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
      </svg>
    ),
  },
]

const ChartToolbar = ({ onToolChange, initialTool = 'cursor', tools = DEFAULT_TOOLS }) => {
  const [activeTool, setActiveTool] = useState(initialTool)
  const [collapsed, setCollapsed] = useState(true) // Start collapsed by default

  useEffect(() => {
    if (onToolChange) {
      onToolChange(activeTool)
    }
  }, [activeTool, onToolChange])

  const handleToolSelect = (toolId) => {
    setActiveTool(toolId)
  }

  return (
    <div className={`chart-toolbar ${collapsed ? 'chart-toolbar-collapsed' : ''}`}>
      <button
        type="button"
        className="toolbar-toggle"
        aria-label={collapsed ? 'Expand drawing toolbar' : 'Collapse drawing toolbar'}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <span aria-hidden="true">{collapsed ? '›' : '‹'}</span>
      </button>

      <div className="toolbar-tools">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`toolbar-tool ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => handleToolSelect(tool.id)}
            aria-pressed={activeTool === tool.id}
            aria-label={tool.label}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChartToolbar


