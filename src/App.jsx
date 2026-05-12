import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ShopPage from './pages/ShopPage'
import ContactPage from './pages/ContactPage'
import ProductPage from './pages/ProductPage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import FloatingCartButton from './components/cart/FloatingCartButton'
import CartPage from './pages/CartPage'
import CartDrawer from './components/cart/CartDrawer'
import CheckoutPage from './pages/CheckoutPage'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'
import CheckoutFailurePage from './pages/CheckoutFailurePage'
import AdminPage from './pages/AdminPage'
import DonationPage from './pages/DonationPage'
import TrackOrderPage from './pages/TrackOrderPage'
import NotFoundPage from './pages/NotFoundPage'
import PermissionDeniedPage from './pages/PermissionDeniedPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import Faq from './components/common/Faq'
import PrivacyPolicy from './components/common/PrivacyPolicy'
import TermsAndConditions from './components/common/TermsAndConditions'
import ManagerPanel from './pages/ManagerPanel'
import InitiativesPage from './pages/InitiativesPage'
import ScrollToTop from './components/common/ScrollToTop'
import ProjectReportPage from './pages/ProjectReportPage'
import PDFViewerPage from './pages/PDFViewerPage'


function App() {
  const location = useLocation();
  const hideNavbarFooterRoutes = ['/admin'];

  const shouldHideNavbarFooter = hideNavbarFooterRoutes.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <ScrollToTop />
          {!shouldHideNavbarFooter && <Navbar />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/initiatives/:slug" element={<InitiativesPage />} />
              
              <Route path="/documents/:id" element={<PDFViewerPage />} />
              
              {/* <Route path="/project-report" element={<ProjectReportPage />} /> */}
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/product/:id" element={<ProductPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/donations" element={<DonationPage />} />
              <Route path="/track" element={<TrackOrderPage />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/term&conditions" element={<TermsAndConditions />} />

              {/* Checkout */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="/checkout/failure" element={<CheckoutFailurePage />} />

              {/* Admin - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Manager - Protected */}
              <Route
                path="/manager/*"
                element={
                  <ProtectedRoute requiredRole={['admin', 'manager']}>
                    <ManagerPanel />
                  </ProtectedRoute>
                }
              />

              {/* Permission Denied */}
              <Route path="/permission-denied" element={<PermissionDeniedPage />} />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <FloatingCartButton />
          <CartDrawer />
          {!shouldHideNavbarFooter && <Footer />}
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
