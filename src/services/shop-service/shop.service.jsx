import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const ShopService = {
  getByid(id) {
    return BaseService.get({
      url: API.SHOP.GET_SHOP_PROFILE.replace(":id", id),
    });
  },
};
