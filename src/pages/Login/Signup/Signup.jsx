import React, { useState, useRef } from 'react'
import {
    requestEmailVerification,
    verifyEmailCode,
    checkIdExist,
    checkNameExist,
    checkEmailExist,
    checkPhoneExist,
} from '../../../utils/api'
import { validateSignupInputs } from '../../../utils/validation'
import styles from './Signup.module.css'
import { api } from '../../../config/config'
import { useNavigate } from 'react-router-dom'

const Signup = ({ toggleSignup }) => {
    const [signup, setSignup] = useState({
        userId: '',
        userPw: '',
        userPwConfirm: '',
        userName: '',
        userBirthDate: '', 
        userGender :'',
        userPhoneNumber: '',
        userEmail: '',
    })
 
    const navigate =useNavigate();
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')
    const [isVerificationRequestSent, setIsVerificationRequestSent] =useState(false)
    
    const userIdRef = useRef(null)
    const userEmailRef = useRef(null)
    const userPhoneRef = useRef(null)
    const userNameRef = useRef(null)
    const userPwConfirmRef = useRef(null)
    const userPwRef = useRef(null)


    const handleSignupChange = e => {
        const { name, value } = e.target;
        setSignup(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSignup = () => {
        if (!isEmailVerified) {
            alert('이메일 인증이 완료되지 않았습니다.')
            return
        }

        const validationError = validateSignupInputs(signup )
        if (validationError) {
            alert(validationError)
            return
        }

        const signupData = {
            userId: signup.userId,
            userPw: signup.userPw,
            userPwConfirm: signup.userPwConfirm,
            userName: signup.userName,
            userBirthDate: signup.userBirthDate,
            userGender:signup.userGender,
            userPhoneNumber: signup.userPhoneNumber,
            userEmail: signup.userEmail,
        }

        api.post(`/auth/registerUser`, signupData)
            .then(() => {
                alert('회원가입 완료')
                setSignup({
                    userId: '',
                    userPw: '',
                    userPwConfirm: '',
                    userName: '',
                    userBirthDate: '',
                    userGender:'',
                    userPhoneNumber: '',
                    userEmail: '',
                })
                setIsEmailVerified(false)
                setIsVerificationRequestSent(false)
            })
            .catch(err => {
                console.error(err); // 에러 로그를 확인
                alert('회원가입 실패: ' + err.response.data.message);
            });
    }


    const requestEmailVerificationHandler = () => {
        const validationError = validateSignupInputs(signup)
        if (validationError) {
            alert(validationError)
            return
        }

        if (!signup.userEmail) {
            alert('이메일을 입력해 주세요')
            return
        }

        requestEmailVerification(signup.userEmail)
            .then(() => {
                alert('이메일이 전송되었습니다. 이메일을 확인해주세요.')
                setIsVerificationRequestSent(true)
            })
            .catch(() => alert('이메일 전송 실패, 다시 시도하여 주세요'))
    }

    const verifyCodeHandler = () => {
        if (!verificationCode) {
            alert('인증 코드를 입력해 주세요.')
            return
        }

        verifyEmailCode(signup.userEmail, verificationCode)
            .then(resp => {
                if (resp.data === 'verified') {
                    setIsEmailVerified(true)
                    alert('이메일 인증 완료')
                } else {
                    alert('인증 코드가 올바르지 않습니다.')
                }
            })
            .catch(() => alert('인증 실패'))
    }

    const checkIdExistHandler = id => {
        checkIdExist(id)
            .then(() => {
                userIdRef.current.style.backgroundColor = '#e7ffef'
                userIdRef.current.style.borderColor = 'rgb(124 213 119)'
            })
            .catch(() => {
                userIdRef.current.style.backgroundColor = '#ffe1ca'
                userIdRef.current.style.borderColor = '#ffeedf'
            })
    }

    const checkNameExistHandler = name => {
        checkNameExist(name)
            .then(() => {
                console.log('닉네임이 사용 가능함') // 성공 메시지 확인
                userNameRef.current.style.backgroundColor = '#e7ffef'
                userNameRef.current.style.borderColor = 'rgb(124 213 119)'
            })
            .catch(() => {
                console.log('닉네임이 이미 사용 중임') // 실패 메시지 확인
                userNameRef.current.style.backgroundColor = '#ffe1ca'
                userNameRef.current.style.borderColor = '#ffeedf'
            })
    }

    const checkEmailExistHandler = email => {
        checkEmailExist(email)
            .then(() => {
                userEmailRef.current.style.backgroundColor = '#e7ffef'
                userEmailRef.current.style.borderColor = 'rgb(124 213 119)'
            })
            .catch(() => {
                userEmailRef.current.style.backgroundColor = '#ffe1ca'
                userEmailRef.current.style.borderColor = '#ffeedf'
            })
    }

    const checkPhoneExistHandler = phone => {
        checkPhoneExist(phone)
            .then(() => {
                userPhoneRef.current.style.backgroundColor = '#e7ffef'
                userPhoneRef.current.style.borderColor = 'rgb(124 213 119)'
            })
            .catch(() => {
                userPhoneRef.current.style.backgroundColor = '#ffe1ca'
                userPhoneRef.current.style.borderColor = '#ffeedf'
            })
    }

    return (
        <div className={styles.signupForm}>
            <div className={styles.signupContainer}>
              
                <p>ID</p>
                <input
                    type="text"
                    name="userId"
                    value={signup.userId}
                    onChange={handleSignupChange}
                    placeholder="6~20자리 아이디를 입력해 주세요"
                    className={styles.inputField}
                    onKeyUp={e => {
                        checkIdExistHandler(e.target.value)
                    }}
                    ref={userIdRef}
                />
                <p>Password</p>
                <input
                    type="password"
                    name="userPw"
                    value={signup.userPw}
                    onChange={handleSignupChange}
                    placeholder="8~12자리 대소문자, 숫자, 특수문자 포함"
                    className={styles.inputField}
                />
                <input
                    type="password"
                    name="userPwConfirm"
                    value={signup.userPwConfirm}
                    onChange={handleSignupChange}
                    placeholder="비밀번호 확인"
                    className={styles.inputField}
                    ref={userPwConfirmRef}
                />
                <p>Nickname</p>
                <input
                    type="text"
                    name="userName"
                    value={signup.userName}
                    onChange={handleSignupChange}
                    placeholder="2~15자 닉네임을 입력해 주세요"
                    className={styles.inputField}
                    onKeyUp={e => {
                        checkNameExistHandler(e.target.value)
                    }}
                    ref={userNameRef}
                />
                <p>Phone Number</p>
                <input
                    type="text"
                    name="userPhoneNumber"
                    value={signup.userPhoneNumber}
                    onChange={handleSignupChange}
                    placeholder="전화번호를 입력해 주세요"
                    className={styles.inputField}
                    onKeyUp={e => {
                        checkPhoneExistHandler(e.target.value)
                    }}
                    ref={userPhoneRef}
                    maxLength="11"
                />

                <p>생년월일</p>
                <div className={styles.birthDateContainer}>
                    <input
                        type="text"
                        name="userBirthDate"
                        value={signup.userBirthDate}
                        onChange={handleSignupChange}
                        placeholder="YYYYMMDD (8자리)"
                        className={styles.inputField}
                        maxLength="8"
                    />
                  
                </div>
                <div className={styles.InputGroup}>
                        <p>성별</p>
                        <label htmlFor="gender-m">남</label>
                        <input
                            type="radio"
                            value="M"
                            name="userGender"  // 같은 name 속성으로 그룹화
                            id="gender-m"
                            onChange={handleSignupChange} // 변화 감지
                        />
                        <label htmlFor="gender-f">여</label>
                        <input
                            type="radio"
                            value="F"
                            name="userGender"  // 같은 name 속성으로 그룹화
                            id="gender-f"
                            onChange={handleSignupChange} // 변화 감지
                        />
                    </div>

                <p>Email</p>
                <input
                    type="text"
                    name="userEmail"
                    value={signup.userEmail}
                    onChange={handleSignupChange}
                    placeholder="이메일 주소를 입력해 주세요"
                    className={styles.inputField}
                    onKeyUp={e => {
                        checkEmailExistHandler(e.target.value)
                    }}
                    ref={userEmailRef}
                />
                <button
                    onClick={requestEmailVerificationHandler}
                    disabled={isVerificationRequestSent}
                >
                    인증 코드 요청
                </button>
                {isVerificationRequestSent && (
                    <>
                        <p>인증 코드 입력</p>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                            placeholder="인증 코드를 입력해 주세요"
                            className={styles.inputField}
                        />
                        <button onClick={verifyCodeHandler}>
                            인증 코드 확인
                        </button>
                    </>
                )}
               
                <button onClick={handleSignup}>
                    회원가입
                </button>

                <button onClick={() =>navigate("/SignType")}>뒤로가기</button>

            </div>
        </div>
    )
}

export default Signup
