import React from 'react'
import { useNav } from '@/hooks/useNav'

export default function Footer() {
  const { navTo } = useNav()

  const NavBtn = ({ to, children }) => (
    <button onClick={() => navTo(to)}
      className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-left p-0 text-[inherit]">
      {children}
    </button>
  )

  return (
    <footer className="bg-qd-darker text-white/60 pt-12 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-xs">

          <div>
            <p className="text-white/30 uppercase tracking-widest mb-4 font-mono">Loja</p>
            <ul className="space-y-2.5">
              {[
                ['/catalogo',                       'Catálogo'],
                ['/catalogo?categoria=smartphones', 'Smartphones'],
                ['/catalogo?categoria=laptops',     'Laptops'],
                ['/catalogo?categoria=desktops',    'Desktops'],
                ['/catalogo?categoria=som',         'Som'],
                ['/catalogo?categoria=gaming',      'Gaming'],
                ['/catalogo?categoria=extra',       'Extra'],
              ].map(([to, label]) => (
                <li key={to}><NavBtn to={to}>{label}</NavBtn></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/30 uppercase tracking-widest mb-4 font-mono">Empresas</p>
            <ul className="space-y-2.5">
              <li><NavBtn to="/empresas">Soluções B2B</NavBtn></li>
              <li><NavBtn to="/empresas">Pedir Orçamento</NavBtn></li>
              <li><NavBtn to="/empresas">Preços Corporativos</NavBtn></li>
              <li><NavBtn to="/empresas">Assistência Técnica</NavBtn></li>
              <li>
                <a href="https://wa.me/244923000000?text=Olá, quero informações para empresas"
                  target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Empresas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white/30 uppercase tracking-widest mb-4 font-mono">Apoio</p>
            <ul className="space-y-2.5">
              <li>
                <a href="https://wa.me/244923000000" target="_blank" rel="noreferrer"
                  className="hover:text-white transition-colors">WhatsApp</a>
              </li>
              <li>+244 923 000 000</li>
              <li>Entrega em 21 províncias</li>
              <li>Garantia 12 meses</li>
            </ul>
          </div>

          <div>
            <p className="text-white/30 uppercase tracking-widest mb-4 font-mono">Pagamento</p>
            <ul className="space-y-2.5">
              <li>Multicaixa Express</li>
              <li>Referência Multicaixa</li>
              <li>Transferência bancária</li>
              <li className="pt-2 border-t border-white/10">
                <NavBtn to="/perfil">Minha Conta</NavBtn>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]">
          <p className="text-white/30">© 2026 QD · ItSOLUTIONS. Todos os direitos reservados.</p>
          <button onClick={() => navTo('/')} aria-label="Página inicial"
            className="bg-transparent border-none cursor-pointer p-0">
            <img src="/favicon.webp" alt="QD · ItSOLUTIONS"
              className="h-30 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              style={{ maxWidth: '220px' }} />
          </button>
        </div>
      </div>
    </footer>
  )
}