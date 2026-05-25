import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useNotification } from '@/contexts/NotificationContext'
import { useTilt } from '@/hooks/useTilt'
import { formatPrice } from '@/utils/format'

export default function ProductCard({ product, index = 0 }) {
  const { addItem, toggleCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const { notify } = useNotification()
  const { ref, onMouseMove, onMouseLeave } = useTilt(5)

  const wishlisted = isWishlisted(product.id)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toggleCart()
    notify({ type: 'cart', message: `${product.name} adicionado ao carrinho` })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product)
    notify({
      type: 'wishlist',
      message: wishlisted
        ? `${product.name} removido dos favoritos`
        : `${product.name} adicionado aos favoritos`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="product-card tilt-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
        style={{ transition: 'transform 0.15s ease, box-shadow 0.5s ease' }}
      >
        <Link to={`/produto/${product.id}`} className="block">

          {/* Image */}
          <div className="product-img-wrap relative aspect-[4/3]">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Badge desconto */}
            {discount && (
              <div style={{
                position: 'absolute', top: '10px', left: '10px',
                background: '#ff3b30', color: '#fff',
                fontSize: '11px', fontWeight: 600,
                padding: '3px 8px', borderRadius: '8px', zIndex: 2,
              }}>
                -{discount}%
              </div>
            )}

            {/* Badge produto (sem desconto) */}
            {product.badge && !discount && (
              <div className="absolute top-3 left-3 bg-qd-accent text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                {product.badge}
              </div>
            )}

            {/* Hover: ❤️ + 🛒 */}
            <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                style={{
                  width: '36px', height: '36px',
                  background: wishlisted ? '#fff1f2' : 'rgba(255,255,255,0.9)',
                  border: `1.5px solid ${wishlisted ? '#fecdd3' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s',
                }}
                aria-label="Favoritos"
              >
                <Heart
                  size={16}
                  fill={wishlisted ? '#e11d48' : 'none'}
                  color={wishlisted ? '#e11d48' : '#6e6e73'}
                />
              </button>

              {/* Adicionar ao carrinho */}
              <button
                onClick={handleCart}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px',
                  background: '#1c1c1e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#000'}
                onMouseLeave={e => e.currentTarget.style.background = '#1c1c1e'}
                aria-label="Adicionar ao carrinho"
              >
                <ShoppingCart size={13} />
                Carrinho
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-qd-light text-[11px] uppercase tracking-widest font-mono mb-1">{product.category}</p>
            <h3 className="text-qd-dark font-medium text-sm leading-snug mb-2 group-hover:text-qd-accent transition-colors duration-200">
              {product.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p className="text-qd-dark font-semibold text-base">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <p style={{ fontSize: '12px', color: '#aeaeb2', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}