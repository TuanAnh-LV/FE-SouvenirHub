import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const ProductService = {
  getByid(id) {
    return BaseService.get({
      url: API.PRODUCT.GET_PRODUCT_BY_ID.replace(":id", id),
    });
  },
  getAll(params) {
    return BaseService.get({
      url: API.PRODUCT.GET_ALL_PRODUCTS,
      params,
      isLoading: true,
    });
  },
  createProduct: (data) => {
    return BaseService.post({
      url: API.PRODUCT.CREATE_PRODUCT,
      payload: data,
      isLoading: true,
    });
  },
  updateProduct: (id, data) => {
    return BaseService.put({
      url: API.PRODUCT.UPDATE_PRODUCT.replace(":id", id),
      payload: data,
      isLoading: true,
    });
  },
  deleteProduct: (id) => {
    return BaseService.remove({
      url: API.PRODUCT.DELETE_PRODUCT.replace(":id", id),
      isLoading: true,
    });
  },
  createProductImage: (id, files) => {
    const formData = new FormData();
    // files: array of File objects
    files.forEach((file) => {
      formData.append("images", file);
    });

    return BaseService.post({
      url: API.PRODUCT.CREATE_PRODUCT_IMAGE.replace(":id", id),
      payload: formData,
      isLoading: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getProductImages: (id) => {
    return BaseService.get({
      url: API.PRODUCT.CREATE_PRODUCT_IMAGE.replace(":id", id),
      isLoading: true,
    });
  },
};
