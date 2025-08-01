import { BaseService } from "../../config/base.service";
import { API } from "../../const/path.api";

export const NotificationService = {
  getByUserId: (userId) => {
    return BaseService.get({
      url: API.NOTIFICATION.GET_BY_USER_ID.replace(":userId", userId),
      isLoading: false,
    });
  },

create: (user_id, message) => {
  return BaseService.post({
    url: API.NOTIFICATION.CREATE,
    payload: { user_id, message },
    isLoading: false,
  });
},


  markAllAsRead: (userId) => {
    return BaseService.put({
      url: API.NOTIFICATION.MARK_ALL_AS_READ.replace(":userId", userId),
      isLoading: false,
    });
  },
  deleteAllByUser: (userId) => {
  return BaseService.remove({
    url: API.NOTIFICATION.DELETE_ALL_BY_USER.replace(":userId", userId),
    isLoading: false,
  });
},
};
