import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Package, Heart,
  ChevronRight, Edit2, Check, LogOut, ShoppingBag,
  Shield, Bell, CreditCard
} from 'lucide-react'

const TABS = [
  { id: 'perfil', label: 'Dados Pessoais', icon: User },
  { id: 'encomendas', label: 'Encomendas', icon: Package },
  { id: 'favoritos', label: 'Favoritos', icon: Heart },
  { id: 'pagamento', label: 'Pagamento', icon: CreditCard },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'seguranca', label: 'Segurança', icon: Shield },
]

const MOCK_ORDERS = [
  {
    id: 'QD-2026-001',
    date: '15 Mai 2026',
    status: 'Entregue',
    statusColor: 'text-green-600 bg-green-50',
    items: ['iPhone 15 Pro Max'],
    total: '750.000 Kz',
  },
  {
    id: 'QD-2026-002',
    date: '02 Mai 2026',
    status: 'Em trânsito',
    statusColor: 'text-blue-600 bg-blue-50',
    items: ['Sony WH-1000XM5', 'Apple Watch Ultra 2'],
    total: '565.000 Kz',
  },
  {
    id: 'QD-2026-003',
    date: '20 Abr 2026',
    status: 'Processando',
    statusColor: 'text-orange-600 bg-orange-50',
    items: ['MacBook Pro 16" M3 Max'],
    total: '1.850.000 Kz',
  },
]

function InputField({ label, value, onChange, type = 'text', disabled }) {
  return (
    <div>
      <label className="block text-xs font-medium text-qd-dark mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-qd-dark placeholder-qd-light focus:outline-none transition-colors bg-white ${
          disabled
            ? 'border-qd-border text-qd-gray bg-qd-bg cursor-not-allowed'
            : 'border-qd-border focus:border-qd-accent'
        }`}
      />
    </div>
  )
}

function TabDadosPessoais() {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    nome: 'João Manuel da Silva',
    email: 'joao.silva@email.com',
    telefone: '923 000 000',
    nif: '000000000',
    provincia: 'Luanda',
    municipio: 'Talatona',
    bairro: 'Talatona',
    endereco: 'Rua das Flores, nº 12',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-qd-accent/10 flex items-center justify-center text-qd-accent">
          <User size={28} />
        </div>
        <div>
          <p className="text-qd-dark font-medium">{form.nome}</p>
          <p className="text-qd-gray text-xs">{form.email}</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={`ml-auto flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-all ${
            editing ? 'bg-qd-bg text-qd-gray' : 'bg-qd-accent text-white hover:bg-qd-accent-hover'
          }`}
        >
          <Edit2 size={12} />
          {editing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <Check size={13} /> Dados guardados com sucesso!
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <InputField label="Nome completo" value={form.nome} onChange={e => set('nome', e.target.value)} disabled={!editing} />
        </div>
        <InputField label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} disabled={!editing} />
        <InputField label="Telefone (+244)" value={form.telefone} onChange={e => set('telefone', e.target.value)} disabled={!editing} />
        <InputField label="NIF" value={form.nif} onChange={e => set('nif', e.target.value)} disabled={!editing} />
        <InputField label="Província" value={form.provincia} onChange={e => set('provincia', e.target.value)} disabled={!editing} />
        <InputField label="Município" value={form.municipio} onChange={e => set('municipio', e.target.value)} disabled={!editing} />
        <InputField label="Bairro" value={form.bairro} onChange={e => set('bairro', e.target.value)} disabled={!editing} />
        <div className="sm:col-span-2">
          <InputField label="Endereço" value={form.endereco} onChange={e => set('endereco', e.target.value)} disabled={!editing} />
        </div>
      </div>

      {editing && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSave}
          className="btn-primary rounded-full px-8 py-2.5 text-sm flex items-center gap-2"
        >
          <Check size={15} /> Guardar alterações
        </motion.button>
      )}
    </div>
  )
}

function TabEncomendas() {
  return (
    <div className="space-y-4">
      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={36} className="text-qd-border mx-auto mb-3" />
          <p className="text-qd-gray text-sm">Ainda não tens encomendas.</p>
          <Link to="/catalogo" className="mt-3 text-xs text-qd-accent hover:underline inline-block">
            Ver produtos →
          </Link>
        </div>
      ) : (
        MOCK_ORDERS.map(order => (
          <div key={order.id} className="border border-qd-border rounded-xl p-4 hover:border-qd-accent/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-qd-dark font-medium text-sm">{order.id}</p>
                <p className="text-qd-gray text-xs mt-0.5">{order.date}</p>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${order.statusColor}`}>
                {order.status}
              </span>
            </div>
            <div className="text-xs text-qd-gray mb-2">
              {order.items.join(' · ')}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-qd-dark font-semibold text-sm">{order.total}</p>
              <button className="text-xs text-qd-accent hover:underline flex items-center gap-0.5">
                Ver detalhes <ChevronRight size={11} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function TabFavoritos() {
  return (
    <div className="text-center py-16">
      <Heart size={36} className="text-qd-border mx-auto mb-3" />
      <p className="text-qd-gray text-sm">Os teus produtos favoritos aparecerão aqui.</p>
      <Link to="/catalogo" className="mt-3 text-xs text-qd-accent hover:underline inline-block">
        Explorar produtos →
      </Link>
    </div>
  )
}

