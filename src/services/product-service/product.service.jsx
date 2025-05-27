import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const ProductService = {
  getByid(id) {
    return BaseService.get({
      url: API.PRODUCT.GET_BY_ID.replace(":id", id),
    });
  },
  getAll() {
    return BaseService.get({
      url: API.PRODUCT.GET_ALL,
      isLoading: true,
    });
  },
};
