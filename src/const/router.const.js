
export const ROUTER_URL = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: "/forgot-password",
  SIGNUP: "/signup",
  ADMIN: {
    DASHBOARD: "/admin",
   
  },
  USER: {
    PROFILE: "/user/profile",
    SETTINGS: "/user/settings",
  },
  BUYER: {
    DASHBOARD: "/buyer",
    ORDERS: "/buyer/orders",
    CART: "/buyer/cart",
  },
  SELLER: {
    DASHBOARD: "/seller",
    PRODUCTS: "/seller/products",
    ORDERS: "/seller/orders",
  },
  COMMON: {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
  },
  PRODUCT: {
    DETAIL: "/products/:id",
    ALL: "/products"    
  },
  UNAUTHORIZED: "/unauthorize"
};
