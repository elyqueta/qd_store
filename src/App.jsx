import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import { PreloaderProvider } from '@/contexts/PreloaderContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import Preloader from '@/components/layout/Preloader'
import RouteTransitionListener from '@/components/layout/RouteTransitionListener'

// Lazy loading das páginas
const HomePage = lazy(() => import('@/pages/HomePage'))
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))

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
    <PreloaderProvider>
      <BrowserRouter>
        <Preloader />
        <RouteTransitionListener />
        <CartProvider>
          <Layout>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<><ScrollToTop /><HomePage /></>} />
                <Route path="/catalogo" element={<><ScrollToTop /><CatalogPage /></>} />
                <Route path="/produto/:id" element={<><ScrollToTop /><ProductPage /></>} />
                <Route path="/perfil" element={<><ScrollToTop /><ProfilePage /></>} />
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
    </PreloaderProvider>
  )
}
