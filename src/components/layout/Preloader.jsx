import { motion, AnimatePresence } from 'framer-motion'
import { usePreloader } from '@/contexts/PreloaderContext'

export default function Preloader() {
  const { isLoading, isExiting } = usePreloader()

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Fundo com efeito de blur suave */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95" />

          {/* Conteúdo centralizado */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-12">
            {/* Container do logo com efeitos */}
            <motion.div
              className="relative w-32 h-32 md:w-40 md:h-40"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
            >
              {/* Glow background suave */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-transparent blur-3xl"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Logo */}
              <motion.img
                src="/favicon.webp"
                alt="QD Loading"
                className="relative w-full h-full object-contain drop-shadow-2xl"
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(0, 150, 255, 0))',
                    'drop-shadow(0 0 40px rgba(0, 150, 255, 0.4))',
                    'drop-shadow(0 0 20px rgba(0, 150, 255, 0))',
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Faixa de luz horizontal atravessando o logo */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  style={{
                    filter: 'blur(8px)',
                    boxShadow: '0 0 30px rgba(0, 200, 255, 0.6)',
                  }}
                  animate={{
                    left: ['-25%', '125%'],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 1.5,
                  }}
                />
              </motion.div>

              {/* Reflexo/glow dinâmico azul */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 180, 255, 0.15) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Anel de luz externo */}
              <motion.div
                className="absolute -inset-4 rounded-full border border-cyan-500/30"
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  boxShadow: [
                    '0 0 20px rgba(0, 200, 255, 0.2)',
                    '0 0 50px rgba(0, 150, 255, 0.5)',
                    '0 0 20px rgba(0, 200, 255, 0.2)',
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Texto "CARREGANDO" */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-white/50 text-xs md:text-sm font-mono tracking-[0.2em] font-light">
                CARREGANDO
              </p>

              {/* Pontos animados */}
              <div className="flex gap-2 items-center h-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-cyan-500/60 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Efeito de partículas leves (opcional) */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-cyan-400/40 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [0, -50],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
