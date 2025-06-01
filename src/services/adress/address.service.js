import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const AddressService = {
    createAddress: (data) => {
        return BaseService.post({
            url: API.ADDRESS.CREATE_ADDRESS,
            payload :data,
            isLoading: true,
        });
    },
    getAddresses: () => {
        return BaseService.get({
            url: API.ADDRESS.GET_ADDRESSES,
            isLoading: true,
        });
    },
    updateAddress: (id, data) => {
        return BaseService.put({
            url: API.ADDRESS.UPDATE_ADDRESS.replace(":id", id),
            payload :data,
            isLoading: true,
        });
    },
    deleteAddress: (id) => {
        return BaseService.delete({
            url: API.ADDRESS.DELETE_ADDRESS.replace(":id", id),
            isLoading: true,
        });
    },
}