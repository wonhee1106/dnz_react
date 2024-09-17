import React, { useState } from 'react';
import { api } from 'config/config';
import styles from './Find.module.css';

const FindId = ({ closeModal }) => {  // Add closeModal prop
    const [findEmail, setFindEmail] = useState('');
    const [findPhoneNumber, setFindPhoneNumber] = useState('');

    const handleFindId = () => {
        if (!findEmail || !findPhoneNumber) {
            alert("이메일과 핸드폰번호 모두 입력해주세요.");
            return;
        }

        api.post(`/auth/findId`, { userEmail: findEmail, userPhoneNumber: findPhoneNumber })
            .then(() => alert("사용자 ID가 이메일로 전송되었습니다."))
            .catch(error => alert("사용자를 찾을 수 없습니다."));
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
                <button 
                    onClick={closeModal}  // Add closeModal button
                    className={styles.toggleButton}
                >
                    뒤로가기
                </button>
          </div>
        </div>
    );
};

export default FindId;
