import React, { createContext, useContext, useReducer, useCallback } from 'react'

const WishlistContext = createContext(null)

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.find(i => i.id === action.payload.id)
      return {
        ...state,
        items: exists
          ? state.items.filter(i => i.id !== action.payload.id)
          : [...state.items, action.payload],
      }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    default:
      return state
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const toggle = useCallback((product) => dispatch({ type: 'TOGGLE', payload: product }), [])
  const remove = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), [])
  const isWishlisted = useCallback((id) => state.items.some(i => i.id === id), [state.items])
  return (
    <WishlistContext.Provider value={{ items: state.items, toggle, remove, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}