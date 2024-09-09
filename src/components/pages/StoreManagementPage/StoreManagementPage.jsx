import React, { useState, useEffect } from 'react';
import { api } from '../../config/config'; // JWT 토큰을 포함한 Axios 인스턴스
import styles from './StoreManagementPage.module.css';

const StoreManagementPage = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);

    // 서버에서 예약 데이터를 가져오는 함수
    const fetchReservations = async (status) => {
        try {
            const response = await api.get(`/reservation`, {
                params: { status }
            });
            setReservations(response.data);
            if (response.data.length > 0) {
                setSelectedReservation(response.data[0]); // 첫 번째 예약을 기본 선택
            }
        } catch (error) {
            console.error('예약 데이터를 가져오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        fetchReservations('pending'); // 예약 상태에 따라 필터링 ('pending', 'confirmed', 'completed')
    }, []);

    const handleReservationClick = (reservation) => {
        setSelectedReservation(reservation);
    };

    return (
        <div className={styles.container}>
            {/* 좌측 메뉴 */}
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>테이블 관리</h2>
                <div className={styles.menuItem}>
                    <i className="fas fa-tasks"></i>
                    <span>처리 중</span>
                </div>
                <div className={styles.menuItem}>
                    <i className="fas fa-check-circle"></i>
                    <span>완료</span>
                </div>
                <div className={styles.menuItem}>
                    <i className="fas fa-calendar-alt"></i>
                    <span>예약 관리</span>
                </div>
                <div className={styles.menuItem}>
                    <i className="fas fa-chair"></i>
                    <span>좌석 현황</span>
                </div>
                <div className={styles.menuItem}>
                    <i className="fas fa-chart-line"></i>
                    <span>매출 관리</span>
                </div>
                <div className={`${styles.menuItem} ${styles.settings}`}>
                    <i className="fas fa-cogs"></i>
                    <span>설정</span>
                </div>
            </div>

            {/* 예약 목록 */}
            <div className={styles.reservationList}>
                <h3 className={styles.reservationTitle}>예약 대기</h3>
                {reservations.map(reservation => (
                    <div
                        key={reservation.reservation_id}
                        className={`${styles.reservationItem} ${selectedReservation?.reservation_id === reservation.reservation_id ? styles.selected : ''}`}
                        onClick={() => handleReservationClick(reservation)}
                    >
                        <span className={styles.tableInfo}>테이블 {reservation.store_seq}번 - {reservation.num_guests}명</span>
                        <span className={styles.time}>예약 시간: {new Date(reservation.reservation_time).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>

            {/* 예약 상세 정보 */}
            {selectedReservation && (
                <div className={styles.reservationDetails}>
                    <h3 className={styles.detailsTitle}>예약 상세 정보</h3>
                    <div className={styles.detailInfo}>
                        <p>테이블 번호: {selectedReservation.store_seq}번</p>
                        <p>예약 인원: {selectedReservation.num_guests}명</p>
                        <p>예약 시간: {new Date(selectedReservation.reservation_time).toLocaleTimeString()}</p>
                    </div>
                    <div className={styles.guestInfo}>
                        <h4>예약자 정보</h4>
                        <p>예약 상태: {selectedReservation.status}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreManagementPage;
