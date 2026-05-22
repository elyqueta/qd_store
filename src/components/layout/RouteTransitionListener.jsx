import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePreloader } from '@/contexts/PreloaderContext'

/**
 * RouteTransitionListener
 * Detecta mudanças de rota e ativa o preloader por 2 segundos
 * Deve ser colocado dentro de <BrowserRouter>
 */
export default function RouteTransitionListener() {
  const { startLoading, stopLoading } = usePreloader()
  const location = useLocation()

  useEffect(() => {
    // Inicia preloader ao mudar de rota
    startLoading()

    // Para preloader após 2 segundos
    const timer = setTimeout(() => {
      stopLoading()
    }, 2000)

    return () => clearTimeout(timer)
  }, [location.pathname, startLoading, stopLoading])

  return null
}
