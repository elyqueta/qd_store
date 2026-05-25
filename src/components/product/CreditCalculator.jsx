/**
 * CreditCalculator.jsx — QD · ItSOLUTIONS
 * Calculadora de crédito em Kwanzas com prestações mensais.
 * Pode ser usada como componente standalone ou no ProductPage.
 */
import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Info } from 'lucide-react'
import { formatPrice } from '@/utils/format'

const PRAZO_OPTIONS = [3, 6, 9, 12, 18, 24]
const TAXA_ANUAL = 0.18 // 18% ao ano (taxa referência Angola)

export default function CreditCalculator({ initialPrice = 0, compact = false }) {
  const [preco, setPreco] = useState(initialPrice || 500000)
  const [entrada, setEntrada] = useState(20)   // % de entrada
  const [prazo, setPrazo] = useState(12)
  const [open, setOpen] = useState(!compact)

  const { prestacao, totalPagar, jurosTotal, valorFinanciado } = useMemo(() => {
    const entradaVal = (entrada / 100) * preco
    const financiado = preco - entradaVal
    const taxaMensal = TAXA_ANUAL / 12
    const n = prazo
    const prestacao = financiado * (taxaMensal * Math.pow(1 + taxaMensal, n)) / (Math.pow(1 + taxaMensal, n) - 1)
    const totalPagar = prestacao * n + entradaVal
    const jurosTotal = totalPagar - preco
    return {
      prestacao: Math.round(prestacao),
      totalPagar: Math.round(totalPagar),
      jurosTotal: Math.round(jurosTotal),
      valorFinanciado: Math.round(financiado),
    }
  }, [preco, entrada, prazo])

  if (compact && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          cursor: 'pointer',
          width: '100%',
          fontSize: '13px',
          color: '#0c4a6e',
          fontWeight: 500,
        }}
      >
        <Calculator size={16} />
        Calcular prestações mensais
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #d2d2d7',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={18} color="#0071e3" />
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#1c1c1e', margin: 0 }}>Calculadora de Crédito</p>
        </div>
        {compact && (
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aeaeb2', fontSize: '12px' }}>
            fechar
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Preço (só editável se não vier initialPrice) */}
        {!initialPrice && (
          <div>
            <label style={{ fontSize: '12px', color: '#6e6e73', display: 'block', marginBottom: '6px' }}>
              Valor do produto (Kz)
            </label>
            <input
              type="number"
              value={preco}
              onChange={e => setPreco(Number(e.target.value))}
              step={10000}
              style={{
                width: '100%',
                border: '1px solid #d2d2d7',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '14px',
                color: '#1c1c1e',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* Entrada */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', color: '#6e6e73' }}>Entrada</label>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#0071e3' }}>
              {entrada}% — {formatPrice(Math.round(preco * entrada / 100))}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={70}
            step={5}
            value={entrada}
            onChange={e => setEntrada(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0071e3' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#aeaeb2', marginTop: '2px' }}>
            <span>0%</span><span>70%</span>
          </div>
        </div>

        {/* Prazo */}
        <div>
          <label style={{ fontSize: '12px', color: '#6e6e73', display: 'block', marginBottom: '8px' }}>Prazo</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {PRAZO_OPTIONS.map(p => (
              <button
                key={p}
                onClick={() => setPrazo(p)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: `1.5px solid ${prazo === p ? '#0071e3' : '#d2d2d7'}`,
                  background: prazo === p ? '#eff6ff' : '#fff',
                  color: prazo === p ? '#0071e3' : '#6e6e73',
                  fontSize: '12px',
                  fontWeight: prazo === p ? 500 : 400,
                  cursor: 'pointer',
                }}
              >
                {p}m
              </button>
            ))}
          </div>
        </div>

        {/* Resultado */}
        <div style={{
          background: '#f5f5f7',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '4px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#6e6e73', margin: 0 }}>Prestação mensal</p>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#0071e3', margin: '2px 0 0' }}>
                {formatPrice(prestacao)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '11px', color: '#6e6e73', margin: 0 }}>durante {prazo} meses</p>
              <p style={{ fontSize: '12px', color: '#aeaeb2', margin: '2px 0 0' }}>+ entrada {formatPrice(Math.round(preco * entrada / 100))}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #d2d2d7', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '11px', color: '#6e6e73' }}>
              <div>Financiado: <strong style={{ color: '#1c1c1e' }}>{formatPrice(valorFinanciado)}</strong></div>
              <div>Juros totais: <strong style={{ color: '#ff3b30' }}>{formatPrice(jurosTotal)}</strong></div>
            </div>
            <div style={{ fontSize: '11px', color: '#6e6e73', textAlign: 'right' }}>
              <div>Total a pagar:</div>
              <strong style={{ fontSize: '13px', color: '#1c1c1e' }}>{formatPrice(totalPagar)}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <Info size={12} style={{ color: '#aeaeb2', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '11px', color: '#aeaeb2', margin: 0, lineHeight: 1.4 }}>
            Simulação indicativa com taxa de referência de 18% ao ano. Condições sujeitas a aprovação de crédito.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
