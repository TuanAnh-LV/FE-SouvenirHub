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
    CREATE_PRODUCT: "/products",
    UPDATE_PRODUCT: "/products/:id",
    DELETE_PRODUCT: "/products/:id",
    SEARCH_PRODUCTS: "/products/search",
    CREATE_PRODUCT_IMAGE: "/product-images/:id",
    DELETE_PRODUCT_IMAGE: "/product-images/image/:id",
    DELETE_PRODUCT_IMAGES: "/product-images/product/:id",
  },
  CATEGORY: {
    GET_ALL_CATEGORIES: "/categories",
    GET_CATEGORY_BY_ID: "/categories/:id",
    CREATE_CATEGORY: "/categories",
    UPDATE_CATEGORY: "/categories/:id",
    DELETE_CATEGORY: "/categories/:id",
  },

  USER: {
    UPDATE_PROFILE: "/user/me",
    GET_USER_INFO: "/user/me",
    GET_USER_BY_ID: "/users/:id",
    GET_ALL_USERS: "/users",
    DELETE_USER: "/users/delete/:id",
  },
  SHOP: {
    CREATE_SHOP: "/shops",
    GET_SHOP_BY_ID: "/shops/:id",
    UPDATE_SHOP: "/shops/me",
    DELETE_SHOP: "/shops/delete/:id",
    GET_CURRENT_SHOP: "/shops/me",
  },
  SHOP_APPLICATION: {
    CREATE_APPLICATION: "/shop-applications",
    GET_APPLICATION_BY_ID: "/shop-applications/:id",
  },

};
