import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const CartService = {
  getCart: () =>
    BaseService.get({
      url: API.CART.GET_CART,
      isLoading: true,
    }),

  addToCart: (payload) =>
    BaseService.post({
      url: API.CART.ADD_TO_CART,
      payload,
      isLoading: true,
    }),

  updateCart: (data) =>
    BaseService.put({
      url: API.CART.UPDATE_CART,
      payload: data,
      isLoading: true,
    }),

    removeItem: (productId) =>
      BaseService.remove({
        url: API.CART.DELETE_CART.replace(":id", productId),
        isLoading: true,
      }),
    

  clearCart: () =>
    BaseService.remove({
      url: API.CART.CLEAR_CART,
      isLoading: true,
    }),

  checkout: (payload) =>
    BaseService.post({
      url: API.CART.CHECK_OUT_CART,
      payload,
      isLoading: true,
    }),
};
