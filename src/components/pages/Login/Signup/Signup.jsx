import React, { useState } from 'react';
import { api } from '../../../config/config';
import styles from './Signup.module.css';

const Signup = ({ toggleSignup }) => {
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

    const requestEmailVerification = () => {
        if (!signup.userEmail) {
            alert("이메일을 입력해 주세요");
            return;
        }

        api.post(`/auth/requestEmailVerification/` + signup.userEmail)
            .then(resp => {
                alert('이메일이 전송되었습니다. 이메일을 확인해주세요.');
            })
            .catch((error) => {
                alert("이메일 전송 실패, 다시 시도하여 주세요");
            });
    };

    const verifyCode = () => {
        api.post(`/auth/verifyEmail`, { userEmail: signup.userEmail, verificationCode })
            .then(resp => {
                if (resp.data === "verified") {
                    setIsEmailVerified(true);
                    alert("이메일 인증 완료");
                } else {
                    alert('인증 코드가 올바르지 않습니다.');
                }
            })
            .catch(error => alert("인증 실패"));
    };

    const handleSignup = () => {
        if (!isEmailVerified) {
            alert("이메일 인증이 완료되지 않았습니다.");
            return;
        }

        api.post(`/auth/registerUser`, signup)
            .then(() => {
                alert("회원가입 완료");
                setSignup({
                    userId: '',
                    userPw: '',
                    userName: '',
                    userBirthDate: '',
                    userPhoneNumber: '',
                    userEmail: ''
                });
            })
            .catch(() => alert("회원가입 실패"));
    };

    return (
        <div className={styles.signupForm}>
            <div className={styles.signupContainer}>
                <input 
                    type="text" 
                    name="userId" 
                    onChange={handleSignupChange} 
                    placeholder="아이디" 
                    className={styles.inputField}
                />
                <input 
                    type="password" 
                    name="userPw" 
                    onChange={handleSignupChange} 
                    placeholder="비밀번호" 
                    className={styles.inputField}
                />
                <input 
                    type="text" 
                    name="userName" 
                    onChange={handleSignupChange} 
                    placeholder="닉네임" 
                    className={styles.inputField}
                />
                <input 
                    type="text" 
                    name="userBirthDate" 
                    onChange={handleSignupChange} 
                    placeholder="생년월일" 
                    className={styles.inputField}
                />
                <input 
                    type="text" 
                    name="userPhoneNumber" 
                    onChange={handleSignupChange} 
                    placeholder="핸드폰번호" 
                    className={styles.inputField}
                />
                <input 
                    type="email" 
                    name="userEmail" 
                    onChange={handleSignupChange} 
                    placeholder="이메일" 
                    className={styles.inputField}
                />
                <button 
                    onClick={requestEmailVerification} 
                    className={styles.actionButton}
                >
                    이메일 인증 요청
                </button>
                <input 
                    type="text" 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value)} 
                    placeholder="인증 코드" 
                    className={styles.inputField}
                />
                <button 
                    onClick={verifyCode} 
                    className={styles.actionButton}
                >
                    인증 코드 확인
                </button>
                <button 
                    onClick={handleSignup} 
                    className={styles.actionButton}
                >
                    회원가입
                </button>
                <button 
                    onClick={toggleSignup} 
                    className={styles.actionButton}
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );
};

export default Signup;
