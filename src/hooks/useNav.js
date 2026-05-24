/**
 * useNav.js
 * Hook de navegação com scroll-to-top garantido.
 * Usa-se em vez de <Link> quando se quer garantir que
 * ao clicar num link — mesmo que já estejas nessa rota —
 * a página volta sempre ao topo.
 */
import { useNavigate, useLocation } from 'react-router-dom'
import { useCallback } from 'react'

export function useNav() {
  const navigate  = useNavigate()
  const location  = useLocation()

  /**
   * navTo(path)
   * Navega para o path e força scroll ao topo.
   * Se já estiver no mesmo path, faz scroll sem re-renderizar.
   */
  const navTo = useCallback((path) => {
    // Scroll imediato — antes de qualquer render
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    if (location.pathname === path) {
      // Já está na página: não navega de novo, só fez o scroll acima
      return
    }

    navigate(path)
  }, [navigate, location.pathname])

  return { navTo }
}