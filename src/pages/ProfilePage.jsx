import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Package, Heart, ChevronRight, Edit2, Check,
  LogOut, ShoppingBag, Shield, Bell, CreditCard, X, Trash2
} from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useNotification } from '@/contexts/NotificationContext'
import { formatPrice } from '@/utils/format'
import BuyModal from '@/components/product/BuyModal'

const TABS = [
  { id: 'perfil',        label: 'Dados Pessoais',  icon: User },
  { id: 'encomendas',    label: 'Encomendas',       icon: Package },
  { id: 'favoritos',     label: 'Favoritos',        icon: Heart },
  { id: 'pagamento',     label: 'Pagamento',        icon: CreditCard },
  { id: 'notificacoes',  label: 'Notificações',     icon: Bell },
  { id: 'seguranca',     label: 'Segurança',        icon: Shield },
]

const MOCK_ORDERS = [
  {
    id: 'QD-2026-001', date: '15 Mai 2026', status: 'Entregue',
    statusColor: 'text-green-600 bg-green-50',
    items: ['iPhone 15 Pro Max'], total: '750.000 Kz',
  },
  {
    id: 'QD-2026-002', date: '02 Mai 2026', status: 'Em trânsito',
    statusColor: 'text-blue-600 bg-blue-50',
    items: ['Sony WH-1000XM5', 'Apple Watch Ultra 2'], total: '565.000 Kz',
  },
  {
    id: 'QD-2026-003', date: '20 Abr 2026', status: 'Processando',
    statusColor: 'text-orange-600 bg-orange-50',
    items: ['MacBook Pro 16" M3 Max'], total: '1.850.000 Kz',
  },
]

