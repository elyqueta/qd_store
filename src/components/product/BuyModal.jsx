/**
 * BuyModal.jsx — QD · ItSOLUTIONS
 * Modal ao clicar "Comprar" nas secções e na página do produto.
 * Passo 1: WhatsApp ou Site?
 * Passo 2 (Site): Pessoal ou Empresa? (NIF obrigatório se empresa)
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Building2, User, AlertCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/format'

const WA_NUMBER = '244923000000'

export default function BuyModal({ product, onClose }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [step, setStep] = useState('escolha') // 'escolha' | 'tipo'
  const [tipo, setTipo] = useState('pessoal')  // 'pessoal' | 'empresa'
  const [nif, setNif] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [nifError, setNifError] = useState('')

  if (!product) return null

  const waText = encodeURIComponent(
    `Olá QD · ItSOLUTIONS! 👋\n\nQuero comprar:\n📦 *${product.name}*\n💰 ${formatPrice(product.price)}\n\nPor favor confirmem disponibilidade.`
  )

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, '_blank', 'noreferrer')
    onClose()
  }

  const handleSiteConfirm = () => {
    // Valida NIF se empresa
    if (tipo === 'empresa') {
      if (!nif.trim() || nif.replace(/\D/g, '').length < 9) {
        setNifError('NIF obrigatório para compras empresariais (mín. 9 dígitos)')
        return
      }
    }
    // Adiciona ao carrinho e vai ao checkout
    addItem(product)
    onClose()
    navigate('/checkout/dados', {
      state: {
        tipo,
        nif: tipo === 'empresa' ? nif : '',
        empresa: tipo === 'empresa' ? empresa : '',
      }
    })
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '20px',
            padding: '28px 24px', width: '100%', maxWidth: '400px',
            position: 'relative',
          }}
        >
          {/* Close */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '14px', right: '14px',
            background: '#f2f2f2', border: 'none', borderRadius: '50%',
            width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#6e6e73',
          }}>
            <X size={14} />
          </button>

          {/* Product preview */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '22px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '12px',
              overflow: 'hidden', background: '#f5f5f7', flexShrink: 0,
            }}>
              <img src={product.images?.[0]} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#1c1c1e', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.name}
              </p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0071e3', margin: '2px 0 0' }}>
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          {/* PASSO 1: Escolha canal */}
          {step === 'escolha' && (
            <>
              <p style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '16px' }}>
                Como preferes comprar?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* WhatsApp */}
                <button onClick={handleWhatsApp} style={optionStyle('#f0fdf4', '#bbf7d0')}
                  onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
                >
                  <div style={iconBox('#25D366')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#166534', margin: 0 }}>Via WhatsApp</p>
                    <p style={{ fontSize: '11px', color: '#15803d', margin: '2px 0 0' }}>Resposta rápida · Negociação directa</p>
                  </div>
                  <ArrowRight size={15} style={{ marginLeft: 'auto', color: '#16a34a' }} />
                </button>

                {/* Site */}
                <button onClick={() => setStep('tipo')} style={optionStyle('#eff6ff', '#bfdbfe')}
                  onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                  onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}
                >
                  <div style={iconBox('#0071e3')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#1e40af', margin: 0 }}>Comprar no Site</p>
                    <p style={{ fontSize: '11px', color: '#2563eb', margin: '2px 0 0' }}>Checkout seguro · Multicaixa Express</p>
                  </div>
                  <ArrowRight size={15} style={{ marginLeft: 'auto', color: '#2563eb' }} />
                </button>
              </div>
            </>
          )}

          {/* PASSO 2: Pessoal ou Empresa */}
          {step === 'tipo' && (
            <>
              <button onClick={() => { setStep('escolha'); setNifError('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e6e73', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginBottom: '16px', padding: 0 }}
              >
                <ArrowLeft size={14} /> Voltar
              </button>

              <p style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '14px' }}>
                Esta compra é para uso:
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                {[
                  { id: 'pessoal', label: 'Pessoal', Icon: User },
                  { id: 'empresa', label: 'Empresa', Icon: Building2 },
                ].map(({ id, label, Icon }) => (
                  <button key={id} onClick={() => { setTipo(id); setNifError('') }}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '12px',
                      border: `1.5px solid ${tipo === id ? '#0071e3' : '#d2d2d7'}`,
                      background: tipo === id ? '#eff6ff' : '#fff',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    }}
                  >
                    <Icon size={20} color={tipo === id ? '#0071e3' : '#aeaeb2'} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: tipo === id ? '#0071e3' : '#6e6e73' }}>{label}</span>
                  </button>
                ))}
              </div>

              {/* Campos empresa */}
              {tipo === 'empresa' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#1c1c1e', fontWeight: 500, display: 'block', marginBottom: '5px' }}>
                      Nome da empresa
                    </label>
                    <input
                      value={empresa}
                      onChange={e => setEmpresa(e.target.value)}
                      placeholder="Ex: Empresa Angola Lda"
                      style={inputStyle()}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#1c1c1e', fontWeight: 500, display: 'block', marginBottom: '5px' }}>
                      NIF <span style={{ color: '#ff3b30' }}>*</span>
                    </label>
                    <input
                      value={nif}
                      onChange={e => { setNif(e.target.value); setNifError('') }}
                      placeholder="000000000"
                      style={inputStyle(nifError)}
                    />
                    {nifError && (
                      <p style={{ fontSize: '11px', color: '#ff3b30', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={11} /> {nifError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tipo === 'pessoal' && (
                <p style={{ fontSize: '12px', color: '#aeaeb2', marginBottom: '18px' }}>
                  NIF opcional — podes adicionar no checkout se precisares de fatura.
                </p>
              )}

              <button
                onClick={handleSiteConfirm}
                style={{
                  width: '100%', padding: '13px',
                  background: '#0071e3', color: '#fff',
                  border: 'none', borderRadius: '50px',
                  fontSize: '14px', fontWeight: 500,
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#0077ed'}
                onMouseLeave={e => e.currentTarget.style.background = '#0071e3'}
              >
                Continuar para o checkout →
              </button>
            </>
          )}

          <p style={{ fontSize: '11px', color: '#d2d2d7', textAlign: 'center', marginTop: '14px' }}>
            Pagamento confirmado após validação
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── helpers de estilo ── */
function optionStyle(bg, border) {
  return {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 14px',
    background: bg, border: `1.5px solid ${border}`,
    borderRadius: '14px', cursor: 'pointer', textAlign: 'left',
    transition: 'background 0.2s', width: '100%',
  }
}

function iconBox(bg) {
  return {
    width: '38px', height: '38px', background: bg,
    borderRadius: '10px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }
}

function inputStyle(error) {
  return {
    width: '100%', border: `1px solid ${error ? '#ff3b30' : '#d2d2d7'}`,
    borderRadius: '10px', padding: '9px 13px',
    fontSize: '13px', color: '#1c1c1e',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  }
}