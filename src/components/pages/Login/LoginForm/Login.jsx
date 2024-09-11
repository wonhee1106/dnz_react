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
        api.post(`/auth/login`, user)
            .then((resp) => {
                if (resp.data && resp.data.token) {
                    const token = resp.data.token;
                    console.log('토큰:', token); // 토큰 값을 로그로 출력
                    const decoded = jwtDecode(token); // jwtDecode 사용
                    sessionStorage.setItem('token', token);
                    login(token);
                    navigate('/'); // 페이지 이동
                } else {
                    alert("로그인 실패");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("로그인 실패");
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
