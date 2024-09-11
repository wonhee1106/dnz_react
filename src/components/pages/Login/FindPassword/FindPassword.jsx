import React, { useState } from 'react';
import { api } from '../../../config/config';
import commonStyles from '../common.module.css';
import styles from './FindPassword.module.css';

const FindPassword = ({ closeModal }) => {  // Add closeModal prop
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
        <div className={commonStyles.container}>
            <div className={commonStyles.box}>
                아이디 
                <input 
                    type="text" 
                    value={findUserId} 
                    onChange={(e) => setFindUserId(e.target.value)} 
                    className={commonStyles.input} 
                />
                이메일 
                <input 
                    type="text" 
                    value={findEmail} 
                    onChange={(e) => setFindEmail(e.target.value)} 
                    className={commonStyles.input} 
                />
                <button 
                    onClick={handlePasswordRetrieval} 
                    className={styles.findPasswordBtn}
                >
                    비밀번호 찾기
                </button>
                <button 
                    onClick={closeModal}  // Add closeModal button
                    className={commonStyles.toggleButton}
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );
};

export default FindPassword;
