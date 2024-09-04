
import React from 'react'
import styles from './Login.module.css'
import { useState } from 'react';



const Login = () => {

    const [user, setUser] = useState({ id: '', pw: '' })

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }))
    }

    const handleLogin = () => {

    }
    return (
        <div className={styles.LoginContainer}>

            <div className={styles.LoginBox}>
                <input type="text" name="id" onChange={handleLoginChange} placeholder='ID' />
                <input type="password" name="pw" onChange={handleLoginChange} placeholder='PW' />
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