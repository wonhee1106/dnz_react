import axios from 'axios';
import { useAuthStore } from '../store/store';

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
    (error) => Promise.reject(error) // 요청 에러 핸들링
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) { // error.response가 존재할 때만 처리
            switch (error.response.status) {
                case 401:
                    sessionStorage.removeItem("token");
                    useAuthStore.getState().logout();
                    break;
                // 추가적인 에러 핸들링을 여기에 추가할 수 있습니다.
            }
        }
        return Promise.reject(error); // 에러를 다시 던져서 호출 측에서 처리할 수 있도록 함
    }
);
