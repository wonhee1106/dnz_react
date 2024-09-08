import React, { useState } from 'react';
import styles from './StoreManagementPage.module.css';

const StoreManagementPage = () => {
    // 예약 리스트 초기 데이터
    const reservations = [
        { id: 1, tableNumber: 12, people: 4, time: '19:00', name: '홍길동', phone: '010-1234-5678' },
        { id: 2, tableNumber: 8, people: 2, time: '18:30', name: '이순신', phone: '010-9876-5432' },
        { id: 3, tableNumber: 5, people: 3, time: '20:00', name: '김철수', phone: '010-5555-6666' }
    ];

    // 선택된 예약을 관리하는 상태
    const [selectedReservation, setSelectedReservation] = useState(reservations[0]);

    // 예약을 선택했을 때 호출되는 함수
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
                        key={reservation.id}
                        className={styles.reservationItem}
                        onClick={() => handleReservationClick(reservation)}
                    >
                        <span className={styles.tableInfo}>테이블 {reservation.tableNumber}번 - {reservation.people}명</span>
                        <span className={styles.time}>예약 시간: {reservation.time}</span>
                    </div>
                ))}
            </div>

            {/* 예약 상세 정보 */}
            <div className={styles.reservationDetails}>
                <h3 className={styles.detailsTitle}>예약 상세 정보</h3>
                <div className={styles.detailInfo}>
                    <p>테이블 번호: {selectedReservation.tableNumber}번</p>
                    <p>예약 인원: {selectedReservation.people}명</p>
                    <p>예약 시간: {selectedReservation.time}</p>
                </div>
                <div className={styles.guestInfo}>
                    <h4>예약자 정보</h4>
                    <p>이름: {selectedReservation.name}</p>
                    <p>전화번호: {selectedReservation.phone}</p>
                </div>
                <div className={styles.buttons}>
                    <button className={styles.cancelButton}>취소</button>
                    <button className={styles.completeButton}>완료 처리</button>
                </div>
            </div>
        </div>
    );
}

export default StoreManagementPage;
