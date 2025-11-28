import { useEffect, useCallback } from 'react'

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to callbacks
 * @param {Array} dependencies - Dependencies array for callbacks
 * 
 * @example
 * useKeyboardShortcuts({
 *   'ctrl+k': () => openSearch(),
 *   'escape': () => closeModal(),
 *   'ctrl+/': () => showHelp(),
 * })
 */
export const useKeyboardShortcuts = (shortcuts = {}, dependencies = []) => {
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey
    const alt = event.altKey

    // Build key combination string
    let combination = ''
    if (ctrl) combination += 'ctrl+'
    if (shift) combination += 'shift+'
    if (alt) combination += 'alt+'
    combination += key

    // Check if this combination is registered
    if (shortcuts[combination]) {
      // Prevent default if it's a registered shortcut
      event.preventDefault()
      event.stopPropagation()
      shortcuts[combination](event)
      return
    }

    // Also check without modifiers
    if (shortcuts[key] && !ctrl && !shift && !alt) {
      // Only trigger if we're not in an input field (unless explicitly allowed)
      const target = event.target
      const isInput = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.isContentEditable
      
      if (!isInput || shortcuts[key].allowInInput) {
        event.preventDefault()
        event.stopPropagation()
        shortcuts[key](event)
      }
    }
  }, [shortcuts, ...dependencies])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

/**
 * Helper to create keyboard shortcut descriptions
 */
export const getShortcutDescription = (key) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const ctrlKey = isMac ? '⌘' : 'Ctrl'
  
  return key
    .replace(/ctrl\+/gi, `${ctrlKey}+`)
    .replace(/shift\+/gi, 'Shift+')
    .replace(/alt\+/gi, 'Alt+')
    .replace(/escape/gi, 'Esc')
    .replace(/enter/gi, 'Enter')
    .replace(/space/gi, 'Space')
}

export default useKeyboardShortcuts

