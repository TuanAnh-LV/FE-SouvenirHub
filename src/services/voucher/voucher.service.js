import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const VoucherService = {
    getAllVouchers: () => {
        return BaseService.get({
        url: API.VOUCHER.GET_ALL_VOUCHERS,
        isLoading: true,
        });
    },

    getVoucherById: (id) => {
        return BaseService.get({
        url: API.VOUCHER.GET_VOUCHER_BY_ID.replace(":id", id),
        isLoading: true,
        });
    },
    
    createVoucher: (data) => {
        return BaseService.post({
        url: API.VOUCHER.CREATE_VOUCHER,
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
        return BaseService.delete({
        url: API.VOUCHER.DELETE_VOUCHER.replace(":id", id),
        isLoading: true,
        });
    },
}