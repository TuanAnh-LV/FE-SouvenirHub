import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const ProductService = {
    getAllProducts: () => {
        return BaseService.get({
            url: API.PRODUCT.GET_ALL_PRODUCTS,
            isLoading: true,
        });
    }
};
  
