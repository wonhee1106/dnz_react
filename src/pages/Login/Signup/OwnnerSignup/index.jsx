import styles from "./index.module.css"; // CSS 모듈로 스타일을 불러옵니다
import InputGroup from "components/InputGroup"; // 입력 필드를 위한 컴포넌트
import React, { useState, useRef } from 'react';
import {
    requestEmailVerification,
    verifyEmailCode,
    checkIdExist,
    checkNameExist,
    checkEmailExist,
    checkPhoneExist,
} from '../../../../utils/api'; // API 요청 함수들
import { validateSignupInputs } from '../../../../utils/validation'; // 입력값 검증 함수
import { api } from '../../../../config/config'; // API 설정
import { useNavigate } from 'react-router-dom'; // 페이지 네비게이션을 위한 훅
import { useEffect } from "react";
import Swal from 'sweetalert2';

const OwnnerSignup = () => {



    const [signup, setSignup] = useState({
        userId: '',
        userPw: '',
        userPwConfirm: '',
        userName: '',
        userBirthDate: '',
        userGender: 'M',
        userPhoneNumber: '',
        userEmail: '',
    });

    const [storeData, setStoreData] = useState({
        businessNumber: '',
        storeAddress: '',
        representativeName: '',
        businessType: '',
    });

    const navigate = useNavigate();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationRequestSent, setIsVerificationRequestSent] = useState(false);


    const handleSignupChange = ({ name, value }) => {
        setSignup(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleSignupChange = ({ name, value }) => {
    //     setSignup(prev => {
    //         const newState = { ...prev, [name]: value };
    //         console.log("Updated signup state:", newState); // 추가
    //         return newState;
    //     });
    // };


    const handleStoreDataChange = ({ name, value }) => {
        setStoreData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSignupOwner = () => {
        if (!isEmailVerified) {
            Swal.fire({
                title: '이메일 인증 필요',
                text: '이메일 인증이 완료되지 않았습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
            });
            return;
        }

        const validationError = validateSignupInputs({ ...signup, ...storeData });
        if (validationError) {
            Swal.fire({
                title: '입력 오류',
                text: validationError,
                icon: 'error',
                confirmButtonText: '확인',
            });
            return;
        }

        const ownerSignupData = {
            ...signup,
            ...storeData,
        };

        api.post(`/auth/registerOwner`, ownerSignupData)
            .then(() => {
                Swal.fire({
                    title: '회원가입 완료',
                    text: '환영합니다! 점주 회원가입이 완료되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                }).then(() => {
                    navigate('/login');
                });
                resetForm();
            })
            .catch(err => {
                console.error(err);
                Swal.fire({
                    title: '회원가입 실패',
                    text: '점주 회원가입 실패: ' + err.response.data.message,
                    icon: 'error',
                    confirmButtonText: '확인',
                });
            });
    };

    const requestEmailVerificationHandler = () => {
        const validationError = validateSignupInputs(signup);
        if (validationError) {
            Swal.fire({
                title: '입력 오류',
                text: validationError,
                icon: 'error',
                confirmButtonText: '확인',
            });
            return;
        }

        if (!signup.userEmail) {
            Swal.fire({
                title: '이메일 필요',
                text: '이메일을 입력해 주세요.',
                icon: 'warning',
                confirmButtonText: '확인',
            });
            return;
        }

        requestEmailVerification(signup.userEmail)
            .then(() => {
                Swal.fire({
                    title: '이메일 전송 완료',
                    text: '이메일이 전송되었습니다. 이메일을 확인해주세요.',
                    icon: 'success',
                    confirmButtonText: '확인',
                });
                setIsVerificationRequestSent(true);
            })
            .catch(() => Swal.fire({
                title: '전송 실패',
                text: '이메일 전송 실패, 다시 시도하여 주세요.',
                icon: 'error',
                confirmButtonText: '확인',
            }));
    };

    const verifyCodeHandler = () => {
        if (!verificationCode) {
            Swal.fire({
                title: '코드 필요',
                text: '인증 코드를 입력해 주세요.',
                icon: 'warning',
                confirmButtonText: '확인',
            });
            return;
        }

        verifyEmailCode(signup.userEmail, verificationCode)
            .then(resp => {
                if (resp.data === 'verified') {
                    setIsEmailVerified(true);
                    Swal.fire({
                        title: '인증 완료',
                        text: '이메일 인증이 완료되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인',
                    });
                } else {
                    Swal.fire({
                        title: '인증 실패',
                        text: '인증 코드가 올바르지 않습니다. 다시 시도해 주세요.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                }
            })
            .catch(err => {
                Swal.fire({
                    title: '인증 실패',
                    text: '인증 실패: ' + err.message,
                    icon: 'error',
                    confirmButtonText: '확인',
                });
            });
    };


     // 폼 리셋 함수
     const resetForm = () => {
        setSignup({
            userId: '',
            userPw: '',
            userPwConfirm: '',
            userName: '',
            userBirthDate: '',
            userGender: 'M',
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
        setVerificationCode('');
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
                        type="text" title="아이디"
                        placeholder="6~20자리 아이디를 입력해 주세요"
                        keyUp={handleSignupChange}
                        click={() => Swal.fire("중복확인")}
                        name="userId"
                    />
                    <InputGroup
                        type="password" title="비밀번호"
                        placeholder="8~12자리 대소문자, 숫자, 특수문자 포함"
                        keyUp={handleSignupChange}
                        name="userPw"


                    />
                    <InputGroup
                        type="password" title="비밀번호 확인"
                        description={signup.userPw === signup.userPwConfirm ? "비밀번호가 서로 일치합니다" : "비밀번호가 서로 다릅니다."}
                        placeholder="비밀번호 확인"
                        keyUp={handleSignupChange}
                        name="userPwConfirm"

                    />
                    <InputGroup
                        type="text" title="닉네임"
                        placeholder="2~15자 닉네임을 입력해 주세요"
                        keyUp={handleSignupChange}
                        name="userName"

                    />
                    <InputGroup
                        type="text" title="전화번호"
                        placeholder="전화번호를 입력해 주세요"
                        keyUp={handleSignupChange}
                        name="userPhoneNumber"

                    />
                    <InputGroup
                        type="text"
                        title="생년월일"
                        placeholder="YYYYMMDD를 입력해 주세요"
                        keyUp={({ name, value }) => handleSignupChange({ name, value })}
                        name="userBirthDate"
                        maxLength={8} // 최대 8자 입력 가능
                    />


                    <InputGroup
                        type="gender" title="성별"
                        genderValue={(value) => setSignup(prev => ({ ...prev, userGender: value }))}
                        name="userGender"
                    />
                    <InputGroup
                        type="text" title="상호 지점명"
                        placeholder="예시) 스시코우지"
                        keyUp={handleStoreDataChange}
                        name="businessNumber"



                    />
                    <InputGroup
                        type="text" title="가게 지역"
                        placeholder="가게지역을 입력해 주세요"
                        keyUp={handleStoreDataChange}
                        name="storeAddress"

                    />
                    <InputGroup
                        type="text" title="대표 성함"
                        placeholder="매장 점주님의 성함을 입력해 주세요"
                        keyUp={handleStoreDataChange}
                        name="representativeName"
                    />
                    <InputGroup
                        type="select" title="업종"
                        // placeholder="매장 업종을 선택해주세요"
                        keyUp={handleStoreDataChange}
                        name="businessType"
                        options={[
                            { value: '', label: '업종을 선택하세요' }, // 기본 선택 옵션
                            { value: '일식', label: '일식' },
                            { value: '양식', label: '양식' },
                            { value: '중식', label: '중식' },
                            { value: '디저트', label: '디저트' },
                        ]}
                    />
                    <InputGroup
                        type="email" title="이메일"
                        btnComment="인증코드"
                        placeholder="이메일 주소를 입력해 주세요"
                        keyUp={handleSignupChange}
                        click={requestEmailVerificationHandler}
                        name="userEmail"
                    />
                    <InputGroup
                        type="text"
                        title="인증코드"
                        btnComment="확인"
                        placeholder="인증코드를 입력해 주세요"
                        keyUp={({ value }) => setVerificationCode(value)} // 여전히 keyUp 사용
                        click={verifyCodeHandler}
                    />

                    <button className={styles.signupButton} onClick={handleSignupOwner}>회원가입</button>
                    <button className={styles.backButton} onClick={() => navigate("/SignType")}>뒤로가기</button>
                </div>
            </div>
        </div>
    );
};

//점주

export default OwnnerSignup;
