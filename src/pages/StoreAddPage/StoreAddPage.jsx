import React, { useState, useEffect } from 'react';
import { api } from '../../config/config';
import styles from './StoreAddPage.module.css';

const StoreAddPage = () => {
    const [storeName, setStoreName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [seatCapacity, setSeatCapacity] = useState(0);
    const [address1, setAddress1] = useState(''); // 기본 주소
    const [address2, setAddress2] = useState(''); // 상세 주소
    const [postcode, setPostcode] = useState(''); // 우편번호

    // Daum/Kakao Postcode API 스크립트 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            console.log('Kakao Postcode API loaded.');
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!address1 || !postcode) {
            alert("주소와 우편번호를 입력하세요.");
            return;
        }

        try {
            const response = await api.post('/store/register', {
                name: storeName,
                category: category,
                description: description,
                seat_capacity: seatCapacity,
                address1: address1,
                address2: address2,
                postcode: postcode, // 추가된 우편번호 필드
            });
            if (response.status === 200) {
                alert('가게 등록이 성공적으로 완료되었습니다.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data); // 서버에서 온 메시지 설정
            } else {
                alert("가게 등록 중 오류 발생.");
            }
        }
    };

    const handleAddressClick = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    setAddress1(data.jibunAddress); // 기본 주소 설정
                    setPostcode(data.zonecode); // 우편번호 설정
                },
            }).open();
        } else {
            console.error("Kakao Postcode API is not loaded.");
        }
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
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>카테고리를 선택하세요</option>
                        <option value="일식">일식</option>
                        <option value="중식">중식</option>
                        <option value="한식">한식</option>
                        <option value="양식">양식</option>
                    </select>
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

                {/* 카카오 API 주소 입력 */}
                <div className={styles.formGroup}>
                    <label htmlFor="postcode">우편번호</label>
                    <input
                        type="text"
                        id="postcode"
                        value={postcode}
                        placeholder="우편번호를 선택하세요"
                        readOnly
                        required
                    />
                    <button type="button" onClick={handleAddressClick}>우편번호 찾기</button>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="address1">기본 주소</label>
                    <input
                        type="text"
                        id="address1"
                        value={address1}
                        placeholder="기본 주소"
                        readOnly
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="address2">상세 주소</label>
                    <input
                        type="text"
                        id="address2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        placeholder="상세 주소를 입력하세요"
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>등록하기</button>
            </form>
        </div>
    );
};

export default StoreAddPage;