/* ── Tab: Dados pessoais ── */
function TabDadosPessoais() {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved]     = useState(false)
  const [form, setForm]       = useState({
    nome: 'João Manuel da Silva', email: 'joao.silva@email.com',
    telefone: '923 000 000', nif: '',
    provincia: 'Luanda', municipio: 'Talatona',
    bairro: 'Talatona', endereco: 'Rua das Flores, nº 12',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-qd-accent/10 flex items-center justify-center text-qd-accent">
          <User size={28} />
        </div>
        <div>
          <p className="text-qd-dark font-medium">{form.nome}</p>
          <p className="text-qd-gray text-xs">{form.email}</p>
        </div>
        <button onClick={() => setEditing(!editing)}
          className={`ml-auto flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-all ${editing ? 'bg-qd-bg text-qd-gray' : 'bg-qd-accent text-white hover:bg-qd-accent-hover'}`}>
          <Edit2 size={12} />{editing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={13} /> Dados guardados com sucesso!
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ['Nome completo', 'nome', 'text', 'João Manuel da Silva'],
          ['Email', 'email', 'email', 'joao@email.com'],
          ['Telefone (+244)', 'telefone', 'tel', '923 000 000'],
          ['NIF (opcional)', 'nif', 'text', '000000000'],
          ['Província', 'provincia', 'text', 'Luanda'],
          ['Município', 'municipio', 'text', 'Talatona'],
          ['Bairro', 'bairro', 'text', 'Talatona'],
        ].map(([label, key, type, ph], i) => (
          <div key={key} className={i === 6 ? 'sm:col-span-2' : ''}>
            <label className="block text-xs font-medium text-qd-dark mb-1.5">{label}</label>
            <input type={type} value={form[key]} placeholder={ph}
              onChange={e => set(key, e.target.value)} disabled={!editing}
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-colors ${editing ? 'border-qd-border focus:border-qd-accent bg-white' : 'border-qd-border bg-qd-bg text-qd-gray cursor-not-allowed'}`}
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-qd-dark mb-1.5">Endereço completo</label>
          <input value={form.endereco} placeholder="Rua, número..."
            onChange={e => set('endereco', e.target.value)} disabled={!editing}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-colors ${editing ? 'border-qd-border focus:border-qd-accent bg-white' : 'border-qd-border bg-qd-bg text-qd-gray cursor-not-allowed'}`}
          />
        </div>
      </div>

      {editing && (
        <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          onClick={handleSave}
          className="btn-primary rounded-full px-8 py-2.5 text-sm flex items-center gap-2">
          <Check size={15} /> Guardar alterações
        </motion.button>
      )}
    </div>
  )
}

/* ── Tab: Encomendas ── */
function TabEncomendas() {
  return (
    <div className="space-y-4">
      {MOCK_ORDERS.map(order => (
        <div key={order.id} className="border border-qd-border rounded-xl p-4 hover:border-qd-accent/40 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-qd-dark font-medium text-sm">{order.id}</p>
              <p className="text-qd-gray text-xs mt-0.5">{order.date}</p>
            </div>
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
          </div>
          <p className="text-xs text-qd-gray mb-2">{order.items.join(' · ')}</p>
          <div className="flex items-center justify-between">
            <p className="text-qd-dark font-semibold text-sm">{order.total}</p>
            <button className="text-xs text-qd-accent hover:underline flex items-center gap-0.5">
              Ver detalhes <ChevronRight size={11} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Tab: Favoritos ── */
function TabFavoritos() {
  const { items, remove } = useWishlist()
  const { notify }        = useNotification()
  const [buyProduct, setBuyProduct] = useState(null)

  const handleRemove = (product) => {
    remove(product.id)
    notify({ type: 'wishlist', message: `${product.name} removido dos favoritos` })
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart size={40} className="text-qd-border mx-auto mb-4" />
        <p className="text-qd-dark font-medium mb-1">Ainda não tens favoritos</p>
        <p className="text-qd-gray text-sm mb-5">
          Clica no ❤️ em qualquer produto para o guardar aqui.
        </p>
        <Link to="/catalogo" className="btn-primary rounded-full px-6 py-2.5 text-sm inline-flex">
          Explorar produtos
        </Link>
      </div>
    )
  }

  return (
    <>
      <p className="text-qd-gray text-xs mb-4">{items.length} produto{items.length !== 1 ? 's' : ''} guardado{items.length !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((product, i) => {
          const discount = product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : null

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              style={{
                background: '#fff',
                border: '1px solid #d2d2d7',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0071e3'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,113,227,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d2d2d7'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Image */}
              <Link to={`/produto/${product.id}`} style={{ display: 'block', position: 'relative' }}>
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#f5f5f7' }}>
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                {discount && (
                  <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: '#ff3b30', color: '#fff',
                    fontSize: '11px', fontWeight: 600,
                    padding: '3px 8px', borderRadius: '8px',
                  }}>
                    -{discount}%
                  </div>
                )}
                {product.badge && !discount && (
                  <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: '#0071e3', color: '#fff',
                    fontSize: '10px', fontWeight: 500,
                    padding: '3px 8px', borderRadius: '20px',
                  }}>
                    {product.badge}
                  </div>
                )}
              </Link>

              {/* Info */}
              <div style={{ padding: '14px' }}>
                <p style={{ fontSize: '10px', color: '#aeaeb2', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace', marginBottom: '4px' }}>
                  {product.category}
                </p>
                <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#1c1c1e', marginBottom: '6px', lineHeight: 1.3 }}>
                    {product.name}
                  </p>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#1c1c1e' }}>{formatPrice(product.price)}</p>
                  {product.originalPrice && (
                    <p style={{ fontSize: '12px', color: '#aeaeb2', textDecoration: 'line-through' }}>
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setBuyProduct(product)}
                    style={{
                      flex: 1, padding: '9px 0',
                      background: '#0071e3', color: '#fff',
                      border: 'none', borderRadius: '20px',
                      fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#0077ed'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0071e3'}
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => handleRemove(product)}
                    title="Remover dos favoritos"
                    style={{
                      width: '36px', height: '36px',
                      background: '#fff1f2', border: '1px solid #fecdd3',
                      borderRadius: '20px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ffe4e6'; e.currentTarget.style.borderColor = '#fda4af' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.borderColor = '#fecdd3' }}
                  >
                    <Trash2 size={14} color="#e11d48" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* BuyModal */}
      {buyProduct && <BuyModal product={buyProduct} onClose={() => setBuyProduct(null)} />}
    </>
  )
}

/* ── Tab: Pagamento ── */
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

/* ── Tab: Notificações ── */
function TabNotificacoes() {
  const [settings, setSettings] = useState({
    encomendas: true, promocoes: false, newsletter: true, whatsapp: true,
  })
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }))

  const items = [
    { key: 'encomendas', label: 'Atualizações de encomendas', desc: 'Estado da entrega e confirmações' },
    { key: 'promocoes',  label: 'Promoções e ofertas',        desc: 'Descontos exclusivos e novidades' },
    { key: 'newsletter', label: 'Newsletter',                  desc: 'Últimas novidades tecnológicas' },
    { key: 'whatsapp',   label: 'Notificações WhatsApp',      desc: 'Receber atualizações via WhatsApp' },
  ]

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.key} className="flex items-center justify-between p-4 border border-qd-border rounded-xl">
          <div>
            <p className="text-qd-dark text-sm font-medium">{item.label}</p>
            <p className="text-qd-gray text-xs mt-0.5">{item.desc}</p>
          </div>
          <button onClick={() => toggle(item.key)}
            style={{ height: '22px', width: '40px', borderRadius: '11px', background: settings[item.key] ? '#0071e3' : '#d2d2d7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 2px', transition: 'background 0.2s' }}>
            <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transform: settings[item.key] ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
          </button>
        </div>
      ))}
    </div>
  )
}

