import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertCircle, Info, Heart, ShoppingCart } from 'lucide-react'

const NotifContext = createContext(null)
let _id = 0

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD': return [...state, action.payload]
    case 'REMOVE': return state.filter(n => n.id !== action.payload)
    default: return state
  }
}

const STYLES = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#16a34a' },
  error:   { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#dc2626' },
  info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#2563eb' },
  wishlist:{ bg: '#fff1f2', border: '#fecdd3', text: '#9f1239', icon: '#e11d48' },
  cart:    { bg: '#f0f9ff', border: '#bae6fd', text: '#0c4a6e', icon: '#0284c7' },
}

const ICONS = {
  success: <Check size={14} />,
  error: <AlertCircle size={14} />,
  info: <Info size={14} />,
  wishlist: <Heart size={14} />,
  cart: <ShoppingCart size={14} />,
}

export function NotificationProvider({ children }) {
  const [list, dispatch] = useReducer(reducer, [])

  const notify = useCallback(({ type = 'success', message, duration = 3200 }) => {
    const id = ++_id
    dispatch({ type: 'ADD', payload: { id, type, message } })
    setTimeout(() => dispatch({ type: 'REMOVE', payload: id }), duration)
  }, [])

  const remove = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), [])

  return (
    <NotifContext.Provider value={{ notify }}>
      {children}
      <div style={{
        position: 'fixed', top: '80px', right: '16px',
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px',
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {list.map(n => {
            const s = STYLES[n.type] || STYLES.info
            return (
              <motion.div key={n.id}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  pointerEvents: 'all',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: s.bg, border: `1px solid ${s.border}`,
                  borderRadius: '12px', padding: '10px 14px',
                  minWidth: '220px', maxWidth: '300px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              >
                <span style={{ color: s.icon, flexShrink: 0 }}>{ICONS[n.type]}</span>
                <p style={{ fontSize: '13px', color: s.text, flex: 1, margin: 0 }}>{n.message}</p>
                <button onClick={() => remove(n.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.icon, padding: 0, flexShrink: 0 }}>
                  <X size={12} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </NotifContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotifContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}