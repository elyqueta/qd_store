import React from 'react'
import { Link } from 'react-router-dom'
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/format'

export default function CartDrawer() {
  const { items, open, closeCart, removeItem, updateQty, total } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-qd-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-qd-gray" />
                <span className="text-qd-dark font-medium text-sm">Carrinho</span>
              </div>
              <button onClick={closeCart} className="text-qd-light hover:text-qd-dark transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-56 text-center">
                    <ShoppingBag size={36} className="text-qd-border mb-3" />
                    <p className="text-qd-gray text-sm">Carrinho vazio</p>
                    <button onClick={closeCart} className="mt-3 text-xs text-qd-accent hover:underline">
                      Continuar a comprar
                    </button>
                  </div>
                ) : items.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 py-3 border-b border-qd-border/50"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-qd-bg flex-shrink-0">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-qd-dark text-xs font-medium truncate">{item.name}</p>
                      <p className="text-qd-gray text-xs mt-0.5">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-5 h-5 border border-qd-border rounded-full flex items-center justify-center hover:border-qd-dark transition-colors">
                          <Minus size={9} />
                        </button>
                        <span className="text-xs text-qd-dark w-3 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-5 h-5 border border-qd-border rounded-full flex items-center justify-center hover:border-qd-dark transition-colors">
                          <Plus size={9} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.id)} className="text-qd-light hover:text-qd-red transition-colors">
                        <Trash2 size={13} />
                      </button>
                      <p className="text-qd-dark text-xs font-medium">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="px-5 py-5 border-t border-qd-border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-qd-gray text-sm">Total</span>
                  <span className="text-qd-dark font-semibold">{formatPrice(total)}</span>
                </div>
                <Link to="/checkout/dados" onClick={closeCart} className="btn-primary w-full justify-center block text-center rounded-full py-3">
                  Finalizar Compra
                </Link>
                <button onClick={closeCart} className="w-full text-center text-xs text-qd-gray hover:text-qd-dark transition-colors py-1">
                  Continuar a comprar
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
