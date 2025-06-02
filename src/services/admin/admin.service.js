import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const AdminService = {
    getAllOrders: () => {
        return BaseService.get({
            url: API.ADMIN.GET_ALL_ORDER,
            isLoading: true,
        });
    },
    getOrderById: (id) => {
        return BaseService.get({
            url: API.ADMIN.GET_ORDER_BY_ID.replace(":id", id),
            isLoading: true,
        });
    },
    getAllShops: () => {
        return BaseService.get({
            url: API.ADMIN.GET_ALL_SHOPS,
            isLoading: true,
        });
    },
    getShopById: (id) => {
        return BaseService.get({
            url: API.ADMIN.GET_SHOP_BY_ID.replace(":id", id),
            isLoading: true,
        });
    },
    getAllUsers: () => {
        return BaseService.get({
            url: API.ADMIN.GET_ALL_USERS,
            isLoading: true,
        });
    },
    getUserById: (id) => {
        return BaseService.get({
            url: API.ADMIN.GET_USER_BY_ID.replace(":id", id),
            isLoading: true,
        });
    },
    getDashboardStats: () => {
        return BaseService.get({
            url: API.ADMIN.GET_DASHBOARD_STATS,
            isLoading: true,
        });
    },
    updateOrderStatus: (id, status) => {
        return BaseService.put({
            url: API.ADMIN.UPDATE_ORDER_STATUS.replace(":id", id),
            data: { status },
            isLoading: true,
        });
    },
    getAllPendingShops: () => {
        return BaseService.get({
            url: API.ADMIN.GET_ALL_PENDING_SHOPS,
            isLoading: true,
        });
    },
    approveShop: (id, payload) => {
        return BaseService.put({
          url: API.ADMIN.APPROVE_SHOP.replace(":id", id),
            payload,
          isLoading: true,
        });
      },      
    productApproved: (id) => {
        return BaseService.put({
            url: API.ADMIN.PRODUCT_APPROVED.replace(":id", id),
            isLoading: true,
        });
    },
    updateInfoShop: (id, data) => {
        return BaseService.put({
            url: API.ADMIN.UPDATE_INFO_SHOP.replace(":id", id),
            data,
            isLoading: true,
        });
    },
    getAllProductsPending: () => {
        return BaseService.get({
            url: API.ADMIN.GET_ALL_PRODUCTS_PENDING,
            isLoading: true,
        });
    },
    deleteShop: (id) => {
        return BaseService.delete({
            url: API.ADMIN.DELETE_SHOP.replace(":id", id),
            isLoading: true,
        });
    },
    getShopApplications: (id) => {
        return BaseService.get({
            url: API.SHOP_APPLICATION.GET_APPLICATION_BY_ID.replace(":id", id),
            isLoading: true,
        });
    },
};