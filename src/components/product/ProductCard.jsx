import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { useTilt } from '@/hooks/useTilt'
import { formatPrice } from '@/utils/format'

export default function ProductCard({ product, index = 0 }) {
  const { addItem, toggleCart } = useCart()
  const { ref, onMouseMove, onMouseLeave } = useTilt(5)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product)
    toggleCart()
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
            {product.badge && (
              <div className="absolute top-3 left-3 bg-qd-accent text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                {product.badge}
              </div>
            )}
            {/* Add to cart on hover */}
            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full bg-qd-dark text-white text-xs font-medium py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <ShoppingCart size={13} />
                Adicionar ao Carrinho
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-qd-light text-[11px] uppercase tracking-widest font-mono mb-1">{product.category}</p>
            <h3 className="text-qd-dark font-medium text-sm leading-snug mb-3 group-hover:text-qd-accent transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-qd-dark font-semibold text-base">{formatPrice(product.price)}</p>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}
