import { toggleLoading } from '../app/loadingSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getItemInLocalStorage } from '../utils/localStorage';
import store from "../app/store";
import { DOMAIN_ADMIN, LOCAL_STORAGE } from '../const/const';
import { ROUTER_URL } from '../const/router.const';
import { HttpException } from '../app/toastException';

export const axiosInstance = axios.create({
  baseURL: DOMAIN_ADMIN,
  headers: {
    'content-type': 'application/json; charset=UTF-8'
  },
  timeout: 300000,
  timeoutErrorMessage: `Connection timeout exceeded`
});

// ✅ Interceptor tự động thêm Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (!config.headers) config.headers = {};
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// ✅ Interceptor xử lý lỗi toàn cục
axiosInstance.interceptors.response.use(
  (res) => {
    store.dispatch(toggleLoading(false));
    return res;
  },
  (err) => {
    store.dispatch(toggleLoading(false));
    const { response } = err;
    if (response?.status === 401) {
      localStorage.clear();
      window.location.href = ROUTER_URL.LOGIN;
    }
    handleErrorByToast(err);
    return Promise.reject(new HttpException(err, response?.status || 500));
  }
);

// ✅ Hiện loading nếu cần
const checkLoading = (isLoading = false) => {
  if (isLoading) store.dispatch(toggleLoading(true));
};

// ✅ Toast lỗi
const handleErrorByToast = (error) => {
  const message = error.response?.data?.message || error.message;
  toast.error(message);
  store.dispatch(toggleLoading(false));
  return null;
};

// ✅ Service chung
export const BaseService = {
  get({ url, isLoading = true, payload = {}, headers = {} }) {
    const params = { ...payload };
    for (const key in params) {
      if (params[key] === '' && params[key] !== 0) {
        delete params[key];
      }
    }
    checkLoading(isLoading);
    return axiosInstance.get(url, { params, headers });
  },

  post({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);
    return axiosInstance.post(url, payload, { headers });
  },

  put({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);
    return axiosInstance.put(url, payload, { headers });
  },

  remove({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);
    return axiosInstance.delete(url, { params: payload, headers });
  },

  getById({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);
    return axiosInstance.get(url, { params: payload, headers });
  },

  uploadMedia(url, file, isMultiple = false, isLoading = true) {
    const formData = new FormData();
    if (isMultiple) {
      for (let i = 0; i < file.length; i++) {
        formData.append("files[]", file[i]);
      }
    } else {
      formData.append("file", file);
    }

    const user = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    checkLoading(isLoading);

    return axios({
      method: "post",
      url: `${DOMAIN_ADMIN}${url}`,
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
        "Authorization": `Bearer ${user?.access_token || ''}`,
      }
    })
      .then((res) => {
        store.dispatch(toggleLoading(false));
        return res.data;
      })
      .catch((error) => {
        handleErrorByToast(error);
        return null;
      });
  }
};
