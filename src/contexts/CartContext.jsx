import React, { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE':
      return { ...state, open: !state.open }
    case 'CLOSE':
      return { ...state, open: false }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], open: false })

  const addItem = useCallback((product) => dispatch({ type: 'ADD_ITEM', payload: product }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', payload: id }), [])
  const updateQty = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE' }), [])

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = state.items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ ...state, total, count, addItem, removeItem, updateQty, clearCart, toggleCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
