import styles from "./index.module.css"; // CSS 모듈로 변경
import React, { useState, useRef } from 'react';
import {
    requestEmailVerification,
    verifyEmailCode,
    checkIdExist,
    checkNameExist,
    checkEmailExist,
    checkPhoneExist,
} from '../../../../utils/api';
import { validateSignupInputs } from '../../../../utils/validation';
import { api } from '../../../../config/config';
import {useNavigate} from 'react-router-dom';
const OwnnerSignup = () => {
    const [signup, setSignup] = useState({
        userId: '',
        userPw: '',
        userPwConfirm: '',
        userName: '',
        userBirthDate: '',
        userGender: '',
        userPhoneNumber: '',
        userEmail: '',
    });
    const [storeData, setStoreData] = useState({
        businessNumber: '',
        storeAddress: '',
        representativeName: '',
        businessType: '',
    });

    const navigate =useNavigate();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationRequestSent, setIsVerificationRequestSent] = useState(false);

    const userIdRef = useRef(null);
    const userEmailRef = useRef(null);
    const userPhoneRef = useRef(null);
    const userNameRef = useRef(null);
    const userPwConfirmRef = useRef(null);
    const userPwRef = useRef(null);

    const handleSignupChange = e => {
        const { name, value } = e.target;
        setSignup(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStoreDataChange = e => {
        const { name, value } = e.target;
        setStoreData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignupOwner = () => {
        if (!isEmailVerified) {
            alert('이메일 인증이 완료되지 않았습니다.');
            return; 
        }

        const validationError = validateSignupInputs({ ...signup, ...storeData });
        if (validationError) {
            alert(validationError);
            return;
        }

        const ownerSignupData = {
            userId: signup.userId,
            userPw: signup.userPw,
            userPwConfirm: signup.userPwConfirm,
            userName: signup.userName,
            userBirthDate: signup.userBirthDate,
            userPhoneNumber: signup.userPhoneNumber,
            userEmail: signup.userEmail,
            userGender:signup.userGender,
            businessNumber: storeData.businessNumber,
            storeAddress: storeData.storeAddress,
            representativeName: storeData.representativeName,
            businessType: storeData.businessType,
        };

        api.post(`/auth/registerOwner`, ownerSignupData)
            .then(() => {
                alert('회원가입 완료');
                setSignup({
                    userId: '',
                    userPw: '',
                    userPwConfirm: '',
                    userName: '',
                    userBirthDate: '',
                    userGender:'',
                    userPhoneNumber: '',
                    userEmail: '',
                });
                setStoreData({
                    businessNumber: '',
                    storeAddress: '',
                    representativeName: '',
                    businessType: '',
                });
                setIsEmailVerified(false);
                setIsVerificationRequestSent(false);
            })
            .catch(err => {
                console.error(err);
                alert('점주 회원가입 실패: ' + err.response.data.message);
            });
    };

    const requestEmailVerificationHandler = () => {
        const validationError = validateSignupInputs(signup);
        if (validationError) {
            alert(validationError);
            return;
        }

        if (!signup.userEmail) {
            alert('이메일을 입력해 주세요');
            return;
        }

        requestEmailVerification(signup.userEmail)
            .then(() => {
                alert('이메일이 전송되었습니다. 이메일을 확인해주세요.');
                setIsVerificationRequestSent(true);
            })
            .catch(() => alert('이메일 전송 실패, 다시 시도하여 주세요'));
    };

    const verifyCodeHandler = () => {
        if (!verificationCode) {
            alert('인증 코드를 입력해 주세요.');
            return;
        }

        verifyEmailCode(signup.userEmail, verificationCode)
            .then(resp => {
                if (resp.data === 'verified') {
                    setIsEmailVerified(true);
                    alert('이메일 인증 완료');
                } else {
                    alert('인증 코드가 올바르지 않습니다.');
                }
            })
            .catch(() => alert('인증 실패'));
    };

    const checkIdExistHandler = id => {
        checkIdExist(id)
            .then(() => {
                userIdRef.current.style.backgroundColor = '#e7ffef';
                userIdRef.current.style.borderColor = 'rgb(124 213 119)';
            })
            .catch(() => {
                userIdRef.current.style.backgroundColor = '#ffe1ca';
                userIdRef.current.style.borderColor = '#ffeedf';
            });
    };

    const checkNameExistHandler = name => {
        checkNameExist(name)
            .then(() => {
                userNameRef.current.style.backgroundColor = '#e7ffef';
                userNameRef.current.style.borderColor = 'rgb(124 213 119)';
            })
            .catch(() => {
                userNameRef.current.style.backgroundColor = '#ffe1ca';
                userNameRef.current.style.borderColor = '#ffeedf';
            });
    };

    const checkEmailExistHandler = email => {
        checkEmailExist(email)
            .then(() => {
                userEmailRef.current.style.backgroundColor = '#e7ffef';
                userEmailRef.current.style.borderColor = 'rgb(124 213 119)';
            })
            .catch(() => {
                userEmailRef.current.style.backgroundColor = '#ffe1ca';
                userEmailRef.current.style.borderColor = '#ffeedf';
            });
    };

    const checkPhoneExistHandler = phone => {
        checkPhoneExist(phone)
            .then(() => {
                userPhoneRef.current.style.backgroundColor = '#e7ffef';
                userPhoneRef.current.style.borderColor = 'rgb(124 213 119)';
            })
            .catch(() => {
                userPhoneRef.current.style.backgroundColor = '#ffe1ca';
                userPhoneRef.current.style.borderColor = '#ffeedf';
            });
    };

    return (
        <div className={styles.OwnnerSignupContainer}>
            <div className={styles.OwnnerSignupContent}>
                <div className={styles.OwnnerSignupHeader}>
                    <h1 className={styles.logo}>9900</h1>
                    <p>점주 회원가입</p>
                </div>
                <hr />
                <div className={styles.OwnnerSignupBody}>
                    <div className={styles.InputGroup}>
                        <p>아이디</p>
                        <input
                            type="text"
                            name="userId"
                            value={signup.userId}
                            onChange={handleSignupChange}
                            placeholder="6~20자리 아이디를 입력해 주세요"
                            className={styles.inputField}
                            onKeyUp={e => checkIdExistHandler(e.target.value)}
                            ref={userIdRef}
                        />
                    </div>
                    <div className={styles.InputGroup}>
                        <p>비밀번호</p>
                        <input
                            type="password"
                            name="userPw"
                            value={signup.userPw}
                            onChange={handleSignupChange}
                            placeholder="8~12자리 대소문자, 숫자, 특수문자 포함"
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.InputGroup}>
                        <p>비밀번호 확인</p>
                        <input
                            type="password"
                            name="userPwConfirm"
                            value={signup.userPwConfirm}
                            onChange={handleSignupChange}
                            placeholder="비밀번호 확인"
                            className={styles.inputField}
                            ref={userPwConfirmRef}
                        />
                    </div>
                    <div className={styles.InputGroup}>
                        <p>닉네임</p>
                        <input
                            type="text"
                            name="userName"
                            value={signup.userName}
                            onChange={handleSignupChange}
                            placeholder="2~15자 닉네임을 입력해 주세요"
                            className={styles.inputField}
                            onKeyUp={e => checkNameExistHandler(e.target.value)}
                            ref={userNameRef}
                        />
                    </div>
                    <div className={styles.InputGroup}>
                        <p>휴대전화번호</p>
                        <input
                            type="text"
                            name="userPhoneNumber"
                            value={signup.userPhoneNumber}
                            onChange={handleSignupChange}
                            placeholder="전화번호를 입력해 주세요"
                            className={styles.inputField}
                            onKeyUp={e => checkPhoneExistHandler(e.target.value)}
                            ref={userPhoneRef}
                            maxLength="11"
                        />
                    </div>
                    <div className={styles.InputGroup}>
                        <p>생년월일</p>
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
                            name="userGender" 
                            id="gender-m"
                            onChange={handleSignupChange}
                        />
                        <label htmlFor="gender-f">여</label>
                        <input
                            type="radio"
                            value="F"
                            name="userGender"  
                            id="gender-f"
                            onChange={handleSignupChange} 
                        />
                    </div>

                    {/* <div className={styles.InputGroup}>
                        <p>이메일</p>
                        <input
                            type="email"
                            name="userEmail"
                            value={signup.userEmail}
                            onChange={handleSignupChange}
                            placeholder="이메일을 입력해 주세요"
                            className={styles.inputField}
                            onKeyUp={e => checkEmailExistHandler(e.target.value)}
                            ref={userEmailRef}
                        />
                        <button onClick={requestEmailVerificationHandler}>이메일 인증</button>
                    </div>
                    {isVerificationRequestSent && (
                        <div className={styles.InputGroup}>
                            <p>인증 코드</p>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={e => setVerificationCode(e.target.value)}
                                placeholder="인증 코드를 입력해 주세요"
                                className={styles.inputField}
                            />
                            <button onClick={verifyCodeHandler}>인증하기</button>
                        </div>
                    )}
                    <div className={styles.StoreDataSection}>
                        <h2>가게 정보</h2>
                        <div className={styles.InputGroup}>
                            <p>사업자등록번호</p>
                            <input
                                type="text"
                                name="businessNumber"
                                value={storeData.businessNumber}
                                onChange={handleStoreDataChange}
                                placeholder="사업자등록번호를 입력해 주세요"
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.InputGroup}>
                            <p>가게 주소</p>
                            <input
                                type="text"
                                name="storeAddress"
                                value={storeData.storeAddress}
                                onChange={handleStoreDataChange}
                                placeholder="가게 주소를 입력해 주세요"
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.InputGroup}>
                            <p>대표자 이름</p>
                            <input
                                type="text"
                                name="representativeName"
                                value={storeData.representativeName}
                                onChange={handleStoreDataChange}
                                placeholder="대표자 이름을 입력해 주세요"
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.InputGroup}>
                            <p>업종</p>
                            <input
                                type="text"
                                name="businessType"
                                value={storeData.businessType}
                                onChange={handleStoreDataChange}
                                placeholder="업종을 입력해 주세요"
                                className={styles.inputField}
                            />
                        </div>
                    </div> */}
                    <button className={styles.signupButton} onClick={handleSignupOwner}>회원가입</button>
                    <button onClick={() =>navigate("/SignType")}>뒤로가기</button>
                </div>
            </div>
        </div>
    );
};

export default OwnnerSignup;