/* ── Tab: Segurança ── */
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
        {[['atual', 'Palavra-passe atual'], ['nova', 'Nova palavra-passe'], ['confirmar', 'Confirmar nova']].map(([k, label]) => (
          <div key={k}>
            <label className="block text-xs font-medium text-qd-dark mb-1.5">{label}</label>
            <input type="password" value={form[k]} onChange={e => set(k, e.target.value)}
              className="w-full border border-qd-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-qd-accent" placeholder="••••••••" />
          </div>
        ))}
        <button className="btn-primary rounded-full px-8 py-2.5 text-sm">Actualizar palavra-passe</button>
      </div>
    </div>
  )
}

/* ── Mapa de tabs ── */
const TAB_CONTENT = {
  perfil: TabDadosPessoais,
  encomendas: TabEncomendas,
  favoritos: TabFavoritos,
  pagamento: TabPagamento,
  notificacoes: TabNotificacoes,
  seguranca: TabSeguranca,
}

/* ── ProfilePage ── */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('perfil')
  const { items: wishlistItems }  = useWishlist()
  const ActiveComponent           = TAB_CONTENT[activeTab]

  return (
    <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)] pb-20">
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

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {TABS.map(tab => {
                const Icon = tab.icon
                const isFav = tab.id === 'favoritos'
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-all border-b border-qd-border/50 last:border-0 ${
                      activeTab === tab.id
                        ? 'bg-qd-accent/5 text-qd-accent font-medium'
                        : 'text-qd-gray hover:bg-qd-bg hover:text-qd-dark'
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                    {/* Badge de contagem nos favoritos */}
                    {isFav && wishlistItems.length > 0 && (
                      <span style={{
                        marginLeft: 'auto',
                        background: activeTab === 'favoritos' ? '#0071e3' : '#e11d48',
                        color: '#fff',
                        fontSize: '10px', fontWeight: 600,
                        padding: '1px 7px', borderRadius: '20px',
                        minWidth: '20px', textAlign: 'center',
                      }}>
                        {wishlistItems.length}
                      </span>
                    )}
                    {!isFav && activeTab === tab.id && <ChevronRight size={13} className="ml-auto" />}
                  </button>
                )
              })}

              <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-qd-red hover:bg-red-50 transition-colors mt-1">
                <LogOut size={15} />
                Terminar sessão
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
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