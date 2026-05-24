/**
 * WhatsAppButton.jsx — QD · ItSOLUTIONS
 * Botão flutuante de WhatsApp sempre visível.
 * Desaparece quando o carrinho está aberto.
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const WA_NUMBER = '244923000000'
const WA_MSG    = encodeURIComponent('Olá QD · ItSOLUTIONS! Preciso de ajuda com um produto.')

export default function WhatsAppButton() {
  const [expanded, setExpanded] = useState(false)
  const { open: cartOpen }      = useCart()

  /* Esconde se o carrinho estiver aberto */
  if (cartOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">

      {/* Tooltip / mini-menu */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-2xl border border-qd-border p-4 w-64"
          >
            <p className="text-qd-dark font-medium text-sm mb-1">Fala connosco 👋</p>
            <p className="text-qd-gray text-xs mb-4 leading-relaxed">
              Respondemos em minutos via WhatsApp. Segunda–Sábado, 8h–20h.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#1ebe5d] transition-colors w-full justify-center"
              onClick={() => setExpanded(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Iniciar conversa
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão principal */}
      <motion.button
        onClick={() => setExpanded(e => !e)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors"
        style={{ background: expanded ? '#1c1c1e' : '#25D366' }}
        aria-label="WhatsApp"
      >
        <AnimatePresence mode="wait">
          {expanded
            ? <motion.span key="x" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <X size={22} color="white" />
              </motion.span>
            : <motion.span key="wa" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  )
}