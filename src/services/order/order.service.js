import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const OrderService = {
    createOrder: (data) => {
        return BaseService.post({
        url: API.ORDER.CREATE_ORDER,
        payload: data,
        isLoading: true,
        });
    },
    
    getOrders: () => {
        return BaseService.get({
        url: API.ORDER.GET_ORDERS,
        isLoading: true,
        });
    },
    
    getOrderById: (id) => {
        return BaseService.get({
        url: API.ORDER.GET_ORDER_BY_ID.replace(":id", id),
        isLoading: true,
        });
    },
    
    updateOrderStatus: (id, status) => {
        return BaseService.put({
        url: API.ORDER.UPDATE_ORDER_STATUS.replace(":id", id),
        payload: status,
        isLoading: true,
        });
    },
    
    cancelOrder: (id) => {
        return BaseService.put({
        url: API.ORDER.CANCEL_ORDER.replace(":id", id),
        isLoading: true,
        });
    },
}