import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const VoucherService = {
  getAll: () => {
    return BaseService.get({
      url: API.VOUCHER.GET_VOUCHER,
      isLoading: true,
    });
  },

  getById: (id) => {
    return BaseService.get({
      url: API.VOUCHER.GET_VOUCHER_BY_ID.replace(":id", id),
      isLoading: true,
    });
  },

  createVoucher: (data) => {
    return BaseService.post({
      url: API.VOUCHER.ADD_VOUCHER,
      payload: data,
      isLoading: true,
    });
  },

  updateVoucher: (id, data) => {
    return BaseService.put({
      url: API.VOUCHER.UPDATE_VOUCHER.replace(":id", id),
      payload: data,
      isLoading: true,
    });
  },

  deleteVoucher: (id) => {
    return BaseService.remove({
      url: API.VOUCHER.DELETE_VOUCHER.replace(":id", id),
      isLoading: true,
    });
  },
};
