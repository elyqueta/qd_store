import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, CheckCircle2, Users, Headphones, FileText, Wrench, Star, Send, Loader2 } from 'lucide-react'
import { provincias, getMunicipios } from '@/data/angola'

const BENEFICIOS = [
  { icon: FileText,    title: 'Orçamentos com NIF',       desc: 'Proposta personalizada com faturação fiscal.' },
  { icon: Users,       title: 'Gestor de conta',           desc: 'Responsável exclusivo para a tua empresa.' },
  { icon: Star,        title: 'Preços especiais',          desc: 'Descontos a partir de 3 unidades.' },
  { icon: Wrench,      title: 'Assistência técnica',       desc: 'Suporte prioritário e manutenção preventiva.' },
  { icon: Headphones,  title: 'Suporte WhatsApp 24/7',    desc: 'Linha dedicada para empresas parceiras.' },
  { icon: Building2,   title: 'Entrega corporativa',       desc: 'Entrega em escritório no mesmo dia (Luanda).' },
]

const VOLUMES = ['1–3 unidades', '4–10 unidades', '11–30 unidades', '+30 unidades']
const CATS = ['Smartphones', 'Laptops', 'Desktops', 'Som', 'Gaming', 'Periféricos', 'Infraestrutura IT']

export default function EmpresasPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [municipios, setMunicipios] = useState([])
  const [form, setForm] = useState({
    empresa: '', nif: '', responsavel: '', email: '', telefone: '',
    provincia: '', municipio: '', sector: '', volume: '', categorias: [], mensagem: '',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleCat = (cat) => setForm(f => ({
    ...f,
    categorias: f.categorias.includes(cat) ? f.categorias.filter(c => c !== cat) : [...f.categorias, cat],
  }))

  const validate = () => {
    const e = {}
    if (!form.empresa.trim()) e.empresa = 'Obrigatório'
    if (!form.nif.trim() || form.nif.replace(/\D/g,'').length < 9) e.nif = 'NIF inválido (mín. 9 dígitos)'
    if (!form.responsavel.trim()) e.responsavel = 'Obrigatório'
    if (!form.email.includes('@')) e.email = 'Email inválido'
    if (form.telefone.replace(/\D/g,'').length < 9) e.telefone = 'Telefone inválido'
    if (!form.volume) e.volume = 'Seleccione o volume'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-medium text-qd-dark mb-2">Pedido recebido!</h1>
          <p className="text-qd-gray text-sm mb-6">
            Olá <strong>{form.responsavel.split(' ')[0]}</strong>, o nosso gestor de conta contacta-te nas próximas 2 horas úteis.
          </p>
          <div className="bg-qd-bg rounded-xl p-4 text-left mb-6 space-y-1 text-xs text-qd-gray">
            <p><span className="text-qd-dark font-medium">Empresa:</span> {form.empresa}</p>
            <p><span className="text-qd-dark font-medium">NIF:</span> {form.nif}</p>
            <p><span className="text-qd-dark font-medium">Volume:</span> {form.volume}</p>
          </div>
          <a href="/" className="btn-primary w-full justify-center block text-center rounded-full py-3">Voltar ao início</a>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)] pb-20">
      {/* Hero */}
      <div className="bg-qd-dark text-white">
        <div className="max-w-[1100px] mx-auto px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-qd-accent text-xs uppercase tracking-widest font-mono mb-2">Para Empresas</p>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              Soluções corporativas<br />à medida da tua empresa
            </h1>
            <p className="text-white/60 text-sm max-w-xl">
              Preços especiais, gestor de conta dedicado e faturação com NIF. Mais de 200 empresas equipadas em Angola.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefícios */}
      <section className="bg-white border-b border-qd-border py-14">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFICIOS.map((b, i) => (
            <motion.div key={b.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
              style={{ padding: '18px', borderRadius: '14px', background: '#f5f5f7' }}>
              <div style={{ width: '38px', height: '38px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <b.icon size={18} color="#0071e3" />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#1c1c1e', marginBottom: '4px' }}>{b.title}</p>
              <p style={{ fontSize: '13px', color: '#6e6e73', lineHeight: 1.5 }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Formulário */}
      <div className="max-w-[700px] mx-auto px-6 pt-12">
        <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#1c1c1e', marginBottom: '6px' }}>Pedir orçamento</h2>
        <p style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '28px' }}>Resposta em até 2 horas úteis.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <F label="Empresa *" error={errors.empresa}>
              <input value={form.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Nome da empresa" className={inp(errors.empresa)} />
            </F>
            <F label="NIF *" error={errors.nif}>
              <input value={form.nif} onChange={e => set('nif', e.target.value)} placeholder="000000000" className={inp(errors.nif)} />
            </F>
          </div>

          <F label="Responsável *" error={errors.responsavel}>
            <input value={form.responsavel} onChange={e => set('responsavel', e.target.value)} placeholder="Nome completo" className={inp(errors.responsavel)} />
          </F>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <F label="Email *" error={errors.email}>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="empresa@email.com" className={inp(errors.email)} />
            </F>
            <F label="Telefone *" error={errors.telefone}>
              <input type="tel" value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="923 000 000" className={inp(errors.telefone)} />
            </F>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <F label="Província">
              <select value={form.provincia} onChange={e => { set('provincia', e.target.value); setMunicipios(getMunicipios(e.target.value)); set('municipio', '') }} className={inp()}>
                <option value="">Seleccione</option>
                {provincias.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </F>
            <F label="Município">
              <select value={form.municipio} onChange={e => set('municipio', e.target.value)} className={inp()} disabled={!form.provincia}>
                <option value="">Seleccione</option>
                {municipios.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </F>
          </div>

          <F label="Volume estimado *" error={errors.volume}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {VOLUMES.map(v => (
                <button key={v} type="button" onClick={() => set('volume', v)} style={{
                  padding: '7px 14px', borderRadius: '20px',
                  border: `1.5px solid ${form.volume === v ? '#0071e3' : '#d2d2d7'}`,
                  background: form.volume === v ? '#eff6ff' : '#fff',
                  color: form.volume === v ? '#0071e3' : '#6e6e73',
                  fontSize: '13px', fontWeight: form.volume === v ? 500 : 400, cursor: 'pointer',
                }}>
                  {v}
                </button>
              ))}
            </div>
            {errors.volume && <p style={{ fontSize: '11px', color: '#ff3b30', marginTop: '4px' }}>{errors.volume}</p>}
          </F>

          <F label="Categorias de interesse">
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
              {CATS.map(cat => {
                const sel = form.categorias.includes(cat)
                return (
                  <button key={cat} type="button" onClick={() => toggleCat(cat)} style={{
                    padding: '5px 12px', borderRadius: '20px',
                    border: `1.5px solid ${sel ? '#0071e3' : '#d2d2d7'}`,
                    background: sel ? '#0071e3' : '#fff',
                    color: sel ? '#fff' : '#6e6e73',
                    fontSize: '12px', cursor: 'pointer',
                  }}>
                    {cat}
                  </button>
                )
              })}
            </div>
          </F>

          <F label="Mensagem adicional">
            <textarea value={form.mensagem} onChange={e => set('mensagem', e.target.value)}
              placeholder="Descreve os produtos, requisitos ou prazos..." rows={3}
              className={inp()} style={{ resize: 'vertical' }} />
          </F>

          <button onClick={handleSubmit} disabled={loading}
            className="btn-primary rounded-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-70">
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> A enviar...</>
              : <><Send size={14} /> Enviar pedido de orçamento</>
            }
          </button>
        </div>
      </div>
    </main>
  )
}

function F({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1c1c1e', marginBottom: '5px' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#ff3b30', marginTop: '3px' }}>{error}</p>}
    </div>
  )
}

function inp(error) {
  return [
    'w-full border rounded-lg px-3.5 py-2.5 text-sm text-qd-dark placeholder-qd-light',
    'focus:outline-none transition-colors bg-white',
    error ? 'border-red-400 focus:border-red-500' : 'border-qd-border focus:border-qd-accent',
  ].join(' ')
}