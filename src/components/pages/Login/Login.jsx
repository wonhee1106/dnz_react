
import React from 'react'
import styles from './Login.module.css'
import { useState } from 'react';
import { useAuthStore } from '../../store/store';
import { api } from '../../config/config';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'


const ServerURL =process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true;
const Login = () => {

    const [user, setUser] = useState({ userId: '', userPw: '' })
    const { login } = useAuthStore();

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }))
    }

    const handleLogin = () => {
         api.post(`${ServerURL}/auth/login`, user).then((resp) => {
            console.log(resp);
            const token = resp.data
            const decoded = jwtDecode(token);
            console.log(decoded);
            sessionStorage.setItem('token', token);
            login(token); // 로그인 함수 호출
        }).catch((error) => {
            console.log(error);
        })

    }
    return (
        <div className={styles.LoginContainer}>

            <div className={styles.LoginBox}>
                <input type="text" name="userId" onChange={handleLoginChange} placeholder='ID' />
                <input type="password" name="userPw" onChange={handleLoginChange} placeholder='PW' />
                <button className={styles.loginBtn} onClick={handleLogin}>로그인</button>
                <div className={styles.btn}>
                    <button>회원가입</button>
                    <button>아이디찾기</button>
                    <button>비밀번호찾기</button>
                </div>
            </div>
        </div>
    )
}

export default Login