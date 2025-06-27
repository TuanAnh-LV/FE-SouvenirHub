import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const SellerService = {
  getShopOrders: (filter) => {
    return BaseService.post({
      url: API.SELLER.GET_SHOP_ORDERS,
      data: filter,
      isLoading: true,
    });
  },

  updateOrderStatus: (order_id, status) => {
    return BaseService.put({
      url: API.SELLER.UPDATE_ORDER_STATUS,
      data: { order_id, status },
      isLoading: true,
    });
  },

  getSellerStats: () => {
    return BaseService.get({
      url: API.SELLER.GET_SELLER_STATS,
      isLoading: true,
    });
  },
};
