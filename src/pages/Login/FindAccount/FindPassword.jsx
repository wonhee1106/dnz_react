import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { api } from 'config/config';
import styles from './Find.module.css';

const FindPassword = ({ closeModal }) => {
    const [findUserId, setFindUserId] = useState('');
    const [findEmail, setFindEmail] = useState('');

    const handlePasswordRetrieval = () => {
        if (!findUserId || !findEmail) {
            Swal.fire({
                icon: 'warning',
                title: '입력 오류',
                text: '아이디와 이메일을 모두 입력해주세요.',
            });
            return;
        }

        api.post(`/auth/findPassword`, { userId: findUserId, userEmail: findEmail })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '성공',
                    text: '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
                });
                closeModal();
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: '찾기 실패',
                    text: '사용자를 찾을 수 없습니다.',
                });
            });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>비밀번호 재설정</h2>
            <div className={styles.box}>
                <label>아이디</label>
                <input 
                    type="text" 
                    value={findUserId} 
                    onChange={(e) => setFindUserId(e.target.value)} 
                    className={styles.input} 
                />
                <label>이메일</label>
                <input 
                    type="text" 
                    value={findEmail} 
                    onChange={(e) => setFindEmail(e.target.value)} 
                    className={styles.input} 
                />
                <button 
                    onClick={handlePasswordRetrieval} 
                    className={styles.findIdBtn}
                >
                    비밀번호 재설정
                </button>
            </div>
        </div>
    );
};

export default FindPassword;
