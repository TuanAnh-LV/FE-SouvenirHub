import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const ProductService = {
    createShop: (data) => {
        return BaseService.post({
          url: API.SHOP.CREATE_SHOP,
          payload: data,
          isLoading: true,
        });
      },
    getCurrentShop: () => {
        return BaseService.get({
            url: API.SHOP.GET_CURRENT_SHOP,
            isLoading: true,
        });
    },
    getShopById: (id) => {
        return BaseService.get({
            url: API.SHOP.GET_SHOP_BY_ID.replace(':id', id),
            isLoading: true,
        });
    },
    updateShop: (data) => {
        return BaseService.put({
            url: API.SHOP.UPDATE_SHOP,
            payload: data,
            isLoading: true,
        });
    },
    deleteShop: (id) => {
        return BaseService.delete({
            url: API.SHOP.DELETE_SHOP.replace(':id', id),
            isLoading: true,
        });
    },
    getShopApplications: (params) => {
        return BaseService.get({
            url: API.SHOP_APPLICATION.GET_APPLICATION_BY_ID.replace(':id', params.id),
            isLoading: true,
        });
    },
    createShopApplication: (data) => {
        return BaseService.post({
            url: API.SHOP_APPLICATION.CREATE_APPLICATION,
            payload: data,
            isLoading: true,
        });
    },
  };
  
