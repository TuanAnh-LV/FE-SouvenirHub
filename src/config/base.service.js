// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { getItemInLocalStorage } from './utils/localStorage';
// import { DOMAIN_ADMIN, LOCAL_STORAGE } from '../const/const';

// // const DOMAIN_ADMIN = 'your_api_base_url_here'; // Replace with your actual base URL
// // const LOCAL_STORAGE = {
// //     ACCOUNT_ADMIN: 'account_admin'
// // };

// export const axiosInstance = axios.create({
//     baseURL: DOMAIN_ADMIN,
//     headers: {
//         'content-type': 'application/json; charset=UTF-8'
//     },
//     timeout: 300000,
//     timeoutErrorMessage: `Connection is timeout exceeded`
// });

// const checkLoading = (isLoading) => {
//     if (isLoading) {
//         // Implement loading state management if necessary
//     }
// };

// export const BaseService = {
//     get({ url, isLoading = true, payload, headers }) {
//         const params = { ...payload };
//         for (const key in params) {
//             if (params[key] === '' && params[key] !== 0) {
//                 delete params[key];
//             }
//         }
//         checkLoading(isLoading);
//         return axiosInstance.get(url, {
//             params: params,
//             headers: headers || {}
//         });
//     },
//     post({ url, isLoading = true, payload, headers }) {
//         checkLoading(isLoading);
//         return axiosInstance.post(url, payload, {
//             headers: headers || {}
//         });
//     },
//     put({ url, isLoading = true, payload, headers }) {
//         checkLoading(isLoading);
//         return axiosInstance.put(url, payload, {
//             headers: headers || {}
//         });
//     },
//     remove({ url, isLoading = true, payload, headers }) {
//         checkLoading(isLoading);
//         return axiosInstance.delete(url, {
//             params: payload,
//             headers: headers || {}
//         });
//     },
//     uploadMedia(url, file, isMultiple = false, isLoading = true) {
//         const formData = new FormData();
//         if (isMultiple) {
//             for (let i = 0; i < file.length; i++) {
//                 formData.append("files[]", file[i]);
//             }
//         } else {
//             formData.append("file", file);
//         }
//         const user = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
//         checkLoading(isLoading);
//         return axios({
//             method: "post",
//             url: `${DOMAIN_ADMIN}${url}`,
//             data: formData,
//             headers: {
//                 "content-type": "multipart/form-data",
//                 "Authorization": `Bearer ${user.access_token}`,
//             }
//         }).then((res) => {
//             return res.data;
//         }).catch(error => {
//             handleErrorByToast(error);
//             return null;
//         });
//     }
// };

// const handleErrorByToast = (error) => {
//     const message = error.response?.data?.message || error.message;
//     toast.error(message);
//     return null;
// };

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (!config.headers) {
//             config.headers = {};
//         }
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (err) => {
//         handleErrorByToast(err);
//     }
// );

// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (err) => {
//         const { response } = err;
//         if (response) {
//             handleErrorByToast(err);
//         } else {
//             handleErrorByToast(err || "An error occurred. Please try again.");
//         }
//         return Promise.reject(err);
//     }
// );



import { toggleLoading } from '../../app/loadingSlice';
// import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import axios from 'axios';

// import { ApiRequestModel } from '../../model/ApiRequestModel';
import { toast } from 'react-toastify';
import { getItemInLocalStorage } from '../../utils/localStorage';
import { store } from "../../app/store";
import { DOMAIN_ADMIN, LOCAL_STORAGE } from '../const/const';
import { ROUTER_URL } from '../../const/router.const';
import { HttpException } from '../../app/toastException';

export const axiosInstance = axios.create({
    baseURL: DOMAIN_ADMIN,
    headers: {
        'content-type': 'application/json; charset=UTF-8'
    },
    timeout: 300000,
    timeoutErrorMessage: `Connection is timeout exceeded`
});

export const getState = (store) => {
    return store.getState();
}

export const BaseService = {
    getState({ url, isLoading = true, payload, headers }){
        const params = { ...payload }
        for (const key in params) {
            if ((params )[key] === '' && (params )[key] !== 0) {
                delete (params )[key]
            }
        }
        checkLoading(isLoading);
        return axiosInstance.get(
            `${url}`, {
            params: params,
            headers: headers || {}
        })
    },
    post({ url, isLoading = true, payload, headers })  {
        checkLoading(isLoading);
        return axiosInstance.post(
            `${url}`, payload, {
            headers: headers || {}
        })
    },
    put({ url, isLoading = true, payload, headers }) {
        checkLoading(isLoading);
        return axiosInstance.put(
            `${url}`, payload, {
            headers: headers || {}
        })
    },
    remove({ url, isLoading = true, payload, headers }) {
        checkLoading(isLoading);
        return axiosInstance.delete(
            `${url}`, {
            params: payload,
            headers: headers || {}
        })
    },
    getById({ url, isLoading = true, payload, headers }) {
        checkLoading(isLoading);
        return axiosInstance.get(
            `${url}`, {
            params: payload,
            headers: headers || {}
        })
    },
    uploadMedia(
        url,
        file,
        isMultiple = false,
        isLoading = true
    ) {
        const formData = new FormData();
        if (isMultiple) {
            for (let i = 0 ; i < file.length ; i++) {
                formData.append("files[]", file[i]);
            }
        } else {
            formData.append("file", file);
        }
        const user= getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
        checkLoading(isLoading);
        return axios({
            method: "post",
            url: `${DOMAIN_ADMIN}${url}`,
            data: formData,
            params: {},
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": `Bearer ${user.access_token}`,
            }
        }).then((res) => {
            store.dispatch(toggleLoading(false));
            return res.data;
        }).catch(error => {
            handleErrorByToast(error);
            return null;
        })
    }
}

const checkLoading = (isLoading= false) => {
    if (isLoading) store.dispatch(toggleLoading(true));
}




axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (!config.headers) {
            config.headers = {}; // Ensure headers is defined
        }
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Corrected header
        }
        return config;
    },
    (err) => {
        return handleErrorByToast(err);
    }
);

axiosInstance.interceptors.response.use(
    (config) => {
        store.dispatch(toggleLoading(false));
        return Promise.resolve(config);
    },
    (err) => {
        setTimeout(() => store.dispatch(toggleLoading(false)), 2000);
        const { response } = err;
        if (response) {
      switch (response.status) {
        case 401:
          localStorage.clear();
          setTimeout(() => {
            window.location.href = ROUTER_URL.LOGIN;
          }, 10000);
          break;
        case 403:
          handleErrorByToast(err);
          localStorage.clear();
          setTimeout(() => {
            window.location.href = ROUTER_URL.LOGIN;
          }, 2000);
          break;
        case 404:
          handleErrorByToast(err);
          // setTimeout(() => {
          //   window.location.href = ROUTER_URL.LOGIN;
          // }, 2000);
          break;
        case 500:
          handleErrorByToast(err);
          break;
        default:
          handleErrorByToast(response.data?.message || "An error occurred. Please try again.");
      }
    } else {
      handleErrorByToast(err || "An error occurred. Please try again.");
    }
    return Promise.reject(new HttpException(err, response?.status || 500));
    }
);

const handleErrorByToast = (error) => {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    store.dispatch(toggleLoading(false));
    return null;

};


