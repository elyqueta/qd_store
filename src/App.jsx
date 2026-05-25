import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import { PreloaderProvider } from '@/contexts/PreloaderContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import WhatsAppButton from '@/components/layout/Whatsappbutton'
import Preloader from '@/components/ui/Preloader'

const HomePage     = lazy(() => import('@/pages/HomePage'))
const CatalogPage  = lazy(() => import('@/pages/CatalogPage'))
const ProductPage  = lazy(() => import('@/pages/ProductPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const ProfilePage  = lazy(() => import('@/pages/ProfilePage'))
const EmpresasPage = lazy(() => import('@/pages/EmpresasPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <PreloaderProvider>
      <Preloader />
      <BrowserRouter>
        <ScrollToTop />
        <NotificationProvider>
          <WishlistProvider>
            <CartProvider>
              <Layout>
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/"               element={<HomePage />} />
                    <Route path="/catalogo"       element={<CatalogPage />} />
                    <Route path="/produto/:id"    element={<ProductPage />} />
                    <Route path="/perfil"         element={<ProfilePage />} />
                    <Route path="/empresas"       element={<EmpresasPage />} />
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
          </WishlistProvider>
        </NotificationProvider>
      </BrowserRouter>
    </PreloaderProvider>
  )
}