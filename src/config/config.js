import axios from 'axios';
import { useAuthStore } from 'utils/store';

export const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    sessionStorage.removeItem("token");
                    useAuthStore.getState().logout();
                    break;
                default:
                    // 다른 에러 처리
                    break;
            }
        }
        return Promise.reject(error);
    }
);
