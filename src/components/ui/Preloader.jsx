/**
 * Preloader.jsx — QD · ItSOLUTIONS
 *
 * Preloader premium cinematográfico para a página inicial.
 * Aparece apenas no primeiro carregamento do site.
 *
 * Efeitos:
 *  - Fundo claro premium com blur suave
 *  - Logo centralizado com entrada suave
 *  - Faixa de luz horizontal (leitura óptica futurista)
 *  - Glow azul elétrico/ciano durante a passagem da luz
 *  - Barra de progresso minimal
 *  - Saída com fade + scale elegante
 */

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { usePreloader } from '@/contexts/PreloaderContext'

/* ─────────────────────────────────────────────
   Duração total do preloader em ms
────────────────────────────────────────────── */
const TOTAL_DURATION = 2800

/* ─────────────────────────────────────────────
   Variantes Framer Motion
────────────────────────────────────────────── */
const backdropVariants = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.65,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.1,
    },
  },
}

const logoVariants = {
  initial: { opacity: 0, scale: 0.88, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
}

const progressVariants = {
  initial: { scaleX: 0, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: [0, 1, 1, 0.6],
    transition: {
      scaleX: { duration: TOTAL_DURATION / 1000 - 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
      opacity: { duration: TOTAL_DURATION / 1000 - 0.4, times: [0, 0.05, 0.85, 1] },
    },
  },
}

/* ─────────────────────────────────────────────
   Componente principal
────────────────────────────────────────────── */
export default function Preloader() {
  const { isVisible, hideLoader } = usePreloader()
  const [logoReady, setLogoReady] = useState(false)
  const logoControls = useAnimation()
  const timerRef = useRef(null)

  /* Inicia sequência de animação assim que o logo carrega */
  useEffect(() => {
    if (!isVisible) return

    timerRef.current = setTimeout(() => {
      hideLoader()
    }, TOTAL_DURATION)

    return () => clearTimeout(timerRef.current)
  }, [isVisible, hideLoader])

  /* Quando o logo carrega, dispara animação */
  const handleLogoLoad = () => {
    setLogoReady(true)
    logoControls.start('animate')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="qd-preloader"
          variants={backdropVariants}
          initial="initial"
          exit="exit"
          style={styles.backdrop}
          aria-label="A carregar QD · ItSOLUTIONS"
          role="status"
          aria-live="polite"
        >
          {/* ── Ruído de fundo subtil ── */}
          <div style={styles.noise} />

          {/* ── Container central ── */}
          <div style={styles.center}>

            {/* ── Logo wrapper com efeito de luz ── */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate={logoControls}
              exit="exit"
              style={styles.logoWrapper}
            >
              {/* Glow ambiente atrás do logo */}
              <motion.div
                style={styles.ambientGlow}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Logo da marca */}
              <img
                src="/favicon.webp"
                alt="QD · ItSOLUTIONS"
                onLoad={handleLogoLoad}
                style={styles.logo}
                draggable={false}
              />

              {/* ── Faixa de luz que atravessa o logo ── */}
              {logoReady && (
                <div style={styles.lightMaskOuter} aria-hidden="true">
                  {/* Primeira passagem — rápida e brilhante */}
                  <motion.div
                    style={styles.lightBeam}
                    initial={{ left: '-30%' }}
                    animate={{ left: '130%' }}
                    transition={{
                      duration: 0.9,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.6,
                    }}
                  />
                  {/* Segunda passagem — mais lenta e suave */}
                  <motion.div
                    style={{ ...styles.lightBeam, ...styles.lightBeamSoft }}
                    initial={{ left: '-30%' }}
                    animate={{ left: '130%' }}
                    transition={{
                      duration: 1.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 1.7,
                    }}
                  />
                </div>
              )}

              {/* Anel de luz externo pulsante */}
              <motion.div
                style={styles.outerRing}
                animate={{
                  opacity: [0.15, 0.45, 0.15],
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                aria-hidden="true"
              />
            </motion.div>

            {/* ── Wordmark / label ── */}
            <motion.p
              style={styles.wordmark}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: logoReady ? 0.45 : 0, y: logoReady ? 0 : 6 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              QD · ItSOLUTIONS
            </motion.p>
          </div>

          {/* ── Barra de progresso bottom ── */}
          <div style={styles.progressTrack} aria-hidden="true">
            <motion.div
              style={styles.progressBar}
              variants={progressVariants}
              initial="initial"
              animate={logoReady ? 'animate' : 'initial'}
            />
          </div>

          {/* ── Pontos de carregamento ── */}
          <motion.div
            style={styles.dotsRow}
            initial={{ opacity: 0 }}
            animate={{ opacity: logoReady ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            aria-hidden="true"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={styles.dot}
                animate={{
                  opacity: [0.25, 1, 0.25],
                  scale: [0.85, 1.15, 0.85],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────
   Estilos em JS (sem dependência de CSS externo)
   Modo claro premium — paleta cinza quente
────────────────────────────────────────────── */
const ACCENT = '#0071e3'      /* azul primário da marca */
const ACCENT_CYAN = '#00b4d8' /* ciano elétrico para a luz */

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    /* Fundo claro premium — quase branco com leve tom frio */
    background: 'linear-gradient(160deg, #fafafa 0%, #f2f2f7 50%, #eef0f4 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  /* Textura de ruído muito subtil */
  noise: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'repeat',
    backgroundSize: '180px',
    pointerEvents: 'none',
    opacity: 0.6,
  },

  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    position: 'relative',
    zIndex: 2,
  },

  logoWrapper: {
    position: 'relative',
    width: 'clamp(120px, 20vw, 180px)',
    height: 'clamp(120px, 20vw, 180px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Glow difuso atrás do logo */
  ambientGlow: {
    position: 'absolute',
    inset: '-40%',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${ACCENT}18 0%, ${ACCENT_CYAN}0a 50%, transparent 70%)`,
    filter: 'blur(24px)',
    pointerEvents: 'none',
  },

  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'relative',
    zIndex: 1,
    /* Sombra suave para profundidade */
    filter: 'drop-shadow(0 4px 24px rgba(0,113,227,0.12)) drop-shadow(0 1px 3px rgba(0,0,0,0.06))',
    userSelect: 'none',
    WebkitUserDrag: 'none',
  },

  /* Máscara que limita a luz à área do logo */
  lightMaskOuter: {
    position: 'absolute',
    inset: 0,
    borderRadius: '12px',
    overflow: 'hidden',
    zIndex: 2,
    pointerEvents: 'none',
  },

  /* Faixa de luz principal */
  lightBeam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '28%',
    background: `linear-gradient(
      90deg,
      transparent 0%,
      ${ACCENT_CYAN}28 20%,
      rgba(255,255,255,0.82) 50%,
      ${ACCENT_CYAN}28 80%,
      transparent 100%
    )`,
    filter: 'blur(3px)',
    mixBlendMode: 'screen',
  },

  /* Passagem suave secundária — mais larga e difusa */
  lightBeamSoft: {
    width: '42%',
    background: `linear-gradient(
      90deg,
      transparent 0%,
      ${ACCENT}12 25%,
      rgba(255,255,255,0.55) 50%,
      ${ACCENT}12 75%,
      transparent 100%
    )`,
    filter: 'blur(6px)',
  },

  /* Anel externo pulsante */
  outerRing: {
    position: 'absolute',
    inset: '-12px',
    borderRadius: '50%',
    border: `1px solid ${ACCENT}30`,
    boxShadow: `0 0 24px ${ACCENT}18, inset 0 0 16px ${ACCENT_CYAN}0a`,
    pointerEvents: 'none',
  },

  wordmark: {
    fontFamily: '"DM Mono", "SF Mono", monospace',
    fontSize: '10px',
    letterSpacing: '0.22em',
    color: '#1c1c1e',
    margin: 0,
    textTransform: 'uppercase',
    userSelect: 'none',
  },

  /* Barra de progresso */
  progressTrack: {
    position: 'absolute',
    bottom: '36px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'clamp(80px, 12vw, 120px)',
    height: '2px',
    borderRadius: '2px',
    background: '#d2d2d7',
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    width: '100%',
    background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_CYAN} 100%)`,
    transformOrigin: 'left center',
    borderRadius: '2px',
  },

  /* Pontos de carregamento */
  dotsRow: {
    position: 'absolute',
    bottom: '16px',
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