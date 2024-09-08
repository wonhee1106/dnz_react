import React, { useState } from 'react';
import styles from './Login.module.css';
import { useAuthStore } from '../../store/store';
import { api } from '../../config/config';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const ServerURL = process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true;

const Login = () => {
    const [user, setUser] = useState({ userId: '', userPw: '' });
    const { login } = useAuthStore();
    const [isSignup, setIsSignup] = useState(false);
    const [signup, setSignup] = useState({
        userId: '',
        userPw: '',
        userName: '',
        userBirthDate: '',
        userPhoneNumber: '',
        userEmail: ''
    });
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignup((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = () => {
        api.post(`${ServerURL}/auth/login`, user)
            .then((resp) => {
                console.log(resp);
                const token = resp.data;
                const decoded = jwtDecode(token);
                console.log(decoded);
                sessionStorage.setItem('token', token);
                login(token); // 로그인 함수 호출
            })
            .catch((error) => {
                console.log(error);
                alert("로그인 실패");
            });
    };

    const handleSignup = () => {
        if (!isEmailVerified) {
            alert("이메일 인증이 완료되지 않았습니다.");
            return;
        }

        console.log(signup); // 데이터를 콘솔에 출력
        api.post(`${ServerURL}/auth/registerUser`, signup)
            .then((resp) => {
                console.log(resp);
                alert("회원가입 완료");
                setIsSignup(false);
            })
            .catch((error) => {
                console.log(error);
                alert("회원가입 실패");
            });
    };

    const toggleSignup = () => {
        setIsSignup(!isSignup);
    };

    const requestEmailVerification = () => {
        if (!signup.userEmail) {
            alert("이메일을 입력해 주세요");
            return;
        }

        api.post(`${ServerURL}/auth/requestEmailVerification/`+ signup.userEmail)
            .then((resp) => {
                console.log(resp);
                alert("이메일이 전송되었습니다. 이메일을 확인해주세요.");
                setIsEmailVerified(true); // 이메일 인증이 완료되지 않은 상태로 설정
            })
            .catch((error) => {
                console.log(error);
                alert("이메일 전송 실패, 다시 시도하여 주세요");
            });
    };

    const verifyCode = () => {
        if (!verificationCode) {
            alert("인증 코드를 입력해 주세요");
            return;
        }

        api.post(`${ServerURL}/auth/verifyEmail`, { userEmail: signup.userEmail, verificationCode: verificationCode })
            .then((resp) => {
                console.log(resp);
                if (resp.data === "verified") {
                    alert("이메일 인증이 완료되었습니다.");
                    setIsEmailVerified(true);
                } else {
                    alert("인증 코드가 올바르지 않습니다.");
                }
            })
            .catch((error) => {
                console.log(error);
                alert("인증 코드 검증 실패, 다시 시도하여 주세요");
            });
    };

    return (
        <div className={styles.LoginContainer}>
            <div className={styles.LoginBox}>
                {!isSignup ? (
                    <>
                        <input type="text" name="userId" onChange={handleLoginChange} placeholder='ID' />
                        <input type="password" name="userPw" onChange={handleLoginChange} placeholder='PW' />
                        <button className={styles.loginBtn} onClick={handleLogin}>로그인</button>
                        <div className={styles.btn}>
                            <button onClick={toggleSignup}>회원가입</button>
                            <button>아이디찾기</button>
                            <button>비밀번호찾기</button>
                        </div>
                    </>
                ) : (
                    <>
                        <input type="text" name='userId' onChange={handleSignupChange} placeholder='아이디' />
                        <input type="password" name='userPw' onChange={handleSignupChange} placeholder='비밀번호' />
                        <input type="text" name='userName' onChange={handleSignupChange} placeholder='닉네임' />
                        <input type="text" name='userBirthDate' onChange={handleSignupChange} placeholder='생년월일' />
                        <input type="text" name='userPhoneNumber' onChange={handleSignupChange} placeholder='핸드폰번호' />
                        <input type="email" name='userEmail' onChange={handleSignupChange} placeholder='이메일' />
                        <button onClick={requestEmailVerification}>이메일 인증 요청</button>
                        {!isEmailVerified && <p>이메일 인증을 완료해야 회원가입이 가능합니다.</p>}
                        {isEmailVerified && (
                            <>
                                <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder='인증 코드 입력' />
                                <button onClick={verifyCode}>인증 코드 확인</button>
                            </>
                        )}
                        <button onClick={handleSignup}>회원가입</button>
                        <button onClick={toggleSignup}>뒤로가기</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
