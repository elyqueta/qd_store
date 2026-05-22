import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Hero from '@/components/layout/Hero'
import ProductCard from '@/components/product/ProductCard'
import { products } from '@/data/products'

const featured = products.filter(p => p.featured)

function TeslaSection({ title, subtitle, cta, ctaLink, ctaSecondary, ctaSecondaryLink, bg, dark = true, label }) {
  return (
    <section className="tesla-section">
      <div className="tesla-section-bg">
        <img src={bg} alt={title} />
        {dark
          ? <div className="hero-overlay absolute inset-0" />
          : <div className="hero-overlay-light absolute inset-0" />
        }
      </div>

      <div className="tesla-section-top px-6 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          {label && (
            <p className={`text-xs font-medium tracking-[0.15em] uppercase mb-2 ${dark ? 'text-white/60' : 'text-qd-gray'}`}>
              {label}
            </p>
          )}
          <h2 className={`text-[2rem] md:text-[2.5rem] font-medium tracking-tight leading-tight ${dark ? 'text-white' : 'text-qd-dark'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-sm mt-1 font-light ${dark ? 'text-white/70' : 'text-qd-gray'}`}>
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      <div className="tesla-section-bottom px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to={ctaLink} className={`min-w-[160px] ${dark ? 'btn-white-solid' : 'btn-primary'}`}>
            {cta}
          </Link>
          {ctaSecondary && (
            <Link to={ctaSecondaryLink || '/catalogo'} className={`min-w-[160px] ${dark ? 'btn-white' : 'btn-outline'}`}>
              {ctaSecondary}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main className="bg-qd-bg">

      {/* ── HERO ── */}
      <Hero />

      {/* ── PRODUTOS EM DESTAQUE ── */}
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-2">Destaques</p>
          <h2 className="text-3xl md:text-[2.2rem] font-medium text-qd-dark tracking-tight">
            Os mais procurados
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center mt-10"
        >
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-1.5 text-qd-accent text-sm font-medium group hover:gap-2.5 transition-all duration-200"
          >
            Ver todos os produtos
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* ── SECÇÕES TESLA ── */}
      <TeslaSection
        label="Novo"
        title="iPhone 15 Pro Max"
        subtitle="Titânio. Chip A17 Pro. Câmara de 48MP."
        cta="Comprar"
        ctaLink="/produto/iphone-15-pro-max"
        ctaSecondary="Ver detalhes"
        ctaSecondaryLink="/produto/iphone-15-pro-max"
        bg="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1920&q=90"
        dark={true}
      />

      <TeslaSection
        label="Performance"
        title="MacBook Pro M3 Max"
        subtitle="Até 22 horas de autonomia."
        cta="Comprar"
        ctaLink="/produto/macbook-pro-16-m3"
        ctaSecondary="Explorar"
        ctaSecondaryLink="/produto/macbook-pro-16-m3"
        bg="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&q=90"
        dark={false}
      />

      {/* ── COMPUTADORES ── */}
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-2">🖥️ Computadores</p>
          <h2 className="text-3xl md:text-[2.2rem] font-medium text-qd-dark tracking-tight">
            Potência para o teu trabalho
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.filter(p => p.category === 'computadores').map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center mt-10"
        >
          <Link
            to="/catalogo?categoria=computadores"
            className="inline-flex items-center gap-1.5 text-qd-accent text-sm font-medium group hover:gap-2.5 transition-all duration-200"
          >
            Ver todos os computadores
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </section>

      <TeslaSection
        label="Desktop Premium"
        title="iMac 24 M3"
        subtitle="Ecrã 4.5K Retina. Design que define um espaço."
        cta="Comprar"
        ctaLink="/produto/imac-24-m3"
        ctaSecondary="Saiba mais"
        ctaSecondaryLink="/produto/imac-24-m3"
        bg="https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1920&q=90"
        dark={false}
      />

      {/* ── GAMING & ÁUDIO ── */}
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-2">Gaming & Áudio</p>
          <h2 className="text-3xl md:text-[2.2rem] font-medium text-qd-dark tracking-tight">
            Experiências imersivas
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.filter(p => ['gaming', 'audio'].includes(p.category)).slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <TeslaSection
        label="Áudio"
        title="Sony WH-1000XM5"
        subtitle="O melhor ANC do mundo. 30 horas de bateria."
        cta="Comprar"
        ctaLink="/produto/sony-wh1000xm5"
        ctaSecondary="Saiba mais"
        ctaSecondaryLink="/produto/sony-wh1000xm5"
        bg="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1920&q=90"
        dark={true}
      />

      <TeslaSection
        label="Gaming"
        title="PlayStation 5 Slim"
        subtitle="Nova geração. Design compacto. Ray Tracing nativo."
        cta="Comprar"
        ctaLink="/produto/ps5-slim"
        ctaSecondary="Ver mais"
        ctaSecondaryLink="/produto/ps5-slim"
        bg="https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1920&q=90"
        dark={true}
      />

      {/* ── ACESSÓRIOS ── */}
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-2">Acessórios</p>
          <h2 className="text-3xl md:text-[2.2rem] font-medium text-qd-dark tracking-tight">
            Completa a tua setup
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.filter(p => p.category === 'extra').map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── WHATSAPP CTA ── */}
      <section className="py-20 text-center bg-white border-t border-qd-border">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto px-6"
        >
          <h2 className="text-3xl font-medium text-qd-dark mb-2 tracking-tight">Precisa de ajuda?</h2>
          <p className="text-qd-gray text-sm mb-8">
            A nossa equipa responde no WhatsApp em minutos.
          </p>
          <a
            href="https://wa.me/244923000000?text=Olá QD · ItSOLUTIONS, preciso de ajuda!"
            target="_blank"
            rel="noreferrer"
            className="btn-primary px-8 py-3 inline-flex items-center gap-2 text-sm"
          >
            <MessageCircle size={15} />
            Falar no WhatsApp
          </a>
        </motion.div>
      </section>

    </main>
  )
}