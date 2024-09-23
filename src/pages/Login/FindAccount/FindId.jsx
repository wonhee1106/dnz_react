import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { api } from 'config/config';
import styles from './Find.module.css';

const FindId = ({ closeModal }) => {
    const [findEmail, setFindEmail] = useState('');
    const [findPhoneNumber, setFindPhoneNumber] = useState('');

    const handleFindId = () => {
        if (!findEmail || !findPhoneNumber) {
            Swal.fire({
                icon: 'warning',
                title: '입력 오류',
                text: '이메일과 핸드폰번호 모두 입력해주세요.',
            });
            return;
        }

        api.post(`/auth/findId`, { userEmail: findEmail, userPhoneNumber: findPhoneNumber })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '성공',
                    text: '사용자 ID가 이메일로 전송되었습니다.',
                });
                closeModal();
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: '찾기 실패',
                    text: '사용자를 찾을 수 없습니다.',
                });
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                이메일 
                <input 
                    type="text" 
                    value={findEmail} 
                    onChange={(e) => setFindEmail(e.target.value)} 
                    className={styles.input} 
                />
                핸드폰 
                <input 
                    type="text" 
                    value={findPhoneNumber} 
                    onChange={(e) => setFindPhoneNumber(e.target.value)} 
                    className={styles.input} 
                />
                <button 
                    onClick={handleFindId} 
                    className={styles.findIdBtn}
                >
                    아이디 찾기
                </button>
            </div>
        </div>
    );
};

export default FindId;
