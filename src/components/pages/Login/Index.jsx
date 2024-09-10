import React, { useState } from 'react';
import styles from './Login.module.css';
import { useAuthStore } from '../../store/store';
import { api } from '../../config/config';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal/Modal'

const ServerURL = process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true;

const Index = () => {
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordRetrievalOpen, setIsPasswordRetrievalOpen] = useState(false);
    
    // 추가된 state
    const [findUserId, setFindUserId] = useState('');
    const [findEmail, setFindEmail] = useState('');

    const navigate = useNavigate();

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignup((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    // 로그인
    const handleLogin = () => {
        api.post(`${ServerURL}/auth/login`, user)
            .then((resp) => {
                console.log(resp);
                const token = resp.data;
                const decoded = jwtDecode(token);
                console.log(decoded);
                sessionStorage.setItem('token', token);
                login(token); // 로그인 함수 호출
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
                alert("로그인 실패");
            });
    };

    // 회원가입
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
                // 상태 초기화
                setSignup({
                    userId: '',
                    userPw: '',
                    userName: '',
                    userBirthDate: '',
                    userPhoneNumber: '',
                    userEmail: ''
                });
                setIsEmailVerified(false);
            })
            .catch((error) => {
                console.log(error);
                alert("회원가입 실패");
            });
    };

    // 토글 화면 전환
    const toggleSignup = () => {
        setIsSignup(!isSignup);
    };

    // 이메일 전송
    const requestEmailVerification = () => {
        if (!signup.userEmail) {
            alert("이메일을 입력해 주세요");
            return;
        }

        api.post(`${ServerURL}/auth/requestEmailVerification/` + signup.userEmail)
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

    // 이메일 인증 코드
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
                alert("인증 코드 검증 실패, 다시 시도해 주세요");
            });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openPasswordRetrievalModal = () => {
        setIsPasswordRetrievalOpen(true);
    };

    const closePasswordRetrievalModal = () => {
        setIsPasswordRetrievalOpen(false);
    };

    // 아이디 재설정
    const handleFindId = () => {
        if (!findEmail || !findUserId) {
            alert("이메일과 아이디를 모두 입력해주세요.");
            return;
        }

        api.post(`${ServerURL}/auth/findId`, { userEmail: findEmail, userPhoneNumber: findUserId })
            .then((resp) => {
                console.log(resp);
                alert(`아이디는 ${resp.data.userId} 입니다.`);
            })
            .catch((error) => {
                console.log(error);
                alert("아이디 찾기 실패. 다시 시도해 주세요.");
            });
    };

    // 비밀번호 재설정
    const handlePasswordRetrieval = () => {
        // 이메일과 아이디가 입력되지 않은 경우 처리
        if (!findUserId ||!findEmail ) {
            alert("이메일과 아이디를 모두 입력해 주세요.");
            return;
        }
    
        
        api.post(`${ServerURL}/auth/findPassword`, { userId: findUserId ,userEmail: findEmail})
            .then((resp) => {
                console.log(resp);
                alert("비밀번호 찾기 요청이 완료되었습니다. 이메일을 확인해주세요.");
            })
            .catch((error) => {
                // 서버에서 반환된 응답 처리
                if (error.response) {
                    if (error.response.status === 404) {
                        alert("사용자를 찾을 수 없습니다. 이메일과 아이디를 확인해주세요.");
                    } else if (error.response.status === 400) {
                        alert("이메일과 아이디는 필수 입력 항목입니다.");
                    } else if (error.response.status === 500) {
                        alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
                    } else {
                        alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
                    }
                } else {
                    // 서버 자체에 연결되지 않은 경우
                    alert("서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
                }
                console.log(error); // 에러 디버깅을 위한 로그 출력
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
                            <button onClick={openModal}>아이디찾기</button>
                            <button onClick={openPasswordRetrievalModal}>비밀번호 찾기</button>
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

            {/* 모달 컴포넌트 */}
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                <h2>아이디 찾기</h2>
                이메일 <input type="text" value={findEmail} onChange={(e) => setFindEmail(e.target.value)} placeholder='이메일' /><br />
                핸드폰 <input type="text" value={findUserId} onChange={(e) => setFindUserId(e.target.value)} placeholder='핸드폰번호' /><br />
                <button onClick={handleFindId}>아이디 찾기</button>
                <button onClick={closeModal}>닫기</button>
            </Modal>

            <Modal isOpen={isPasswordRetrievalOpen} closeModal={closePasswordRetrievalModal}>
                <h2>비밀번호 찾기</h2>
                아이디 <input type="text" value={findUserId} onChange={(e) => setFindUserId(e.target.value)} placeholder='아이디' /><br />
                이메일 <input type="text" value={findEmail} onChange={(e) => setFindEmail(e.target.value)} placeholder='이메일' /><br />
                <button onClick={handlePasswordRetrieval}>비밀번호 찾기</button>
                <button onClick={closePasswordRetrievalModal}>닫기</button>
            </Modal>

        </div>
    );
};

export default Index;

