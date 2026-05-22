import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePreloader } from '@/contexts/PreloaderContext'

export function usePageTransition() {
  const { startLoading, stopLoading } = usePreloader()
  const location = useLocation()

  useEffect(() => {
    // Inicia o preloader ao mudar de rota
    startLoading()

    // Para o preloader após renderização (300ms é suficiente para React)
    const timer = setTimeout(stopLoading, 300)

    return () => clearTimeout(timer)
  }, [location.pathname, startLoading, stopLoading])
}

export default usePageTransition
