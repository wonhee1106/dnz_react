import axios from "axios";
import useAuthStore from "../store/authStore";  // 상태 관리 스토어

export const baseURL = process.env.REACT_APP_SERVER_URL;

export const api = axios.create({
    baseURL: baseURL,
});

// 클라이언트 측 요청 로그 확인
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        console.log("Token in sessionStorage:", token); // 추가된 로그

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
            console.log("Authorization Header set:", config.headers["Authorization"]); // 추가된 로그
        } else {
            console.warn("No token found in sessionStorage.");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        return response; // 응답이 성공적일 경우 그대로 반환
    },
    (error) => {
        if (error.response) {
            // 401 오류 처리
            if (error.response.status === 401) {
                console.warn("Unauthorized access - redirecting to login.");
                sessionStorage.removeItem("token"); // 세션에서 토큰 삭제
                useAuthStore.getState().logout();  // Zustand 스토어에서 로그아웃 처리
                window.location.href = '/login';   // 로그인 페이지로 리다이렉트
            }

            // 403 오류 처리 (권한 부족)
            if (error.response.status === 403) {
                console.error("Forbidden - insufficient permissions.");
                alert("권한이 부족합니다. 관리자에게 문의하세요.");
            }

            // 500 오류 처리 (서버 내부 오류)
            if (error.response.status === 500) {
                console.error("Server error - please try again later.");
                alert("서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.");
            }
        }
        return Promise.reject(error); // 에러가 발생했을 경우 반환
    }
);
