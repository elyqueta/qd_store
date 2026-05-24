/**
 * Preloader.jsx — QD · ItSOLUTIONS
 * Aparece APENAS no primeiro carregamento (homepage).
 * Duração: 3.2s + animação de saída 0.7s
 */
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePreloader } from '@/contexts/PreloaderContext'

const DURATION = 3200   // ms que o preloader fica visível antes de sair

const ACCENT      = '#0071e3'
const ACCENT_CYAN = '#00b4d8'

/* ── Variantes ── */
const backdropExit = {
  opacity: 0,
  transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
}

export default function Preloader() {
  const { isVisible, hideLoader } = usePreloader()
  const [ready, setReady]         = useState(false)   // logo carregou?
  const timerRef                  = useRef(null)

  /* Quando o logo carrega inicia o countdown */
  const onLogoLoad = () => {
    setReady(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(hideLoader, DURATION)
  }

  /* Safety-net: se o logo não carregar em 500ms (ex: path errado) avança na mesma */
  useEffect(() => {
    if (!isVisible) return
    const safetyTimer = setTimeout(() => {
      if (!ready) {
        setReady(true)
        timerRef.current = setTimeout(hideLoader, DURATION)
      }
    }, 500)
    return () => {
      clearTimeout(safetyTimer)
      clearTimeout(timerRef.current)
    }
  }, [isVisible]) // eslint-disable-line

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={backdropExit}
          style={s.backdrop}
          aria-live="polite"
          aria-label="A carregar QD · ItSOLUTIONS"
          role="status"
        >
          {/* Ruído de fundo (subtil) */}
          <div style={s.noise} aria-hidden="true" />

          {/* Centro */}
          <motion.div
            style={s.center}
            initial={{ opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo wrapper */}
            <div style={s.logoWrap}>

              {/* Glow pulsante atrás */}
              <motion.div
                style={s.glow}
                aria-hidden="true"
                animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.95, 1.06, 0.95] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Logo */}
              <img
                src="/favicon.webp"
                alt="QD · ItSOLUTIONS"
                style={s.logo}
                onLoad={onLogoLoad}
                draggable={false}
              />

              {/* Faixas de luz (só aparecem depois do logo carregar) */}
              {ready && (
                <div style={s.lightMask} aria-hidden="true">
                  {/* 1ª passagem — rápida */}
                  <motion.div
                    style={s.beam}
                    initial={{ left: '-35%' }}
                    animate={{ left: '135%' }}
                    transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                  />
                  {/* 2ª passagem — suave */}
                  <motion.div
                    style={{ ...s.beam, ...s.beamSoft }}
                    initial={{ left: '-35%' }}
                    animate={{ left: '135%' }}
                    transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.6 }}
                  />
                </div>
              )}

              {/* Anel pulsante */}
              <motion.div
                style={s.ring}
                aria-hidden="true"
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.07, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Wordmark */}
            <motion.p
              style={s.wordmark}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: ready ? 0.45 : 0, y: ready ? 0 : 5 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              QD · ItSOLUTIONS
            </motion.p>
          </motion.div>

          {/* Barra de progresso */}
          <div style={s.track} aria-hidden="true">
            <motion.div
              style={s.bar}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={ready ? {
                scaleX: 1,
                opacity: [0, 1, 1, 0.5],
                transition: {
                  scaleX: { duration: DURATION / 1000 - 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                  opacity: { duration: DURATION / 1000 - 0.5, times: [0, 0.05, 0.85, 1] },
                },
              } : {}}
            />
          </div>

          {/* Pontos */}
          {ready && (
            <div style={s.dots} aria-hidden="true">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  style={s.dot}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Estilos ── */
const s = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'linear-gradient(150deg, #fafafa 0%, #f2f2f7 55%, #edf0f5 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    /* Evita o flash branco: garante que o fundo não é transparente */
    willChange: 'opacity',
  },

  noise: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
    backgroundSize: '160px',
    pointerEvents: 'none',
    opacity: 0.7,
  },

  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
    position: 'relative',
    zIndex: 2,
  },

  logoWrap: {
    position: 'relative',
    width: 'clamp(130px, 18vw, 190px)',
    height: 'clamp(130px, 18vw, 190px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  glow: {
    position: 'absolute',
    inset: '-45%',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${ACCENT}1A 0%, ${ACCENT_CYAN}0D 50%, transparent 70%)`,
    filter: 'blur(28px)',
    pointerEvents: 'none',
  },

  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'relative',
    zIndex: 1,
    filter: `drop-shadow(0 4px 24px rgba(0,113,227,0.14)) drop-shadow(0 1px 4px rgba(0,0,0,0.07))`,
    userSelect: 'none',
    WebkitUserDrag: 'none',
    draggable: false,
  },

  lightMask: {
    position: 'absolute',
    inset: 0,
    borderRadius: '14px',
    overflow: 'hidden',
    zIndex: 2,
    pointerEvents: 'none',
  },

  beam: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: '30%',
    background: `linear-gradient(90deg, transparent 0%, ${ACCENT_CYAN}30 22%, rgba(255,255,255,0.88) 50%, ${ACCENT_CYAN}30 78%, transparent 100%)`,
    filter: 'blur(3px)',
    mixBlendMode: 'screen',
  },

  beamSoft: {
    width: '46%',
    background: `linear-gradient(90deg, transparent 0%, ${ACCENT}14 25%, rgba(255,255,255,0.52) 50%, ${ACCENT}14 75%, transparent 100%)`,
    filter: 'blur(7px)',
  },

  ring: {
    position: 'absolute',
    inset: '-14px',
    borderRadius: '50%',
    border: `1px solid ${ACCENT}33`,
    boxShadow: `0 0 28px ${ACCENT}1A, inset 0 0 18px ${ACCENT_CYAN}0D`,
    pointerEvents: 'none',
  },

  wordmark: {
    fontFamily: '"DM Mono", "SF Mono", monospace',
    fontSize: '10px',
    letterSpacing: '0.24em',
    color: '#1c1c1e',
    margin: 0,
    textTransform: 'uppercase',
    userSelect: 'none',
  },

  track: {
    position: 'absolute',
    bottom: '34px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'clamp(90px, 14vw, 130px)',
    height: '2px',
    borderRadius: '2px',
    background: '#d2d2d7',
    overflow: 'hidden',
  },

  bar: {
    height: '100%',
    width: '100%',
    background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_CYAN} 100%)`,
    transformOrigin: 'left center',
    borderRadius: '2px',
  },

  dots: {
    position: 'absolute',
    bottom: '14px',
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },

  dot: {
    display: 'inline-block',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: ACCENT,
  },
}