import axios from 'axios';

const api= axios.create({
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