import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-qd-darker text-white/60 pt-12 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-xs">
          <div>
            <p className="text-white/30 uppercase tracking-widest mb-4 font-mono">Loja</p>
            <ul className="space-y-2.5">
              {[
                ['/catalogo', 'Catálogo'],
                ['/catalogo?categoria=smartphones', 'Smartphones'],
                ['/catalogo?categoria=portateis', 'Portáteis'],
                ['/catalogo?categoria=computadores', 'Computadores'],
                ['/catalogo?categoria=audio', 'Áudio'],
                ['/catalogo?categoria=gaming', 'Gaming'],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white/30 uppercase tracking-widest mb-4 font-mono">Apoio</p>
            <ul className="space-y-2.5">
              <li><a href="https://wa.me/244923000000" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li>+244 923 000 000</li>
              <li>Entrega em 18 províncias</li>
              <li>Garantia 12 meses</li>
            </ul>
          </div>
          <div>
            <p className="text-white/30 uppercase tracking-widest mb-4 font-mono">Pagamento</p>
            <ul className="space-y-2.5">
              <li>Multicaixa Express</li>
              <li>Referência Multicaixa</li>
              <li>Transferência bancária</li>
            </ul>
          </div>
          <div>
            <p className="text-white/30 uppercase tracking-widest mb-4 font-mono">QD</p>
            <ul className="space-y-2.5">
              <li>Luanda, Angola</li>
              <li>Tecnologia premium</li>
              <li><Link to="/perfil" className="hover:text-white transition-colors">Minha Conta</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]">
          <p className="text-white/30">© 2026 QD · ItSOLUTIONS. Todos os direitos reservados.</p>
          {/* Logo — click goes to home */}
          <Link to="/" className="flex items-center">
            <img
              src="/favicon.webp"
              alt="QD · ItSOLUTIONS"
              className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              style={{ maxWidth: '110px'}}
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}