function TabPagamento() {
  return (
    <div className="space-y-4">
      <div className="border border-qd-border rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-qd-bg rounded-lg flex items-center justify-center text-lg">💳</div>
          <div>
            <p className="text-qd-dark text-sm font-medium">Multicaixa Express</p>
            <p className="text-qd-gray text-xs">923 000 000</p>
          </div>
          <span className="ml-auto text-[11px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Predefinido</span>
        </div>
      </div>
      <p className="text-qd-gray text-xs text-center pt-2">
        Os métodos de pagamento são selecionados durante o checkout.
      </p>
    </div>
  )
}

function TabNotificacoes() {
  const [settings, setSettings] = useState({
    encomendas: true,
    promocoes: false,
    newsletter: true,
    whatsapp: true,
  })
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }))

  const items = [
    { key: 'encomendas', label: 'Atualizações de encomendas', desc: 'Estado da entrega e confirmações' },
    { key: 'promocoes', label: 'Promoções e ofertas', desc: 'Descontos exclusivos e novidades' },
    { key: 'newsletter', label: 'Newsletter', desc: 'Últimas novidades tecnológicas' },
    { key: 'whatsapp', label: 'Notificações WhatsApp', desc: 'Receber atualizações via WhatsApp' },
  ]

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.key} className="flex items-center justify-between p-4 border border-qd-border rounded-xl">
          <div>
            <p className="text-qd-dark text-sm font-medium">{item.label}</p>
            <p className="text-qd-gray text-xs mt-0.5">{item.desc}</p>
          </div>
          <button
            onClick={() => toggle(item.key)}
            className={`w-10 h-5.5 rounded-full transition-all duration-200 flex items-center px-0.5 ${
              settings[item.key] ? 'bg-qd-accent' : 'bg-qd-border'
            }`}
            style={{ height: '22px', width: '40px' }}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              settings[item.key] ? 'translate-x-[18px]' : 'translate-x-0'
            }`} />
          </button>
        </div>
      ))}
    </div>
  )
}

function TabSeguranca() {
  const [form, setForm] = useState({ atual: '', nova: '', confirmar: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <div className="bg-qd-bg rounded-xl p-4 text-xs text-qd-gray">
        <p className="font-medium text-qd-dark mb-1">Sessão activa</p>
        <p>Luanda, Angola · Chrome · {new Date().toLocaleDateString('pt-AO')}</p>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-qd-dark">Alterar palavra-passe</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-qd-dark mb-1.5">Palavra-passe atual</label>
            <input type="password" value={form.atual} onChange={e => set('atual', e.target.value)}
              className="w-full border border-qd-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-qd-accent"
              placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-qd-dark mb-1.5">Nova palavra-passe</label>
            <input type="password" value={form.nova} onChange={e => set('nova', e.target.value)}
              className="w-full border border-qd-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-qd-accent"
              placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-qd-dark mb-1.5">Confirmar nova palavra-passe</label>
            <input type="password" value={form.confirmar} onChange={e => set('confirmar', e.target.value)}
              className="w-full border border-qd-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-qd-accent"
              placeholder="••••••••" />
          </div>
        </div>
        <button className="btn-primary rounded-full px-8 py-2.5 text-sm">
          Actualizar palavra-passe
        </button>
      </div>
    </div>
  )
}

const TAB_CONTENT = {
  perfil: TabDadosPessoais,
  encomendas: TabEncomendas,
  favoritos: TabFavoritos,
  pagamento: TabPagamento,
  notificacoes: TabNotificacoes,
  seguranca: TabSeguranca,
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('perfil')
  const ActiveComponent = TAB_CONTENT[activeTab]

  return (
    <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-qd-border">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="section-label mb-1">Conta</p>
            <h1 className="text-3xl font-medium text-qd-dark tracking-tight">O meu perfil</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

          {/* Sidebar tabs */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {TABS.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-all border-b border-qd-border/50 last:border-0 ${
                      activeTab === tab.id
                        ? 'bg-qd-accent/5 text-qd-accent font-medium'
                        : 'text-qd-gray hover:bg-qd-bg hover:text-qd-dark'
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight size={13} className="ml-auto" />}
                  </button>
                )
              })}

              {/* Logout */}
              <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-qd-red hover:bg-red-50 transition-colors mt-1">
                <LogOut size={15} />
                Terminar sessão
              </button>
            </div>
          </div>

          {/* Main content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h2 className="text-base font-medium text-qd-dark mb-5">
                  {TABS.find(t => t.id === activeTab)?.label}
                </h2>
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>  
          </div>
        </div>
      </div>
    </main>
  )
}