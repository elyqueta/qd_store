/**
 * CheckoutEmpresaPage.jsx — QD · ItSOLUTIONS
 * Checkout dedicado para compras empresariais.
 * Etapas: Dados Empresa → Responsável → Entrega → Pagamento → Confirmar
 */
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, Check, Copy, AlertCircle, Loader2,
  Building2, User, MapPin, CreditCard, Shield,
  Star, Percent, Headphones, FileText, Package,
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/format'
import { provincias, getMunicipios } from '@/data/angola'

/* ────────────────────────────────────────────────
   Constantes
──────────────────────────────────────────────── */
const STEPS = [
  { id: 'empresa',      label: 'Empresa',      icon: Building2 },
  { id: 'responsavel',  label: 'Responsável',   icon: User },
  { id: 'entrega',      label: 'Entrega',       icon: MapPin },
  { id: 'pagamento',    label: 'Pagamento',     icon: CreditCard },
  { id: 'confirmacao',  label: 'Confirmar',     icon: Check },
]

const DELIVERY = [
  { id: 'standard',  label: 'Entrega Standard',         desc: '5–10 dias úteis',                   price: 2500 },
  { id: 'express',   label: 'Entrega Express',           desc: '1–3 dias úteis',                    price: 5000 },
  { id: 'corp',      label: 'Entrega Corporativa Luanda', desc: 'Mesmo dia — escritório ou armazém', price: 0 },
  { id: 'pickup',    label: 'Levantamento em Loja',      desc: 'Luanda — Disponível em 24h',        price: 0 },
]

const PAYMENT = [
  {
    id: 'multicaixa-express',
    label: 'Multicaixa Express',
    desc: 'Pagamento imediato via app Multicaixa',
    icon: '💳',
    details: { numero: '923 000 000', nome: 'QD ItSOLUTIONS Lda' },
  },
  {
    id: 'referencia',
    label: 'Referência Multicaixa',
    desc: 'Pague em qualquer caixa automático ou homebanking',
    icon: '🏦',
    details: { entidade: '11333', referencia: '123 456 789', valor: 'Valor exacto da encomenda' },
  },
  {
    id: 'transferencia',
    label: 'Transferência Bancária',
    desc: 'Transfira directamente — fatura com NIF emitida automaticamente',
    icon: '🏛️',
    details: { banco: 'BAI — Banco Angolano de Investimentos', iban: 'AO06 0040 0000 1234 5678 9101 2', titular: 'QD ItSOLUTIONS Lda', bic: 'BAIAANLU' },
  },
]

/* Descontos por volume */
const VOLUME_DISCOUNTS = [
  { min: 1,  max: 2,  pct: 0,  label: '1–2 unidades',  desc: 'Preço normal' },
  { min: 3,  max: 9,  pct: 5,  label: '3–9 unidades',  desc: '5% de desconto' },
  { min: 10, max: 29, pct: 10, label: '10–29 unidades', desc: '10% de desconto' },
  { min: 30, max: Infinity, pct: 15, label: '+30 unidades', desc: '15% de desconto — negociável' },
]

const BENEFICIOS = [
  { icon: FileText,   text: 'Fatura com NIF emitida automaticamente' },
  { icon: User,       text: 'Gestor de conta dedicado' },
  { icon: Headphones, text: 'Linha de suporte prioritária 24/7' },
  { icon: Shield,     text: 'Garantia estendida para empresas' },
  { icon: Package,    text: 'Entrega corporativa mesmo dia (Luanda)' },
]

