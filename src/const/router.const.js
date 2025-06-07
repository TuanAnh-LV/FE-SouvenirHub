
export const ROUTER_URL = {
  LOGIN: '/login',
  FORGOT_PASSWORD: "/forgot-password",
  SIGNUP: "/signup",
  CHECKOUT:"/checkout",
  ADMIN: {
    DASHBOARD: "/admin",
    MANAGE_SHOP: "/admin/manage-shop",
    MANAGE_ORDERS: "/admin/manage-orders",
    MANAGE_USERS: "/admin/manage-users",
    MANAGE_PRODUCTS: "/admin/manage-products",
    MANAGE_CATEGORIES: "/admin/manage-categories",
    PENDING_SHOPS: "/admin/pending-shops",
    USER_DETAILS: "/admin/user-details/:id",
    PRODUCT_DETAILS: "/admin/product-details/:id",
    CATEGORY_DETAILS: "/admin/category-details/:id",
    STATS: "/admin/stats",
    DELETE_SHOP: "/admin/delete-shop/:id",
    DELETE_USER: "/admin/delete-user/:id",
    PRODUCTS: {
      PENDING: "/admin/products/pending",
      APPROVED: "/admin/products/approved",
      DETAIL: "/admin/products/:id",
    },
    ORDERS: {
      ALL: "/admin/orders",
      DETAIL: "/admin/orders/:id",
    },
    USERS: {
      ALL: "/admin/users",
      DETAIL: "/admin/users/:id",
    },
    SHOPS: {
      ALL: "/admin/shops",
      DETAIL: "/admin/shops/:id",
    },
    CATEGORIES: {
      ALL: "/admin/categories",
      DETAIL: "/admin/categories/:id",
    },
    SHOP_APPLICATIONS: {
      ALL: "/admin/shop-applications",
      DETAIL: "/admin/shop-applications/:id",
    },
    UPDATE_SHOP: "/admin/update-shop/:id",
    UPDATE_USER: "/admin/update-user/:id",
    UPDATE_PRODUCT: "/admin/update-product/:id",
    UPDATE_CATEGORY: "/admin/update-category/:id",
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
    SHOP_PROFILE: "/shop-profile/:id",
    GET_CART: "/cart",
  },
  UNAUTHORIZED: "/unauthorize"
};