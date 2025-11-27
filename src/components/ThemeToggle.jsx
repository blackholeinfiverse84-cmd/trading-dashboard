import React from 'react'
import Button from './common/Button'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button variant="secondary" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  )
}

export default ThemeToggle

