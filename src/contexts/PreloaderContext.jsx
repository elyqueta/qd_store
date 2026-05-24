import React, { createContext, useContext, useState, useRef, useCallback } from 'react'

const PreloaderContext = createContext(null)

export function PreloaderProvider({ children }) {
  const [isVisible, setIsVisible] = useState(true)
  const shownRef = useRef(false)

  const hideLoader = useCallback(() => {
    setIsVisible(false)
    shownRef.current = true
  }, [])

  return (
    <PreloaderContext.Provider value={{ isVisible, hideLoader }}>
      {children}
    </PreloaderContext.Provider>
  )
}

export function usePreloader() {
  const ctx = useContext(PreloaderContext)
  if (!ctx) throw new Error('usePreloader must be used within PreloaderProvider')
  return ctx
}