import React, { useState } from 'react';
import Login from './LoginForm/Login';
import Signup from './Signup/Signup';
import FindId from './FindId/FindId';
import FindPassword from './FindPassword/FindPassword';
import Modal from './Modal/Modal';
import commonStyles from './common.module.css';

const Index = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [isFindIdModalOpen, setIsFindIdModalOpen] = useState(false);
    const [isFindPasswordModalOpen, setIsFindPasswordModalOpen] = useState(false);

    const toggleSignup = () => setIsSignup(!isSignup);
    const openFindIdModal = () => setIsFindIdModalOpen(true);
    const closeFindIdModal = () => setIsFindIdModalOpen(false);
    const openFindPasswordModal = () => setIsFindPasswordModalOpen(true);
    const closeFindPasswordModal = () => setIsFindPasswordModalOpen(false);

    return (
        <div className={commonStyles.container}>
            <div className={commonStyles.box}>
                {!isSignup ? (
                    <>
                        <Login />
                        <div className={commonStyles.btns}>
                            <button
                                onClick={toggleSignup}
                                className={commonStyles.toggleButton}
                            >
                                회원가입
                            </button>
                            <button
                                onClick={openFindIdModal}
                                className={commonStyles.toggleButton}
                            >
                                아이디 찾기
                            </button>
                            <button
                                onClick={openFindPasswordModal}
                                className={commonStyles.toggleButton}
                            >
                                비밀번호 찾기
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Signup />
                        <button
                            onClick={toggleSignup}
                            className={commonStyles.toggleButton}
                        >
                            뒤로가기
                        </button>
                    </>
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