/* ────────────────────────────────────────────────
   Sub-componentes
──────────────────────────────────────────────── */
function StepIndicator({ current }) {
  const idx = STEPS.findIndex(s => s.id === current)
  return (
    <div className="flex items-center gap-0 flex-wrap">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        return (
          <React.Fragment key={s.id}>
            <div className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                i < idx  ? 'bg-qd-accent text-white' :
                i === idx ? 'bg-qd-dark text-white' :
                'bg-qd-border text-qd-gray'
              }`}>
                {i < idx ? <Check size={13} /> : <Icon size={13} />}
              </div>
              <span className={`text-xs hidden sm:block ${i === idx ? 'text-qd-dark font-medium' : 'text-qd-gray'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-5 md:w-8 h-px mx-1.5 transition-all ${i < idx ? 'bg-qd-accent' : 'bg-qd-border'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function FieldGroup({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-qd-dark mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

function Input({ error, ...props }) {
  return (
    <input
      {...props}
      className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-qd-dark placeholder-qd-light focus:outline-none transition-colors bg-white ${
        error ? 'border-red-400 focus:border-red-500' : 'border-qd-border focus:border-qd-accent'
      }`}
    />
  )
}

function Select({ error, children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-qd-dark focus:outline-none transition-colors bg-white appearance-none cursor-pointer ${
        error ? 'border-red-400 focus:border-red-500' : 'border-qd-border focus:border-qd-accent'
      }`}
    >
      {children}
    </select>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="ml-1.5 text-qd-accent hover:text-qd-accent-hover transition-colors"
      title="Copiar"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  )
}

/* ────────────────────────────────────────────────
   Página principal
──────────────────────────────────────────────── */
export default function CheckoutEmpresaPage() {
  const { items, total, clearCart } = useCart()
  const location = useLocation()
  const stateData = location.state || {}

  const [step, setStep] = useState('empresa')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [municipios, setMunicipios] = useState([])
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    /* Empresa (pré-preenchido do modal) */
    empresaNome: stateData.empresa || '',
    empresaNif:  stateData.nif    || '',
    empresaSector: '',

    /* Responsável */
    respNome: '', respEmail: '', respTelefone: '', respCargo: '',

    /* Entrega */
    provincia: '', municipio: '', bairro: '', endereco: '', referencia: '',
    delivery: 'corp',

    /* Pagamento */
    payment: 'transferencia',

    /* Notas */
    notas: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  /* Quantidade total dos itens */
  const totalQty = items.reduce((s, i) => s + i.qty, 0)

  /* Desconto por volume */
  const discount = VOLUME_DISCOUNTS.find(d => totalQty >= d.min && totalQty <= d.max) || VOLUME_DISCOUNTS[0]
  const discountAmt = Math.round(total * discount.pct / 100)
  const delivery = DELIVERY.find(d => d.id === form.delivery)
  const deliveryCost = delivery?.price || 0
  const orderTotal = total - discountAmt + deliveryCost
  const payment = PAYMENT.find(p => p.id === form.payment)

  useEffect(() => {
    if (form.provincia) {
      setMunicipios(getMunicipios(form.provincia))
      set('municipio', '')
    }
  }, [form.provincia])

  /* Validações por step */
  const validate = {
    empresa: () => {
      const e = {}
      if (!form.empresaNome.trim()) e.empresaNome = 'Nome da empresa obrigatório'
      if (!form.empresaNif.trim() || form.empresaNif.replace(/\D/g,'').length < 9) e.empresaNif = 'NIF inválido'
      setErrors(e); return !Object.keys(e).length
    },
    responsavel: () => {
      const e = {}
      if (!form.respNome.trim()) e.respNome = 'Nome obrigatório'
      if (!form.respEmail.includes('@')) e.respEmail = 'Email inválido'
      if (form.respTelefone.replace(/\D/g,'').length < 9) e.respTelefone = 'Telefone inválido'
      setErrors(e); return !Object.keys(e).length
    },
    entrega: () => {
      const e = {}
      if (!form.provincia) e.provincia = 'Seleccione a província'
      if (!form.municipio) e.municipio = 'Seleccione o município'
      if (!form.bairro.trim()) e.bairro = 'Bairro obrigatório'
      if (!form.endereco.trim()) e.endereco = 'Endereço obrigatório'
      setErrors(e); return !Object.keys(e).length
    },
    pagamento: () => true,
    confirmacao: () => true,
  }

  const nextStep = () => {
    if (!validate[step]()) return
    const idx = STEPS.findIndex(s => s.id === step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id)
  }
  const prevStep = () => {
    const idx = STEPS.findIndex(s => s.id === step)
    if (idx > 0) setStep(STEPS[idx - 1].id)
  }

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    clearCart()
    setLoading(false)
    setDone(true)
  }

  /* ── Confirmação ── */
  if (done) {
    return (
      <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center"
        >
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={26} className="text-green-600" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
            <Building2 size={12} /> Encomenda Empresarial
          </div>
          <h1 className="text-2xl font-medium text-qd-dark mb-2">Encomenda confirmada!</h1>
          <p className="text-qd-gray text-sm mb-1">Obrigado, <strong>{form.empresaNome}</strong>.</p>
          <p className="text-qd-gray text-sm mb-6">O teu gestor de conta contacta-te nas próximas 2 horas úteis.</p>
          <div className="bg-qd-bg rounded-xl p-4 text-left mb-6 space-y-1.5 text-xs text-qd-gray">
            <p><span className="text-qd-dark font-medium">Empresa:</span> {form.empresaNome}</p>
            <p><span className="text-qd-dark font-medium">NIF:</span> {form.empresaNif}</p>
            <p><span className="text-qd-dark font-medium">Responsável:</span> {form.respNome}</p>
            <p><span className="text-qd-dark font-medium">Método:</span> {payment?.label}</p>
            <p><span className="text-qd-dark font-medium">Entrega:</span> {delivery?.label}</p>
            {discount.pct > 0 && (
              <p className="text-green-600 font-medium">
                <span className="text-qd-dark font-medium">Desconto empresarial:</span> -{discount.pct}% ({formatPrice(discountAmt)})
              </p>
            )}
            <p><span className="text-qd-dark font-medium">Total:</span> {formatPrice(orderTotal)}</p>
          </div>
          <Link to="/" className="btn-primary w-full justify-center block text-center rounded-full py-3">
            Voltar ao início
          </Link>
        </motion.div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-qd-gray mb-4">O teu carrinho está vazio.</p>
          <Link to="/catalogo" className="btn-primary rounded-full px-6 py-2.5">Ver produtos</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)] pb-20">
      {/* Header */}
      <div className="bg-qd-dark text-white border-b border-white/10">
        <div className="max-w-[1100px] mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/" className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1 mb-1 transition-colors">
              <ChevronRight size={12} className="rotate-180" /> Início
            </Link>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-qd-accent" />
              <h1 className="text-xl font-medium text-white">Checkout Empresarial</h1>
            </div>
          </div>
          <StepIndicator current={step} />
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* ── FORM ── */}
          <div>
            <AnimatePresence mode="wait">

              {/* STEP: DADOS EMPRESA */}
              {step === 'empresa' && (
                <motion.div key="empresa"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Benefícios */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-2xl p-5">
                    <p className="text-sm font-medium text-qd-dark mb-3 flex items-center gap-2">
                      <Star size={14} className="text-qd-accent" /> Vantagens da conta empresarial
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BENEFICIOS.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-qd-gray">
                          <b.icon size={13} className="text-qd-accent flex-shrink-0" />
                          {b.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desconto por volume */}
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <p className="text-sm font-medium text-qd-dark mb-3 flex items-center gap-2">
                      <Percent size={14} className="text-green-600" /> Desconto por volume
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {VOLUME_DISCOUNTS.map((d, i) => (
                        <div key={i} className={`rounded-xl p-3 text-center border ${
                          totalQty >= d.min && totalQty <= d.max
                            ? 'border-green-300 bg-green-50'
                            : 'border-qd-border bg-qd-bg'
                        }`}>
                          <p className={`text-xs font-medium mb-0.5 ${totalQty >= d.min && totalQty <= d.max ? 'text-green-700' : 'text-qd-dark'}`}>
                            {d.label}
                          </p>
                          <p className={`text-lg font-bold ${d.pct > 0 ? 'text-green-600' : 'text-qd-gray'}`}>
                            {d.pct > 0 ? `-${d.pct}%` : '—'}
                          </p>
                          <p className="text-[10px] text-qd-gray">{d.desc}</p>
                        </div>
                      ))}
                    </div>
                    {discount.pct > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
                        <Check size={12} /> Desconto de {discount.pct}% aplicado — poupas {formatPrice(discountAmt)}
                      </p>
                    )}
                  </div>

                  {/* Dados da empresa */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-medium text-qd-dark">Dados da empresa</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FieldGroup label="Nome da empresa *" error={errors.empresaNome}>
                          <Input value={form.empresaNome} onChange={e => set('empresaNome', e.target.value)} placeholder="Empresa Angola Lda" error={errors.empresaNome} />
                        </FieldGroup>
                      </div>
                      <FieldGroup label="NIF da empresa *" error={errors.empresaNif}>
                        <Input value={form.empresaNif} onChange={e => set('empresaNif', e.target.value)} placeholder="000000000" error={errors.empresaNif} />
                      </FieldGroup>
                      <FieldGroup label="Sector de actividade">
                        <Input value={form.empresaSector} onChange={e => set('empresaSector', e.target.value)} placeholder="Ex: Construção, Saúde, Educação…" />
                      </FieldGroup>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP: DADOS DO RESPONSÁVEL */}
              {step === 'responsavel' && (
                <motion.div key="responsavel"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm p-6 space-y-5"
                >
                  <h2 className="text-base font-medium text-qd-dark flex items-center gap-2">
                    <User size={16} className="text-qd-accent" /> Dados do responsável
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <FieldGroup label="Nome completo *" error={errors.respNome}>
                        <Input value={form.respNome} onChange={e => set('respNome', e.target.value)} placeholder="João Manuel da Silva" error={errors.respNome} />
                      </FieldGroup>
                    </div>
                    <FieldGroup label="Email *" error={errors.respEmail}>
                      <Input type="email" value={form.respEmail} onChange={e => set('respEmail', e.target.value)} placeholder="joao@empresa.ao" error={errors.respEmail} />
                    </FieldGroup>
                    <FieldGroup label="Contacto (+244) *" error={errors.respTelefone}>
                      <Input type="tel" value={form.respTelefone} onChange={e => set('respTelefone', e.target.value)} placeholder="923 000 000" error={errors.respTelefone} />
                    </FieldGroup>
                    <div className="sm:col-span-2">
                      <FieldGroup label="Cargo / Função">
                        <Input value={form.respCargo} onChange={e => set('respCargo', e.target.value)} placeholder="Ex: Director de TI, Gestor de Compras…" />
                      </FieldGroup>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP: ENTREGA */}
              {step === 'entrega' && (
                <motion.div key="entrega"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-medium text-qd-dark flex items-center gap-2">
                      <MapPin size={16} className="text-qd-accent" /> Morada da empresa / entrega
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldGroup label="Província *" error={errors.provincia}>
                        <Select value={form.provincia} onChange={e => set('provincia', e.target.value)} error={errors.provincia}>
                          <option value="">Seleccione a província</option>
                          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                      </FieldGroup>
                      <FieldGroup label="Município *" error={errors.municipio}>
                        <Select value={form.municipio} onChange={e => set('municipio', e.target.value)} error={errors.municipio} disabled={!form.provincia}>
                          <option value="">Seleccione o município</option>
                          {municipios.map(m => <option key={m} value={m}>{m}</option>)}
                        </Select>
                      </FieldGroup>
                      <FieldGroup label="Bairro *" error={errors.bairro}>
                        <Input value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Ex: Talatona" error={errors.bairro} />
                      </FieldGroup>
                      <FieldGroup label="Ponto de referência">
                        <Input value={form.referencia} onChange={e => set('referencia', e.target.value)} placeholder="Ex: Edifício Movicel, piso 3" />
                      </FieldGroup>
                      <div className="sm:col-span-2">
                        <FieldGroup label="Endereço completo *" error={errors.endereco}>
                          <Input value={form.endereco} onChange={e => set('endereco', e.target.value)} placeholder="Rua, número, edifício, escritório…" error={errors.endereco} />
                        </FieldGroup>
                      </div>
                    </div>
                  </div>

                  {/* Tipo de entrega */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-base font-medium text-qd-dark mb-4">Tipo de entrega</h2>
                    <div className="space-y-2">
                      {DELIVERY.map(opt => (
                        <label key={opt.id}
                          className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                            form.delivery === opt.id ? 'border-qd-accent bg-qd-accent/5' : 'border-qd-border hover:border-qd-accent/40'
                          }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.delivery === opt.id ? 'border-qd-accent' : 'border-qd-border'}`}>
                              {form.delivery === opt.id && <div className="w-2 h-2 rounded-full bg-qd-accent" />}
                            </div>
                            <div>
                              <p className="text-qd-dark text-sm font-medium">{opt.label}</p>
                              <p className="text-qd-gray text-xs">{opt.desc}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${opt.price === 0 ? 'text-green-600' : 'text-qd-dark'}`}>
                            {opt.price === 0 ? 'Grátis' : formatPrice(opt.price)}
                          </span>
                          <input type="radio" name="delivery" value={opt.id} checked={form.delivery === opt.id} onChange={() => set('delivery', opt.id)} className="hidden" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="text-base font-medium text-qd-dark mb-3">Notas adicionais</h2>
                    <textarea
                      value={form.notas}
                      onChange={e => set('notas', e.target.value)}
                      placeholder="Instruções especiais, horário de recepção, contacto da portaria…"
                      rows={3}
                      className="w-full border border-qd-border rounded-xl px-4 py-3 text-sm text-qd-dark placeholder-qd-light focus:outline-none focus:border-qd-accent transition-colors resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP: PAGAMENTO */}
              {step === 'pagamento' && (
                <motion.div key="pagamento"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <h2 className="text-base font-medium text-qd-dark mb-4 flex items-center gap-2">
                    <CreditCard size={16} className="text-qd-accent" /> Método de pagamento
                  </h2>
                  <div className="space-y-3">
                    {PAYMENT.map(pm => (
                      <div key={pm.id}>
                        <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                          form.payment === pm.id ? 'border-qd-accent bg-qd-accent/5' : 'border-qd-border hover:border-qd-accent/40'
                        }`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${form.payment === pm.id ? 'border-qd-accent' : 'border-qd-border'}`}>
                            {form.payment === pm.id && <div className="w-2 h-2 rounded-full bg-qd-accent" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{pm.icon}</span>
                              <p className="text-qd-dark text-sm font-medium">{pm.label}</p>
                            </div>
                            <p className="text-qd-gray text-xs mt-0.5">{pm.desc}</p>
                          </div>
                          <input type="radio" name="payment" value={pm.id} checked={form.payment === pm.id} onChange={() => set('payment', pm.id)} className="hidden" />
                        </label>

                        <AnimatePresence>
                          {form.payment === pm.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 ml-8 bg-qd-bg rounded-xl p-4 text-xs space-y-2">
                                {pm.id === 'multicaixa-express' && <>
                                  <div className="flex justify-between"><span className="text-qd-gray">Número</span><span className="text-qd-dark font-medium flex items-center">{pm.details.numero}<CopyButton text={pm.details.numero} /></span></div>
                                  <div className="flex justify-between"><span className="text-qd-gray">Titular</span><span className="text-qd-dark font-medium">{pm.details.nome}</span></div>
                                  <div className="flex justify-between"><span className="text-qd-gray">Valor</span><span className="text-qd-accent font-semibold">{formatPrice(orderTotal)}</span></div>
                                </>}
                                {pm.id === 'referencia' && <>
                                  <div className="flex justify-between"><span className="text-qd-gray">Entidade</span><span className="text-qd-dark font-medium flex items-center">{pm.details.entidade}<CopyButton text={pm.details.entidade} /></span></div>
                                  <div className="flex justify-between"><span className="text-qd-gray">Referência</span><span className="text-qd-dark font-medium flex items-center">{pm.details.referencia}<CopyButton text={pm.details.referencia} /></span></div>
                                  <div className="flex justify-between"><span className="text-qd-gray">Valor exacto</span><span className="text-qd-accent font-semibold">{formatPrice(orderTotal)}</span></div>
                                </>}
                                {pm.id === 'transferencia' && <>
                                  <div className="flex justify-between"><span className="text-qd-gray">Banco</span><span className="text-qd-dark font-medium">{pm.details.banco}</span></div>
                                  <div className="flex justify-between"><span className="text-qd-gray">IBAN</span><span className="text-qd-dark font-medium font-mono text-[11px] flex items-center">{pm.details.iban}<CopyButton text={pm.details.iban} /></span></div>
                                  <div className="flex justify-between"><span className="text-qd-gray">Titular</span><span className="text-qd-dark font-medium">{pm.details.titular}</span></div>
                                  <div className="flex justify-between"><span className="text-qd-gray">Valor</span><span className="text-qd-accent font-semibold">{formatPrice(orderTotal)}</span></div>
                                  <p className="text-qd-light pt-1 border-t border-qd-border">Fatura com NIF emitida após confirmação. Envie o comprovativo via WhatsApp.</p>
                                </>}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP: CONFIRMAÇÃO */}
              {step === 'confirmacao' && (
                <motion.div key="confirmacao"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Itens */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-base font-medium text-qd-dark mb-4">Resumo da encomenda</h2>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-qd-bg flex-shrink-0">
                            <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-qd-dark text-sm font-medium truncate">{item.name}</p>
                            <p className="text-qd-gray text-xs">Qtd: {item.qty} × {formatPrice(item.price)}</p>
                          </div>
                          <p className="text-qd-dark text-sm font-medium">{formatPrice(item.price * item.qty)}</p>
                        </div>
                      ))}
                    </div>
                    {discount.pct > 0 && (
                      <div className="mt-4 pt-3 border-t border-qd-border flex items-center gap-2 text-xs text-green-600 font-medium">
                        <Percent size={12} /> Desconto empresarial de {discount.pct}%: -{formatPrice(discountAmt)}
                      </div>
                    )}
                  </div>

                  {/* Resumo dados */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-xs space-y-1.5">
                      <p className="text-qd-dark font-medium mb-2 text-sm flex items-center gap-1.5"><Building2 size={13} className="text-qd-accent" /> Empresa</p>
                      <p className="text-qd-gray">{form.empresaNome}</p>
                      <p className="text-qd-gray">NIF: {form.empresaNif}</p>
                      {form.empresaSector && <p className="text-qd-gray">{form.empresaSector}</p>}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-xs space-y-1.5">
                      <p className="text-qd-dark font-medium mb-2 text-sm flex items-center gap-1.5"><User size={13} className="text-qd-accent" /> Responsável</p>
                      <p className="text-qd-gray">{form.respNome}</p>
                      <p className="text-qd-gray">{form.respEmail}</p>
                      <p className="text-qd-gray">+244 {form.respTelefone}</p>
                      {form.respCargo && <p className="text-qd-gray">{form.respCargo}</p>}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-xs col-span-full space-y-1.5">
                      <p className="text-qd-dark font-medium mb-2 text-sm flex items-center gap-1.5"><MapPin size={13} className="text-qd-accent" /> Entrega</p>
                      <p className="text-qd-gray">{form.provincia}, {form.municipio} — {form.bairro}</p>
                      <p className="text-qd-gray">{form.endereco}</p>
                      <p className="text-qd-accent font-medium">{delivery?.label}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex gap-2">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-amber-600" />
                    <p>Ao confirmar, o teu gestor de conta contacta-te nas próximas 2 horas úteis com a fatura e instruções de pagamento com NIF: <strong>{form.empresaNif}</strong>.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-6">
              {step !== 'empresa' && (
                <button onClick={prevStep} className="btn-outline rounded-full px-6 py-2.5 text-sm">
                  Voltar
                </button>
              )}
              {step !== 'confirmacao' ? (
                <button onClick={nextStep} className="btn-primary rounded-full px-8 py-2.5 text-sm ml-auto flex items-center gap-1.5">
                  Continuar <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="btn-primary rounded-full px-8 py-2.5 text-sm ml-auto flex items-center gap-2 disabled:opacity-70"
                >
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> A processar...</>
                    : <><Check size={15} /> Confirmar Encomenda Empresarial</>
                  }
                </button>
              )}
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={14} className="text-qd-accent" />
                <h3 className="text-sm font-medium text-qd-dark">Encomenda Empresarial</h3>
              </div>

              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-qd-bg flex-shrink-0">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-qd-gray rounded-full text-white text-[10px] flex items-center justify-center font-medium">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-qd-dark text-xs font-medium truncate">{item.name}</p>
                      <p className="text-qd-gray text-[11px]">{formatPrice(item.price)}</p>
                    </div>
                    <p className="text-qd-dark text-xs font-medium">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-qd-border pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-qd-gray">
                  <span>Subtotal</span><span>{formatPrice(total)}</span>
                </div>
                {discount.pct > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Desconto -{discount.pct}%</span><span>-{formatPrice(discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-qd-gray">
                  <span>Entrega</span>
                  <span className={deliveryCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryCost === 0 ? 'Grátis' : formatPrice(deliveryCost)}
                  </span>
                </div>
                <div className="flex justify-between text-qd-dark font-semibold text-sm pt-2 border-t border-qd-border">
                  <span>Total</span><span>{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-qd-border text-[11px] text-qd-light space-y-1">
                <p className="text-qd-accent font-medium text-[12px]">✓ Fatura com NIF incluída</p>
                <p>✓ Gestor de conta dedicado</p>
                <p>✓ Suporte prioritário 24/7</p>
                <p>✓ Garantia 12 meses</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}