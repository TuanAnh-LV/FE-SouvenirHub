import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const PaymentService = {
  mockPay: (data) => {
    return BaseService.post({
      url: API.PAYMENT.MOCK,
      payload: data,
      isLoading: true,
    });
  },

  createMomo: (data) => {
    return BaseService.post({
      url: API.PAYMENT.MOMO_CREATE,
      payload: data,
      isLoading: true,
    });
  },

  createPayOS: (data) => {
    return BaseService.post({
      url: API.PAYMENT.PAYOS_CREATE,
      payload: data,
      isLoading: true,
    });
  },

  confirmOnline: (data) => {
    return BaseService.post({
      url: API.PAYMENT.ONLINE,
      payload: data,
      isLoading: true,
    });
  },
};
