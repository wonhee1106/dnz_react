import React, { useState } from 'react';
import { api } from '../../../config/config';
import styles from './Find.module.css';

const FindPassword = ({ closeModal }) => {
    const [findUserId, setFindUserId] = useState('');
    const [findEmail, setFindEmail] = useState('');

    const handlePasswordRetrieval = () => {
        if (!findUserId || !findEmail) {
            alert("이메일과 아이디를 모두 입력해 주세요.");
            return;
        }

        api.post(`/auth/findPassword`, { userId: findUserId, userEmail: findEmail })
            .then(() => alert("비밀번호 찾기 요청이 완료되었습니다."))
            .catch(() => alert("사용자를 찾을 수 없습니다."));
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                아이디 
                <input 
                    type="text" 
                    value={findUserId} 
                    onChange={(e) => setFindUserId(e.target.value)} 
                    className={styles.input} 
                />
                이메일 
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
                    비밀번호 찾기
                </button>
                <button 
                    onClick={closeModal} 
                    className={styles.toggleButton}
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );
};

export default FindPassword;
