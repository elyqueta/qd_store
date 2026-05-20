import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'

// Lazy loading das páginas
const HomePage = lazy(() => import('@/pages/HomePage'))
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border border-white/20 border-t-white animate-spin rounded-full" />
        <p className="text-white/30 text-xs font-mono tracking-widest">CARREGAR</p>
      </div>
    </div>
  )
}

function ScrollToTop() {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return null
}

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
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<><ScrollToTop /><HomePage /></>} />
              <Route path="/catalogo" element={<><ScrollToTop /><CatalogPage /></>} />
              <Route path="/produto/:id" element={<><ScrollToTop /><ProductPage /></>} />
              <Route path="/checkout/dados" element={<><ScrollToTop /><CheckoutPage /></>} />
              <Route path="/checkout/*" element={<><ScrollToTop /><CheckoutPage /></>} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                  <p className="text-white/40 font-display text-4xl">404</p>
                  <a href="/" className="btn-outline">Voltar ao início</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  )
}
