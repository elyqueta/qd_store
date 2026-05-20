import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { heroSlides } from '@/data/products'

export default function Hero() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroSlides.length)
  }, [])

  useEffect(() => {
    const t = setInterval(next, 7000)
    return () => clearInterval(t)
  }, [next])

  const slide = heroSlides[current]

  return (
    <>
      {heroSlides.map((s, i) => (
        <section
          key={s.id}
          className="tesla-section"
          style={{ display: i === current ? 'flex' : 'none' }}
        >
          {/* Background */}
          <div className="tesla-section-bg">
            <AnimatePresence mode="crossfade">
              <motion.img
                key={s.id}
                src={s.bg}
                alt=""
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
            </AnimatePresence>
            <div className="hero-overlay absolute inset-0" />
          </div>

          {/* Top — title (minimal, like Tesla) */}
          <div className="tesla-section-top w-full px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id + '-top'}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight">
                  {s.title.replace('\n', ' ')}
                </h1>
                <p className="text-white/80 text-sm mt-1.5 font-light">{s.subtitle}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom — CTAs */}
          <div className="tesla-section-bottom px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id + '-btns'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Link to={s.ctaLink} className="btn-white-solid min-w-[180px]">
                  {s.cta}
                </Link>
                <Link to="/catalogo" className="btn-white min-w-[180px]">
                  Ver Catálogo
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Slide dots */}
            <div className="flex justify-center gap-1.5 mt-6">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-500 ${
                    i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
