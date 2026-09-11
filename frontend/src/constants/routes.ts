export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string = ":id") => `/products/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  WISHLIST: "/wishlist",
  PROFILE: "/profile",
  ORDER_HISTORY: "/orders",
  ORDER_DETAIL: (id: string = ":id") => `/orders/${id}`,

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_FAILURE: "/payment/failure",

  ADMIN_DASHBOARD: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_COUPONS: "/admin/coupons",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAIL: (id: string = ":orderId") => `/admin/orders/${id}`,
  ADMIN_USERS: "/admin/users",

  ABOUT: "/about",
  FEATURES: "/features",
  CONTACT: "/contact",
  REFUND_POLICY: "/legal/refund-policy",
  SHIPPING_POLICY: "/legal/shipping",
  PRIVACY_POLICY: "/legal/privacy-policy",
  TERMS_OF_SERVICE: "/legal/terms-of-service",
  CANCELLATIONS: "/legal/cancellations",

  NOT_FOUND: "*",
} as const;