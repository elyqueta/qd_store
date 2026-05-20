# QD · ItSOLUTIONS

E-commerce de tecnologia premium para Angola, com design inspirado na Tesla e Apple.

## Stack

- **React 18** + Vite
- **Framer Motion** — animações e transições cinematográficas
- **TailwindCSS** — estilização
- **React Router v6** — navegação com lazy loading

## Instalação

```bash
npm install
npm run dev
```

Abre em → `http://localhost:5173`

## Deploy (Vercel)

```bash
npm run build
```

Ou liga o repositório GitHub à Vercel para deploy automático a cada `git push`.

## Estrutura

```
src/
├── components/
│   ├── layout/     # Navbar, Footer, Hero
│   ├── product/    # ProductCard
│   └── cart/       # CartDrawer
├── pages/
│   ├── HomePage.jsx
│   ├── CatalogPage.jsx
│   ├── ProductPage.jsx
│   └── CheckoutPage.jsx
├── contexts/       # CartContext
├── data/           # products.js, angola.js
├── hooks/          # useReveal, useTilt
└── utils/          # format.js
```

## Funcionalidades

- Hero fullscreen estilo Tesla com slides automáticos
- Navbar com mega menu ao hover
- Catálogo com filtros e pesquisa
- Página individual por produto com galeria
- Carrinho lateral animado
- Checkout multi-step com todas as províncias e municípios de Angola
- Pagamento via Multicaixa Express, Referência Multicaixa e Transferência Bancária
- Totalmente responsivo

## Contacto

WhatsApp · +244 923 000 000
