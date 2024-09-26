import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'utils/store';
import { api } from 'config/config';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import Signup from './Signup/Signup';
import FindId from './FindAccount/FindId';
import FindPassword from './FindAccount/FindPassword';
import Modal from './Modal/Modal';
import styles from './Login.module.css';

const Index = () => {
    const [user, setUser] = useState({ userId: '', userPw: '' });
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [isFindIdModalOpen, setIsFindIdModalOpen] = useState(false);
    const [isFindPasswordModalOpen, setIsFindPasswordModalOpen] = useState(false);

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = () => {
        api.post(`/auth/login`, user)
            .then((resp) => {
                if (resp.data && resp.data.token) {
                    const token = resp.data.token;
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.userId;
                    sessionStorage.setItem('token', token);
                    login(token, userId);
                    navigate("/");

                    fetchNotifications(token);
                    
                    Swal.fire({
                        icon: 'success',
                        title: '로그인 성공!',
                        text: '환영합니다!',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '로그인 실패',
                        text: '서버로부터 올바른 응답을 받지 못했습니다.',
                    });
                }
            })
            .catch((error) => {
                console.log("로그인 실패:", error);
                
                Swal.fire({
                    icon: 'error',
                    title: '로그인 실패',
                    text: '사용자 정보가 올바르지 않습니다.',
                });
            });
    };

    const fetchNotifications = (token) => {
        api.get(`/api/activities/unread`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            const unreadActivities = response.data;
            const unreadCount = unreadActivities.length;
            setNotificationCount(unreadCount);
            setUnreadNotifications(unreadCount > 0);
        })
        .catch((error) => {
            console.error("알림을 불러오는 중 오류 발생:", error);
            Swal.fire({
                icon: 'error',
                title: '알림 오류',
                text: '알림을 불러오는 중 문제가 발생했습니다.',
            });
        });
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const toggleSignup = () => setIsSignup(!isSignup);
    const openFindIdModal = () => setIsFindIdModalOpen(true);
    const closeFindIdModal = () => setIsFindIdModalOpen(false);
    const openFindPasswordModal = () => setIsFindPasswordModalOpen(true);
    const closeFindPasswordModal = () => setIsFindPasswordModalOpen(false);

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h1>9900</h1>
                {!isSignup ? (
                    <>
                        <div className={styles.loginContainer}>
                            <input 
                                type="text" 
                                name="userId" 
                                onChange={handleLoginChange} 
                                placeholder="ID" 
                                className={styles.input} 
                            />
                            <input 
                                type="password" 
                                name="userPw" 
                                onChange={handleLoginChange} 
                                onKeyDown={handleKeyDown} 
                                placeholder="PW" 
                                className={styles.input} 
                            />
                            <button 
                                onClick={handleLogin} 
                                className={styles.loginBtn}
                            >
                                로그인
                            </button>
                            {unreadNotifications && (
                                <div className={styles.notification}>
                                    {notificationCount}개의 읽지 않은 알림이 있습니다.
                                </div>
                            )}
                        </div>
                        <div className={styles.btns}>
                            <button
                                onClick={openFindIdModal}
                                className={styles.toggleButton}
                            >
                                아이디 찾기
                            </button>
                            <button
                                onClick={openFindPasswordModal}
                                className={styles.toggleButton}
                            >
                                비밀번호 찾기
                            </button>
                        </div>
                    </>
                ) : (
                    <Signup toggleSignup={toggleSignup} />
                )}
            </div>

            <Modal isOpen={isFindIdModalOpen} closeModal={closeFindIdModal}>
                <FindId closeModal={closeFindIdModal} />
            </Modal>

            <Modal isOpen={isFindPasswordModalOpen} closeModal={closeFindPasswordModal}>
                <FindPassword closeModal={closeFindPasswordModal} />
            </Modal>
        </div>
    );
};

export default Index;
