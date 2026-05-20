# QD · ItSOLUTIONS — E-commerce Premium

Loja online de tecnologia premium para Angola com design inspirado na Tesla/Apple.

## Stack

- **React 18** + Vite
- **Framer Motion** — animações fluidas e transições cinematográficas
- **TailwindCSS** — estilização utilitária
- **React Router v6** — navegação com lazy loading
- **DM Sans + Playfair Display** — tipografia premium

## Funcionalidades

- ✅ Hero com slides automáticos estilo Tesla
- ✅ Catálogo com filtros por categoria e pesquisa
- ✅ Página individual por produto com galeria
- ✅ Carrinho lateral com animações (drawer)
- ✅ Checkout multi-step (dados → pagamento → confirmação)
- ✅ Tilt effect nos cards de produto
- ✅ Scroll reveal animations
- ✅ Totalmente responsivo
- ✅ Lazy loading de páginas e imagens
- ✅ 14 produtos em 5 categorias

## Instalação

```bash
npm install
npm run dev
```

Abrir em: http://localhost:5173

## Estrutura

```
src/
├── components/
│   ├── layout/       # Navbar, Footer, Hero
│   ├── product/      # ProductCard
│   └── cart/         # CartDrawer
├── pages/
│   ├── HomePage.jsx
│   ├── CatalogPage.jsx
│   ├── ProductPage.jsx
│   └── CheckoutPage.jsx
├── contexts/         # CartContext
├── hooks/            # useReveal, useTilt
├── data/             # products.js
└── utils/            # format.js
```

## Personalização

- **Produtos**: editar `src/data/products.js`
- **Cores**: editar `tailwind.config.js` → `colors.qd`
- **Fontes**: editar `index.html` e `tailwind.config.js`
- **Hero slides**: editar `heroSlides` em `src/data/products.js`

## Contacto

WhatsApp: +244 923 000 000
