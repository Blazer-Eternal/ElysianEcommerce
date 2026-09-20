import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthLayout from "./components/layout/AuthLayout";
import AuthRedirect from "./components/AuthRedirect";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./constants/routes";

/* ========================================
   LAZY-LOADED PAGES (Reduces Initial Bundle)
   ======================================== */

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// User Pages
const Home = lazy(() => import("./pages/user/Home"));
const ProductList = lazy(() => import("./pages/user/ProductList"));
const ProductDetail = lazy(() => import("./pages/user/ProductDetail"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Checkout = lazy(() => import("./pages/user/Checkout"));
const OrderHistory = lazy(() => import("./pages/user/OrderHistory"));
const OrderDetail = lazy(() => import("./pages/user/OrderDetail"));
const Profile = lazy(() => import("./pages/user/Profile"));

// Admin Pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageProducts = lazy(() => import("./pages/admin/ManageProducts"));
const ManageCategories = lazy(() => import("./pages/admin/ManageCategories"));
const ManageCoupons = lazy(() => import("./pages/admin/ManageCoupons"));
const ManageOrders = lazy(() => import("./pages/admin/ManageOrders"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const DataTablesDemo = lazy(() => import("./pages/admin/DataTablesDemo"));

// Info Pages
const About = lazy(() => import("./pages/About"));
const Values = lazy(() => import("./pages/Values"));
const Features = lazy(() => import("./pages/Features"));
const Contact = lazy(() => import("./pages/Contact"));

// Legal Pages
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/legal/ShippingPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const Cancellations = lazy(() => import("./pages/legal/Cancellations"));

// Payment Pages
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));

// Error Page
const NotFound = lazy(() => import("./pages/NotFound"));

/* ========================================
   LOADING SPINNER COMPONENT (Optimized)
   ======================================== */
const PageLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-50 via-blue-50 to-teal-50 animate-container">
    <div className="flex flex-col items-center gap-6">
      {/* Animated Loading Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-200 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-500 border-r-teal-400 animate-spin animation-delay-100ms" style={{ animationDirection: "reverse" }} />
        <div className="absolute inset-4 rounded-full border-4 border-cyan-300 opacity-50 animate-pulse" />
      </div>
      
      {/* Loading Text with Fade Animation */}
      <div className="animate-fade-in">
        <p className="text-center text-lg font-semibold text-gray-700">Loading your content...</p>
        <p className="text-center text-sm text-gray-500 mt-2">This should only take a moment</p>
      </div>

      {/* GPU-accelerated animated dots */}
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse animation-delay-0ms" />
        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse animation-delay-200ms" />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse animation-delay-400ms" />
      </div>
    </div>
  </div>
);

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

/* ========================================
   MAIN APP COMPONENT (Optimized with Suspense)
   ======================================== */
function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Suspense fallback={<PageLoadingSpinner />}>
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
      <Route
        path={ROUTES.ADMIN_DATA_TABLES}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <DataTablesDemo />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
