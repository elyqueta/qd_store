/**
 * App.jsx — QD · ItSOLUTIONS
 *
 * Preloader: apenas na primeira visita (homepage).
 * ScrollToTop: funciona em TODAS as mudanças de rota,
 *              com scroll imediato antes da página renderizar.
 */
import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import { PreloaderProvider } from '@/contexts/PreloaderContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import Preloader from '@/components/ui/Preloader'

/* ── Lazy pages ── */
const HomePage    = lazy(() => import('@/pages/HomePage'))
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))

/* ─────────────────────────────────────────────────
   ScrollToTop
   Dispara SEMPRE que o pathname muda.
   Usa scrollTo instantâneo para não haver conflito
   com animações de Framer Motion.
───────────────────────────────────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 'instant' evita o scroll animado do browser que
    // pode chegar tarde e sobrepor-se à nova página
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

/* ── Layout wrapper ── */
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <PreloaderProvider>
      {/*
        Preloader fora do Router para não depender de rota.
        Só aparece uma vez — na primeira visita.
      */}
      <Preloader />

      <BrowserRouter>
        {/* ScrollToTop dentro do Router para ter acesso ao useLocation */}
        <ScrollToTop />

        <CartProvider>
          <Layout>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/"               element={<HomePage />} />
                <Route path="/catalogo"       element={<CatalogPage />} />
                <Route path="/produto/:id"    element={<ProductPage />} />
                <Route path="/perfil"         element={<ProfilePage />} />
                <Route path="/checkout/dados" element={<CheckoutPage />} />
                <Route path="/checkout/*"     element={<CheckoutPage />} />
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                    <p className="text-qd-gray font-display text-4xl">404</p>
                    <a href="/" className="btn-outline">Voltar ao início</a>
                  </div>
                } />
              </Routes>
            </Suspense>
          </Layout>
        </CartProvider>
      </BrowserRouter>
    </PreloaderProvider>
  )
}