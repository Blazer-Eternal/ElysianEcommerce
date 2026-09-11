import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthLayout from "./components/layout/AuthLayout";
import AuthRedirect from "./components/AuthRedirect";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Home from "./pages/user/Home";
import ProductList from "./pages/user/ProductList";
import ProductDetail from "./pages/user/ProductDetail";
import Wishlist from "./pages/user/Wishlist";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import OrderHistory from "./pages/user/OrderHistory";
import OrderDetail from "./pages/user/OrderDetail";
import Profile from "./pages/user/Profile";
import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageCoupons from "./pages/admin/ManageCoupons";
import ManageOrders from "./pages/admin/ManageOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import ManageUsers from "./pages/admin/ManageUsers";
import About from "./pages/About";
import Values from "./pages/Values";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import RefundPolicy from "./pages/legal/RefundPolicy";
import ShippingPolicy from "./pages/legal/ShippingPolicy";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import Cancellations from "./pages/legal/Cancellations";
import NotFound from "./pages/NotFound";
import { ROUTES } from "./constants/routes";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";


const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

// flex-col + min-h-screen forces this wrapper to always fill at least the
// full viewport height; flex-1 on the content area pushes Footer to the
// bottom even when the page content itself is short.
const PublicPage = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Routes>
      <Route path={ROUTES.HOME} element={<PublicPage><Home /></PublicPage>} />
      <Route path={ROUTES.PRODUCTS} element={<PublicPage><ProductList /></PublicPage>} />
      <Route path={ROUTES.PRODUCT_DETAIL()} element={<PublicPage><ProductDetail /></PublicPage>} />
      <Route path={ROUTES.ABOUT} element={<PublicPage><About /></PublicPage>} />
      <Route path={ROUTES.VALUES} element={<PublicPage><Values /></PublicPage>} />
      <Route path={ROUTES.FEATURES} element={<PublicPage><Features /></PublicPage>} />
      <Route path={ROUTES.CONTACT} element={<PublicPage><Contact /></PublicPage>} />
      <Route path={ROUTES.REFUND_POLICY} element={<PublicPage><RefundPolicy /></PublicPage>} />
      <Route path={ROUTES.SHIPPING_POLICY} element={<PublicPage><ShippingPolicy /></PublicPage>} />
      <Route path={ROUTES.PRIVACY_POLICY} element={<PublicPage><PrivacyPolicy /></PublicPage>} />
      <Route path={ROUTES.TERMS_OF_SERVICE} element={<PublicPage><TermsOfService /></PublicPage>} />
      <Route path={ROUTES.CANCELLATIONS} element={<PublicPage><Cancellations /></PublicPage>} />
      <Route path={ROUTES.PAYMENT_SUCCESS} element={<PublicPage><PaymentSuccess /></PublicPage>} />
      <Route path={ROUTES.PAYMENT_FAILURE} element={<PublicPage><PaymentFailure /></PublicPage>} />

      <Route
        path={ROUTES.WISHLIST}
        element={
          <ProtectedRoute>
            <PublicPage><Wishlist /></PublicPage>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CART}
        element={
          <ProtectedRoute>
            <PublicPage><Cart /></PublicPage>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CHECKOUT}
        element={
          <ProtectedRoute>
            <PublicPage><Checkout /></PublicPage>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ORDER_HISTORY}
        element={
          <ProtectedRoute>
            <PublicPage><OrderHistory /></PublicPage>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ORDER_DETAIL()}
        element={
          <ProtectedRoute>
            <PublicPage><OrderDetail /></PublicPage>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <PublicPage><Profile /></PublicPage>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.LOGIN}
        element={
          <AuthRedirect>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </AuthRedirect>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <AuthRedirect>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </AuthRedirect>
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <AuthLayout>
            <ForgotPassword />
          </AuthLayout>
        }
      />
      <Route
        path={ROUTES.RESET_PASSWORD}
        element={
          <AuthLayout>
            <ResetPassword />
          </AuthLayout>
        }
      />

      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_PRODUCTS}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <ManageProducts />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_CATEGORIES}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <ManageCategories />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_COUPONS}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <ManageCoupons />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_ORDERS}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <ManageOrders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_ORDER_DETAIL()}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminOrderDetail />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_USERS}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <ManageUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
