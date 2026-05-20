import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check, Copy, AlertCircle, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/format'
import { provincias, getMunicipios } from '@/data/angola'

const STEPS = [
  { id: 'dados', label: 'Dados' },
  { id: 'entrega', label: 'Entrega' },
  { id: 'pagamento', label: 'Pagamento' },
  { id: 'confirmacao', label: 'Confirmar' },
]

const DELIVERY = [
  { id: 'standard', label: 'Entrega Standard', desc: '5–10 dias úteis', price: 2500 },
  { id: 'express', label: 'Entrega Express', desc: '1–3 dias úteis', price: 5000 },
  { id: 'pickup', label: 'Levantamento em Loja', desc: 'Luanda — Disponível em 24h', price: 0 },
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
    desc: 'Transfira directamente para a nossa conta',
    icon: '🏛️',
    details: { banco: 'BAI — Banco Angolano de Investimentos', iban: 'AO06 0040 0000 1234 5678 9101 2', titular: 'QD ItSOLUTIONS Lda', bic: 'BAIAANLU' },
  },
]

function StepIndicator({ current }) {
  const idx = STEPS.findIndex(s => s.id === current)
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-all ${
              i < idx ? 'bg-qd-accent text-white' :
              i === idx ? 'bg-qd-dark text-white' :
              'bg-qd-border text-qd-gray'
            }`}>
              {i < idx ? <Check size={11} /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === idx ? 'text-qd-dark font-medium' : 'text-qd-gray'}`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 md:w-12 h-px mx-2 transition-all ${i < idx ? 'bg-qd-accent' : 'bg-qd-border'}`} />
          )}
        </React.Fragment>
      ))}
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

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState('dados')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [municipios, setMunicipios] = useState([])

  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', nif: '',
    provincia: '', municipio: '', bairro: '', endereco: '', referencia: '',
    delivery: 'standard',
    payment: 'multicaixa-express',
    notas: '',
  })
  const [errors, setErrors] = useState({})

  const delivery = DELIVERY.find(d => d.id === form.delivery)
  const payment = PAYMENT.find(p => p.id === form.payment)
  const deliveryCost = delivery?.price || 0
  const orderTotal = total + deliveryCost

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (form.provincia) {
      setMunicipios(getMunicipios(form.provincia))
      set('municipio', '')
    }
  }, [form.provincia])

  const validate = {
    dados: () => {
      const e = {}
      if (!form.nome.trim()) e.nome = 'Nome obrigatório'
      if (!form.email.includes('@')) e.email = 'Email inválido'
      if (form.telefone.replace(/\D/g,'').length < 9) e.telefone = 'Telefone inválido'
      setErrors(e)
      return !Object.keys(e).length
    },
    entrega: () => {
      const e = {}
      if (!form.provincia) e.provincia = 'Seleccione a província'
      if (!form.municipio) e.municipio = 'Seleccione o município'
      if (!form.bairro.trim()) e.bairro = 'Bairro obrigatório'
      if (!form.endereco.trim()) e.endereco = 'Endereço obrigatório'
      setErrors(e)
      return !Object.keys(e).length
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
          <h1 className="text-2xl font-medium text-qd-dark mb-2">Encomenda confirmada!</h1>
          <p className="text-qd-gray text-sm mb-1">Obrigado, <strong>{form.nome.split(' ')[0]}</strong>.</p>
          <p className="text-qd-gray text-sm mb-6">Receberás os dados de pagamento no WhatsApp em breve.</p>
          <div className="bg-qd-bg rounded-xl p-4 text-left mb-6 space-y-1.5 text-xs text-qd-gray">
            <p><span className="text-qd-dark font-medium">Método:</span> {payment?.label}</p>
            <p><span className="text-qd-dark font-medium">Entrega:</span> {delivery?.label}</p>
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
      <div className="bg-white border-b border-qd-border">
        <div className="max-w-[1100px] mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/" className="text-xs text-qd-gray hover:text-qd-dark flex items-center gap-1 mb-1 transition-colors">
              <ChevronRight size={12} className="rotate-180" /> Início
            </Link>
            <h1 className="text-xl font-medium text-qd-dark">Finalizar compra</h1>
          </div>
          <StepIndicator current={step} />
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* ── FORM ── */}
          <div>
            <AnimatePresence mode="wait">

              {/* STEP: DADOS PESSOAIS */}
              {step === 'dados' && (
                <motion.div key="dados" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                  <h2 className="text-base font-medium text-qd-dark mb-1">Dados pessoais</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <FieldGroup label="Nome completo *" error={errors.nome}>
                        <Input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="João Manuel da Silva" error={errors.nome} />
                      </FieldGroup>
                    </div>
                    <FieldGroup label="Email *" error={errors.email}>
                      <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="joao@email.com" error={errors.email} />
                    </FieldGroup>
                    <FieldGroup label="Telefone (+244) *" error={errors.telefone}>
                      <Input type="tel" value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="923 000 000" error={errors.telefone} />
                    </FieldGroup>
                    <div className="sm:col-span-2">
                      <FieldGroup label="NIF (opcional)">
                        <Input value={form.nif} onChange={e => set('nif', e.target.value)} placeholder="000000000" />
                      </FieldGroup>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP: ENTREGA */}
              {step === 'entrega' && (
                <motion.div key="entrega" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="space-y-4">

                  {/* Morada */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-medium text-qd-dark">Morada de entrega</h2>

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
                        <Input value={form.referencia} onChange={e => set('referencia', e.target.value)} placeholder="Ex: Próximo ao Shoprite" />
                      </FieldGroup>
                      <div className="sm:col-span-2">
                        <FieldGroup label="Endereço completo *" error={errors.endereco}>
                          <Input value={form.endereco} onChange={e => set('endereco', e.target.value)} placeholder="Rua, número, edifício..." error={errors.endereco} />
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
                            form.delivery === opt.id
                              ? 'border-qd-accent bg-qd-accent/5'
                              : 'border-qd-border hover:border-qd-accent/40'
                          }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              form.delivery === opt.id ? 'border-qd-accent' : 'border-qd-border'
                            }`}>
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

                  {/* Notas */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-base font-medium text-qd-dark mb-3">Notas da encomenda</h2>
                    <textarea
                      value={form.notas}
                      onChange={e => set('notas', e.target.value)}
                      placeholder="Instruções especiais de entrega, horário preferido..."
                      rows={3}
                      className="w-full border border-qd-border rounded-xl px-4 py-3 text-sm text-qd-dark placeholder-qd-light focus:outline-none focus:border-qd-accent transition-colors resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP: PAGAMENTO */}
              {step === 'pagamento' && (
                <motion.div key="pagamento" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-base font-medium text-qd-dark mb-4">Método de pagamento</h2>

                  <div className="space-y-3">
                    {PAYMENT.map(pm => (
                      <div key={pm.id}>
                        <label
                          className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                            form.payment === pm.id
                              ? 'border-qd-accent bg-qd-accent/5'
                              : 'border-qd-border hover:border-qd-accent/40'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                            form.payment === pm.id ? 'border-qd-accent' : 'border-qd-border'
                          }`}>
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

                        {/* Detalhes de pagamento quando selecionado */}
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
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Número</span>
                                    <span className="text-qd-dark font-medium flex items-center">{pm.details.numero}<CopyButton text={pm.details.numero} /></span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Titular</span>
                                    <span className="text-qd-dark font-medium">{pm.details.nome}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Valor</span>
                                    <span className="text-qd-accent font-semibold">{formatPrice(orderTotal)}</span>
                                  </div>
                                </>}

                                {pm.id === 'referencia' && <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Entidade</span>
                                    <span className="text-qd-dark font-medium flex items-center">{pm.details.entidade}<CopyButton text={pm.details.entidade} /></span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Referência</span>
                                    <span className="text-qd-dark font-medium flex items-center">{pm.details.referencia}<CopyButton text={pm.details.referencia} /></span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Valor exacto</span>
                                    <span className="text-qd-accent font-semibold">{formatPrice(orderTotal)}</span>
                                  </div>
                                </>}

                                {pm.id === 'transferencia' && <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Banco</span>
                                    <span className="text-qd-dark font-medium">{pm.details.banco}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">IBAN</span>
                                    <span className="text-qd-dark font-medium font-mono text-[11px] flex items-center">{pm.details.iban}<CopyButton text={pm.details.iban} /></span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Titular</span>
                                    <span className="text-qd-dark font-medium">{pm.details.titular}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-qd-gray">Valor</span>
                                    <span className="text-qd-accent font-semibold">{formatPrice(orderTotal)}</span>
                                  </div>
                                  <p className="text-qd-light pt-1 border-t border-qd-border">Após a transferência, envie o comprovativo via WhatsApp.</p>
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
                <motion.div key="confirmacao" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="space-y-4">

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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-xs space-y-2">
                      <p className="text-qd-dark font-medium mb-2 text-sm">Dados pessoais</p>
                      <p className="text-qd-gray">{form.nome}</p>
                      <p className="text-qd-gray">{form.email}</p>
                      <p className="text-qd-gray">+244 {form.telefone}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-xs space-y-2">
                      <p className="text-qd-dark font-medium mb-2 text-sm">Entrega</p>
                      <p className="text-qd-gray">{form.provincia}, {form.municipio}</p>
                      <p className="text-qd-gray">{form.bairro} — {form.endereco}</p>
                      <p className="text-qd-accent font-medium">{delivery?.label}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 text-xs col-span-full">
                      <p className="text-qd-dark font-medium mb-2 text-sm">Pagamento</p>
                      <p className="text-qd-gray">{payment?.label}</p>
                      <p className="text-qd-light text-[11px] mt-1">{payment?.desc}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex gap-2">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-amber-600" />
                    <p>Ao confirmar, receberás as instruções de pagamento via WhatsApp no número +244 {form.telefone}. A encomenda só é processada após confirmação do pagamento.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-6">
              {step !== 'dados' && (
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
                  {loading ? <><Loader2 size={15} className="animate-spin" /> A processar...</> : <><Check size={15} /> Confirmar Encomenda</>}
                </button>
              )}
            </div>
          </div>

          {/* ── ORDER SUMMARY (sidebar) ── */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
              <h3 className="text-sm font-medium text-qd-dark mb-4">Encomenda</h3>

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
                <p>✓ Garantia de 12 meses</p>
                <p>✓ Entrega em todo Angola</p>
                <p>✓ Suporte WhatsApp 24/7</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
