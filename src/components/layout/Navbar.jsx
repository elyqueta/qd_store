import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, X, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

const megaMenus = {
  Início: null,
  Smartphones: {
    items: [
      { label: 'iPhone 15 Pro Max', sub: 'Titânio · A17 Pro', to: '/produto/iphone-15-pro-max', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&q=80' },
      { label: 'Samsung S24 Ultra', sub: 'IA · 200MP', to: '/produto/samsung-s24-ultra', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&q=80' },
      { label: 'Xiaomi 14 Ultra', sub: 'Leica · Snapdragon 8', to: '/produto/xiaomi-14-ultra', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80' },
    ],
    cta: { label: 'Ver todos os Smartphones', to: '/catalogo?categoria=smartphones' },
  },
  Portáteis: {
    items: [
      { label: 'MacBook Pro M3 Max', sub: '16" · Até 22h bateria', to: '/produto/macbook-pro-16-m3', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80' },
      { label: 'Dell XPS 15 OLED', sub: 'RTX 4070 · 3.5K OLED', to: '/produto/dell-xps-15', img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&q=80' },
      { label: 'ASUS ROG Zephyrus', sub: 'RTX 4090 · 240Hz', to: '/produto/asus-rog-zephyrus', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&q=80' },
    ],
    cta: { label: 'Ver todos os Portáteis', to: '/catalogo?categoria=portateis' },
  },
  Áudio: {
    items: [
      { label: 'Sony WH-1000XM5', sub: 'Melhor ANC do mundo', to: '/produto/sony-wh1000xm5', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&q=80' },
      { label: 'AirPods Pro 2', sub: 'Chip H2 · ANC adaptativo', to: '/produto/airpods-pro-2', img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&q=80' },
      { label: 'Bose QC45', sub: 'Conforto lendário', to: '/produto/bose-qc45', img: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&q=80' },
    ],
    cta: { label: 'Ver todo o Áudio', to: '/catalogo?categoria=audio' },
  },
  Gaming: {
    items: [
      { label: 'PlayStation 5 Slim', sub: 'Ray tracing · SSD ultra-rápido', to: '/produto/ps5-slim', img: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=200&q=80' },
      { label: 'Xbox Series X', sub: '12 TFLOPS · 4K 120fps', to: '/produto/xbox-series-x', img: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=200&q=80' },
      { label: 'ROG DeathAdder V3', sub: 'Pro · 30K sensor', to: '/produto/razer-deathadder-v3', img: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&q=80' },
    ],
    cta: { label: 'Ver todo o Gaming', to: '/catalogo?categoria=gaming' },
  },
  Acessórios: {
    items: [
      { label: 'Apple Watch Ultra 2', sub: 'Titânio · GPS dual', to: '/produto/apple-watch-ultra-2', img: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=200&q=80' },
      { label: 'iPad Pro M4', sub: '13" OLED · 5.1mm', to: '/produto/ipad-pro-m4', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80' },
    ],
    cta: { label: 'Ver todos os Acessórios', to: '/catalogo?categoria=acessorios' },
  },
  'Comprar': null,
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, toggleCart } = useCart()
  const location = useLocation()
  const timerRef = useRef(null)

  const isHero = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setActiveMenu(null)
    setMobileOpen(false)
  }, [location])

  const handleMouseEnter = (key) => {
    clearTimeout(timerRef.current)
    if (megaMenus[key]) setActiveMenu(key)
    else setActiveMenu(null)
  }
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setActiveMenu(null), 150)
  }
  const handleMenuMouseEnter = () => clearTimeout(timerRef.current)

  // Nav style: on hero without scroll → transparent dark; scrolled or not hero → glass
  const navStyle = isHero && !scrolled
    ? 'nav-glass-dark'
    : 'nav-glass border-b border-black/10'

  const textColor = isHero && !scrolled ? 'text-white/90' : 'text-qd-dark'
  const textHover = isHero && !scrolled ? 'hover:text-white' : 'hover:text-qd-accent'
  const logoColor = isHero && !scrolled ? 'text-white' : 'text-qd-dark'
  const cartColor = isHero && !scrolled ? 'text-white/80 hover:text-white' : 'text-qd-dark/70 hover:text-qd-dark'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navStyle}`}
        style={{ height: 'var(--nav-height)' }}>
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className={`font-medium text-sm tracking-tight flex items-center gap-1.5 ${logoColor}`}>
            <div className={`w-6 h-6 flex items-center justify-center font-bold text-xs ${isHero && !scrolled ? 'bg-white text-black' : 'bg-qd-dark text-white'} transition-colors`}>Q</div>
            <span>QD <span className="font-light opacity-60">· ItSOLUTIONS</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0">
            {Object.keys(megaMenus).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                {key === 'Comprar' ? (
                  <Link
                    to="/catalogo"
                    className={`px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${textColor} ${textHover}`}
                  >
                    {key}
                  </Link>
                ) : (
                  <Link
                    to={key === 'Início' ? '/' : `/catalogo?categoria=${key.toLowerCase()}`}
                    className={`px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${textColor} ${textHover}`}
                  >
                    {key}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link to="/catalogo" className={`hidden md:flex transition-colors ${cartColor}`} aria-label="Pesquisar">
              <Search size={16} />
            </Link>
            <button onClick={toggleCart} className={`relative transition-colors ${cartColor}`} aria-label="Carrinho">
              <ShoppingCart size={16} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-qd-accent text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={18} className={textColor} /> : <div className="flex flex-col gap-1"><div className={`w-5 h-px ${isHero && !scrolled ? 'bg-white' : 'bg-qd-dark'}`}/><div className={`w-5 h-px ${isHero && !scrolled ? 'bg-white' : 'bg-qd-dark'}`}/></div>}
            </button>
          </div>
        </div>

        {/* Mega menu dropdown */}
        <AnimatePresence>
          {activeMenu && megaMenus[activeMenu] && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-xl border-b border-black/10 shadow-lg"
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[1200px] mx-auto px-6 py-8">
                <div className="grid grid-cols-3 gap-6">
                  {megaMenus[activeMenu].items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="group flex gap-4 p-3 rounded-xl hover:bg-qd-bg transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-qd-bg flex-shrink-0">
                        <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-qd-dark font-medium text-sm group-hover:text-qd-accent transition-colors">{item.label}</p>
                        <p className="text-qd-gray text-xs mt-0.5">{item.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-qd-border">
                  <Link
                    to={megaMenus[activeMenu].cta.to}
                    className="inline-flex items-center gap-1 text-qd-accent text-sm font-medium hover:gap-2 transition-all"
                  >
                    {megaMenus[activeMenu].cta.label}
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white pt-[var(--nav-height)] overflow-y-auto"
          >
            <div className="px-6 py-8 flex flex-col gap-1">
              {Object.keys(megaMenus).map((key) => (
                <Link
                  key={key}
                  to={key === 'Comprar' ? '/catalogo' : key === 'Início' ? '/' : `/catalogo?categoria=${key.toLowerCase()}`}
                  className="py-3 text-lg font-medium text-qd-dark border-b border-qd-border flex items-center justify-between"
                >
                  {key}
                  <ChevronRight size={16} className="text-qd-light" />
                </Link>
              ))}
              <div className="mt-6">
                <button onClick={toggleCart} className="btn-primary w-full justify-center">
                  Carrinho {count > 0 && `(${count})`}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
