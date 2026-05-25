import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Heart, Share2, Check } from 'lucide-react'
import { products, categories } from '@/data/products'
import { useWishlist } from '@/contexts/WishlistContext'
import { useNotification } from '@/contexts/NotificationContext'
import { formatPrice } from '@/utils/format'
import ProductCard from '@/components/product/ProductCard'
import BuyModal from '@/components/product/BuyModal'

export default function ProductPage() {
  const { id } = useParams()
  const { toggle, isWishlisted } = useWishlist()
  const { notify } = useNotification()
  const [activeImg, setActiveImg] = useState(0)
  const [buyOpen, setBuyOpen] = useState(false)
  const [shared, setShared] = useState(false)

  const product = products.find(p => p.id === id)

  if (!product) return (
    <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)] flex items-center justify-center">
      <div className="text-center">
        <p className="text-qd-gray mb-4">Produto não encontrado.</p>
        <Link to="/catalogo" className="btn-primary rounded-full px-6 py-2.5">Ver catálogo</Link>
      </div>
    </main>
  )

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const catLabel = categories.find(c => c.id === product.category)?.label || product.category
  const wishlisted = isWishlisted(product.id)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleWishlist = () => {
    toggle(product)
    notify({
      type: 'wishlist',
      message: wishlisted
        ? `${product.name} removido dos favoritos`
        : `${product.name} adicionado aos favoritos`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
      notify({ type: 'info', message: 'Link copiado!' })
    }
  }

  return (
    <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-qd-border">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-1 text-xs text-qd-gray">
          <Link to="/" className="hover:text-qd-accent transition-colors">Início</Link>
          <ChevronRight size={11} />
          <Link to="/catalogo" className="hover:text-qd-accent transition-colors">Catálogo</Link>
          <ChevronRight size={11} />
          <Link to={`/catalogo?categoria=${product.category}`} className="hover:text-qd-accent transition-colors">{catLabel}</Link>
          <ChevronRight size={11} />
          <span className="text-qd-dark truncate max-w-[160px]">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm mb-3 relative">
              {discount && (
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: '#ff3b30', color: '#fff',
                  fontSize: '13px', fontWeight: 600,
                  padding: '4px 10px', borderRadius: '10px', zIndex: 2,
                }}>
                  -{discount}%
                </div>
              )}
              <img
                src={product.images?.[activeImg] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-qd-accent' : 'border-transparent hover:border-qd-border'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col">

            {product.badge && (
              <span className="self-start bg-qd-accent text-white text-[11px] font-medium px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            )}

            <p className="text-qd-light text-xs uppercase tracking-widest font-mono mb-2">{catLabel}</p>
            <h1 className="text-3xl md:text-4xl font-medium text-qd-dark tracking-tight leading-tight mb-3">
              {product.name}
            </h1>
            <p className="text-qd-gray text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
              <p className="text-xs text-qd-gray mb-1">Preço</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <p className="text-3xl font-semibold text-qd-dark">{formatPrice(product.price)}</p>
                {product.originalPrice && (
                  <p style={{ fontSize: '16px', color: '#aeaeb2', textDecoration: 'line-through' }}>
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
              </div>
              <p className="text-xs text-qd-light mt-1">Inclui IVA · Pagamento em Kwanzas</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 mb-6">
              {/* Comprar — abre modal */}
              <button
                onClick={() => setBuyOpen(true)}
                className="btn-primary rounded-full py-3.5 justify-center text-sm"
              >
                Comprar
              </button>

              {/* Wishlist + Partilhar */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleWishlist} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '50px',
                  border: `1.5px solid ${wishlisted ? '#fecdd3' : '#d2d2d7'}`,
                  background: wishlisted ? '#fff1f2' : '#fff',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                  color: wishlisted ? '#e11d48' : '#6e6e73', transition: 'all 0.2s',
                }}>
                  <Heart size={15} fill={wishlisted ? '#e11d48' : 'none'} color={wishlisted ? '#e11d48' : '#6e6e73'} />
                  {wishlisted ? 'Guardado' : 'Favoritos'}
                </button>

                <button onClick={handleShare} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '50px',
                  border: '1.5px solid #d2d2d7', background: '#fff',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#6e6e73', transition: 'all 0.2s',
                }}>
                  {shared ? <Check size={15} color="#16a34a" /> : <Share2 size={15} />}
                  {shared ? 'Copiado!' : 'Partilhar'}
                </button>
              </div>
            </div>

            {/* Specs */}
            {product.specs && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-medium text-qd-dark uppercase tracking-widest font-mono mb-4">Especificações</p>
                <div className="divide-y divide-qd-border">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2.5 text-sm">
                      <span className="text-qd-gray">{k}</span>
                      <span className="text-qd-dark font-medium text-right max-w-[55%]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white border-t border-qd-border py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label mb-1">Da mesma categoria</p>
                <h2 className="text-2xl font-medium text-qd-dark tracking-tight">Também podes gostar</h2>
              </div>
              <Link to={`/catalogo?categoria=${product.category}`}
                className="text-qd-accent text-sm hover:underline hidden sm:block">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Buy Modal */}
      {buyOpen && <BuyModal product={product} onClose={() => setBuyOpen(false)} />}
    </main>
  )
}