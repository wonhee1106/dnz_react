import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StoreManagement.module.css'; // CSS 모듈 가져오기

const StoreManagement = () => {
    const navigate = useNavigate();

    const handleStoreAddClick = () => {
        navigate('/storeadd'); // 가게 추가 페이지로 이동
    };

    const handleStoreManageClick = () => {
        navigate('/storemanagementpage'); // 가게 관리 페이지로 이동
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                <div className={styles.storeButton} onClick={handleStoreAddClick}>
                    가게 추가
                </div>
                <div className={styles.storeButton} onClick={handleStoreManageClick}>
                    가게 관리
                </div>
            </div>
        </div>
    );
};

export default StoreManagement;
