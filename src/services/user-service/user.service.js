import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const UserService = {
    updateProfile: (data) => {
        return BaseService.put({
            url: API.USER.UPDATE_PROFILE,
            payload: data,
            isLoading: true,
        });
    },
    getUserInfo: () => {
        return BaseService.get({
            url: API.USER.GET_USER_INFO,
            isLoading: true,
        });
    },
  };
  
