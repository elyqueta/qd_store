import React, { createContext, useState, useCallback } from 'react'

export const PreloaderContext = createContext()

export function PreloaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const startLoading = useCallback(() => {
    setIsExiting(false)
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsExiting(true)
    // Aguarda a animação de saída antes de remover do DOM
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsExiting(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <PreloaderContext.Provider value={{ isLoading, isExiting, startLoading, stopLoading }}>
      {children}
    </PreloaderContext.Provider>
  )
}

export function usePreloader() {
  const context = React.useContext(PreloaderContext)
  if (!context) {
    throw new Error('usePreloader must be used within PreloaderProvider')
  }
  return context
}
