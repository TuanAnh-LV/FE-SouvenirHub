export const API = {
  COMMON: {
    PUBLIC_CATEGORY: "api/client/category/search",
  },
  AUTH: {
    LOGIN: "/auth/login",
    LOGIN_GOOGLE: "/auth/google-login",
    GET_CURRENT_USER_INFO: "/auth/me",
    REGISTER: "/auth/register",
    CHANGE_PASSWORD: "/auth/change-password",
    RESET_PASSWORD: "/auth/reset-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  PRODUCT: {
    GET_ALL_PRODUCTS: "/products",
    GET_PRODUCT_BY_ID: "/products/:id",
    CREATE_PRODUCT: "/products/create",
    UPDATE_PRODUCT: "/products/update/:id",
    DELETE_PRODUCT: "/products/delete/:id",
    SEARCH_PRODUCTS: "/products/search",
  },
  CATEGORY: {
    GET_ALL_CATEGORIES: "/categories",
    GET_CATEGORY_BY_ID: "/categories/:id",
    CREATE_CATEGORY: "/categories/create",
    UPDATE_CATEGORY: "/categories/update/:id",
    DELETE_CATEGORY: "/categories/delete/:id",
  },

};
