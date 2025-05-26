import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const AuthService = {
  login(params) {
    return BaseService.post({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true,
    });
  },
  loginGoogle: (payload) => {
    return BaseService.post({
      url: API.AUTH.LOGIN_GOOGLE,
      payload,
      isLoading: true,
    });
  },
  getUserRole: () => {
    return BaseService.get({
      url: API.AUTH.GET_CURRENT_USER_INFO,
      isLoading: true,
    });
  },
  register(params) {
    return BaseService.post({
      url: API.AUTH.REGISTER,
      payload: params,
      isLoading: true,
    });
  },
};
