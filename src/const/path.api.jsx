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
    GET_BY_ID: "/products/:id",
    GET_ALL: "/products",
    GET_BY_CATEGORY: "/products/category/:categoryId",
    SEARCH: "/products/search?q=",
    CREATE: "/products",
    UPDATE: "/products/:id",
    DELETE: "/products/:id",
  }
};
