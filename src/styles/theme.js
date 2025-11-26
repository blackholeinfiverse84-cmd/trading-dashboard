// Design System - Inspired by Apple Finance, Bloomberg Terminal, and Blackhole Infiverse
// Minimal, professional, and modern aesthetic

export const theme = {
  // Color Palette - Dark theme with professional accents
  colors: {
    // Backgrounds
    bgPrimary: '#0a0a0a',        // Deep black (Bloomberg-inspired)
    bgSecondary: '#141414',      // Slightly lighter black
    bgTertiary: '#1a1a1a',       // Card backgrounds
    bgHover: '#1f1f1f',          // Hover states
    
    // Text
    textPrimary: '#ffffff',       // Primary text
    textSecondary: '#b3b3b3',    // Secondary text (Apple-inspired)
    textTertiary: '#808080',     // Tertiary text
    textMuted: '#4d4d4d',        // Muted text
    
    // Accents - Professional and minimal
    accentPrimary: '#007aff',    // Apple blue
    accentSecondary: '#5856d6',  // Purple accent
    accentSuccess: '#34c759',    // Green (Apple)
    accentWarning: '#ff9500',     // Orange
    accentError: '#ff3b30',       // Red (Apple)
    
    // Trading specific
    profit: '#34c759',           // Green for profits
    loss: '#ff3b30',             // Red for losses
    neutral: '#8e8e93',          // Neutral gray
    
    // Borders
    borderPrimary: '#2c2c2e',    // Primary borders
    borderSecondary: '#3a3a3c',  // Secondary borders
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Typography - Clean and readable
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing - Consistent 4px base unit
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  // Shadows - Subtle and professional
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  // Breakpoints (for responsive design)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}

// Helper function to get theme values
export const getThemeValue = (path) => {
  const keys = path.split('.')
  let value = theme
  for (const key of keys) {
    value = value[key]
    if (value === undefined) return undefined
  }
  return value
}

