/**
 * PreloaderContext
 * Gestão global do estado do preloader.
 * Expõe: isVisible, triggerLoader()
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const PreloaderContext = createContext(null)

export function PreloaderProvider({ children }) {
  // Só mostra na primeira visita (homepage)
  const [isVisible, setIsVisible] = useState(true)
  const hasShownRef = useRef(false)

  /**
   * Esconde o preloader com delay para a animação de saída
   */
  const hideLoader = useCallback(() => {
    setIsVisible(false)
    hasShownRef.current = true
  }, [])

  /**
   * Pode ser chamado para forçar mostrar o loader (ex: hard refresh)
   */
  const showLoader = useCallback(() => {
    if (!hasShownRef.current) {
      setIsVisible(true)
    }
  }, [])

  return (
    <PreloaderContext.Provider value={{ isVisible, hideLoader, showLoader }}>
      {children}
    </PreloaderContext.Provider>
  )
}

export function usePreloader() {
  const ctx = useContext(PreloaderContext)
  if (!ctx) throw new Error('usePreloader must be used within PreloaderProvider')
  return ctx
}