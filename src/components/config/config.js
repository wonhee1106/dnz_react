import axios from 'axios';
import { useAuthStore } from '../store/store';

export const api= axios.create({
    baseURL :process.env.REACT_APP_SERVER_URL
});

api.interceptors.request.use(
    (config) =>{
        const token =sessionStorage.getItem("token");
        if(token) {
            config.headers["Authorization"] =`bearer ${token}`;
        }
        return config;
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        switch (error.response.status){
            case 401:
                sessionStorage.removeItem("token");
                useAuthStore.getState().logout();
                break;
        }
    }
)