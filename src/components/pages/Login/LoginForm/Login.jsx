import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import { useAuthStore } from '../../../store/store';
import { api } from '../../../config/config';
import {jwtDecode} from 'jwt-decode'; // jwtDecode 임포트
import styles from './Login.module.css'; // CSS 모듈 임포트

const Login = () => {
    const [user, setUser] = useState({ userId: '', userPw: '' });
    const { login } = useAuthStore();
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = () => {
        api.post(`${ServerURL}/auth/login`, user)
            .then((resp) => {
                if (resp.data && resp.data.token) {
                    const token = resp.data.token;
                    sessionStorage.setItem('token', token); // JWT 토큰을 sessionStorage에 저장
                    login(token); // Zustand나 다른 상태 관리 툴로 로그인 상태 업데이트
                    navigate("/"); // 로그인 후 메인 페이지로 이동
    
                    // 읽음 상태 업데이트는 여기서 하지 않고, 알림을 불러오기만 함
                    api.get(`${ServerURL}/api/activities/unread`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    .then((response) => {
                        const unreadActivities = response.data;
                        const unreadCount = unreadActivities.length;
                        setNotificationCount(unreadCount); // 읽지 않은 알림 개수 설정
                        setUnreadNotifications(unreadCount > 0); // 읽지 않은 알림 여부 설정
                    })
                    .catch((error) => {
                        console.error("알림을 불러오는 중 오류 발생:", error);
                        // 오류 발생 시 사용자에게 피드백을 줄 수 있도록 처리
                        alert("알림을 불러오는 중 문제가 발생했습니다.");
                    });
                } else {
                    alert("로그인 실패: 서버로부터 올바른 응답을 받지 못했습니다.");
                }
            })
            .catch((error) => {
                console.log("로그인 실패:", error);
                alert("로그인 실패: 사용자 정보가 올바르지 않습니다.");
            });
    };
    
    
    
    const markAsRead = (userSeq) => {
        const token = sessionStorage.getItem('token'); // JWT 토큰을 세션에서 가져오기
        api.post(`${ServerURL}/api/activities/markAsRead`, { userSeq }, {
            headers: { Authorization: `Bearer ${token}` } // JWT 토큰을 헤더에 추가
        })
        .then(() => {
            console.log(`사용자 ${userSeq}의 활동이 읽음 처리되었습니다.`);
        })
        .catch((error) => {
            if (error.response) {
                console.error("읽음 상태 업데이트 중 오류 발생:", error.response.data);
                console.error("상태 코드:", error.response.status);
                console.error("헤더:", error.response.headers);
            } else if (error.request) {
                console.error("응답이 없었습니다:", error.request);
            } else {
                console.error("읽음 상태 업데이트 중 오류 발생:", error.message);
            }
        });
    };
    


    return (
        <div className={styles.loginContainer}> {/* 로그인 박스 스타일 적용 */}
            <input 
                type="text" 
                name="userId" 
                onChange={handleLoginChange} 
                placeholder="ID" 
                className={styles.input} // 스타일 적용
            />
            <input 
                type="password" 
                name="userPw" 
                onChange={handleLoginChange} 
                placeholder="PW" 
                className={styles.input} // 스타일 적용
            />
            <button 
                onClick={handleLogin} 
                className={styles.loginBtn} // 스타일 적용
            >
                로그인
            </button>
        </div>
    );
};

export default Login;
