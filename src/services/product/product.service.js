import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const ProductService = {
    getAllProducts: (data) => {
        return BaseService.post({
            url: API.PRODUCT.GET_ALL_PRODUCTS,
            payload: data,
            isLoading: true,
        });
    }
};
  
