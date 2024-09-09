import React, { useState } from 'react';
import { api } from '../../config/config';
import styles from './StoreAddPage.module.css';

const StoreAddPage = () => {
    const [storeName, setStoreName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [seatCapacity, setSeatCapacity] = useState(0);
    const [address, setAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/store/register', {
                name: storeName,
                category: category,
                description: description,
                seat_capacity: seatCapacity,
                address: address,
            });
            if (response.status === 200) {
                alert('가게 등록이 성공적으로 완료되었습니다.');
            }
        } catch (error) {
            console.error('가게 등록 중 오류 발생:', error);
            alert('가게 등록에 실패했습니다.');
        }
    };

    const handleAddressClick = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                setAddress(data.address);
            },
        }).open();
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.StoreAddForm}>
                <h2 className={styles.title}>가게 등록</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="storeName">가게 이름</label>
                    <input
                        type="text"
                        id="storeName"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="category">카테고리</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">가게 설명</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="seatCapacity">최대 좌석 수</label>
                    <input
                        type="number"
                        id="seatCapacity"
                        value={seatCapacity}
                        onChange={(e) => setSeatCapacity(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address">주소</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onClick={handleAddressClick} // 카카오 주소 API를 불러오기 위한 클릭 이벤트
                        placeholder="주소를 선택하세요"
                        readOnly
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>등록하기</button>
            </form>
        </div>
    );
};

export default StoreAddPage;
