import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { products, categories } from '@/data/products'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const activeCategory = searchParams.get('categoria') || ''

  const setCategory = (cat) => {
    cat ? setSearchParams({ categoria: cat }) : setSearchParams({})
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCategory) list = list.filter(p => p.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q))
    }
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [activeCategory, search, sortBy])

  return (
    <main className="min-h-screen bg-qd-bg pt-[var(--nav-height)]">
      <div className="bg-white border-b border-qd-border">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="section-label mb-1">QD · ItSOLUTIONS</p>
            <h1 className="text-3xl md:text-4xl font-medium text-qd-dark tracking-tight">
              {activeCategory ? categories.find(c => c.id === activeCategory)?.label : 'Catálogo'}
            </h1>
            <p className="text-qd-gray text-sm mt-1">{filtered.length} produtos</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-qd-bg border border-qd-border text-qd-dark placeholder-qd-light text-sm px-4 py-2.5 rounded-full focus:outline-none focus:border-qd-accent transition-colors pr-9"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-qd-light hover:text-qd-dark">
                  <X size={13} />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-qd-bg border border-qd-border text-qd-dark text-sm px-4 py-2.5 rounded-full focus:outline-none focus:border-qd-accent transition-colors appearance-none cursor-pointer pr-8"
            >
              <option value="default">Ordenar</option>
              <option value="price-asc">Preço: menor</option>
              <option value="price-desc">Preço: maior</option>
              <option value="name">Nome A–Z</option>
            </select>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${!activeCategory ? 'bg-qd-dark text-white' : 'bg-qd-bg text-qd-gray hover:bg-qd-border'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat.id ? 'bg-qd-dark text-white' : 'bg-qd-bg text-qd-gray hover:bg-qd-border'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-qd-gray text-lg">Nenhum produto encontrado</p>
              <button onClick={() => { setSearch(''); setCategory('') }} className="mt-3 text-sm text-qd-accent hover:underline">
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
