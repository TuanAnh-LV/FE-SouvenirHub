
export const ROUTER_URL = {
  LOGIN: '/login',
  FORGOT_PASSWORD: "/forgot-password",
  SIGNUP: "/signup",
  ADMIN: {
    DASHBOARD: "/admin",
  },
  BUYER: {
    DASHBOARD: "/buyer",
    ORDERS: "/buyer/orders",
    CART: "/buyer/cart",
    REGISTER_SHOP: "/buyer/register-shop",
  },
  SELLER: {
    DASHBOARD: "/seller",
    PRODUCTS: "/seller/products",
    ORDERS: "/seller/orders",
  },
  PRODUCTS: {
    ALL: "/products",
    DETAIL: "/products/:id",
    CREATE: "/products/create",
    UPDATE: "/products/update/:id",
  },
  COMMON: {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    PROFILE: "/profile",
  },
  UNAUTHORIZED: "/unauthorize"
};
