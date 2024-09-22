    import styles from "./index.module.css"; // CSS 모듈로 변경
    import InputGroup from "components/InputGroup";
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
                        <InputGroup 
                            type="text" title="아이디" description="?" 
                            btnComment="중복확인" placeholder="6~20자리 아이디를 입력해 주세요" keyUp={(e)=>console.log(e)} />
                        <InputGroup 
                            type="password" title="비밀번호" description="?" 
                            placeholder="8~12자리 대소문자, 숫자, 특수문자 포함" keyUp={(e)=>{}} />
                        <InputGroup 
                            type="password" title="비밀번호 확인" description="?" 
                            placeholder="비밀번호 확인"  keyUp={(e)=>{}} />
                        <InputGroup 
                            type="text" title="닉네임" description="?" 
                            placeholder="2~15자 닉네임을 입력해 주세요" keyUp={(e)=>{}}/>
                        <InputGroup 
                            type="number" title="전화번호" description="?" 
                            placeholder="전화번호를 입력해 주세요" keyUp={(e)=>{}}/>
                        <InputGroup 
                            type="date" title="생년월일" description="?" 
                            placeholder="생년월일를 입력해 주세요" keyUp={(e)=>{}}/>
                        <InputGroup 
                            type="gender" title="사업자 번호" keyUp={(e)=>{}}/>
                              <InputGroup 
                            type="number" title="가게 주소" description="" 
                            placeholder="전화번호를 입력해 주세요" keyUp={(e)=>{}}/>
                              <InputGroup 
                            type="number" title="대표 성함" description="" 
                            placeholder="전화번호를 입력해 주세요" keyUp={(e)=>{}}/>
                              <InputGroup 
                            type="number" title="업종" description="" 
                            placeholder="전화번호를 입력해 주세요" keyUp={(e)=>{}}/>
                            
                        <InputGroup 
                            type="email" title="이메일" description="?" 
                            btnComment="인증코드" placeholder="이메일 주소를 입력해 주세요" keyUp={(e)=>console.log(e)} />
                        <InputGroup 
                            type="text" title="인증코드" description="?" 
                            btnComment="확인" placeholder="인증코드를 입력해 주세요" keyUp={(e)=>console.log(e)} />
                        <button className={styles.signupButton} onClick={handleSignupOwner}>회원가입</button>
                        <button onClick={() =>navigate("/SignType")}>뒤로가기</button>
                    </div>
                </div>
            </div>
        );
    };

    export default OwnnerSignup;
