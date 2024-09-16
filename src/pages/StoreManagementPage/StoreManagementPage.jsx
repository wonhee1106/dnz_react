import React, { useState, useEffect } from 'react';
import { api } from '../../config/config'; // JWT 토큰을 포함한 Axios 인스턴스
import styles from './StoreManagementPage.module.css';

const StoreManagementPage = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [userName, setUserName] = useState("");
    const [currentStatus, setCurrentStatus] = useState('pending');

    // 서버에서 예약 데이터를 가져오는 함수
    const fetchReservations = async (status) => {
        try {
            const response = await api.get(`/reservation`, {
                params: { status }
            });
    
            // reservations 배열의 각 항목에 userName을 병합
            const { reservations: reservationData, userName } = response.data;
            const reservationsWithUserName = reservationData.map(reservation => ({
                ...reservation,
                userName
            }));
    
            setReservations(reservationsWithUserName);
            setUserName(userName);
            console.log(reservationsWithUserName);

            // 상태가 변경되었을 때 해당 상태의 예약 중 가장 최근 예약을 기본 선택
            if (reservationsWithUserName.length > 0) {
                const recentReservation = reservationsWithUserName.reduce((latest, current) => {
                    return new Date(current.reservationDate) > new Date(latest.reservationDate) ? current : latest;
                });
                setSelectedReservation(recentReservation); // 가장 최근의 예약을 선택
            } else {
                setSelectedReservation(null); // 예약이 없을 경우 선택 해제
            }
        } catch (error) {
            console.error('예약 데이터를 가져오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        fetchReservations(currentStatus); // 예약 상태에 따라 필터링
    }, [currentStatus]);

    const handleMenuClick = (status) => {
        setCurrentStatus(status); // 메뉴 클릭 시 상태 변경
    };

    const handleReservationClick = (reservation) => {
        setSelectedReservation(reservation);
    };

    const formatReservationTime = (time) => {
        const parsedTime = Date.parse(time);
        if (!isNaN(parsedTime)) {
            return new Date(parsedTime).toLocaleTimeString();
        }
        return 'Invalid Date';
    };

    const formatReservationDate = (date) => {
        const parsedDate = Date.parse(date);
        if (!isNaN(parsedDate)) {
            return new Date(parsedDate).toLocaleDateString();
        }
        return 'Invalid Date';
    };

    // 예약 상태에 따른 타이틀 변경 함수
    const getReservationTitle = () => {
        switch (currentStatus) {
            case 'pending':
                return '예약 대기';
            case 'confirmed':
                return '완료된 예약';
            case 'cancelled':
                return '취소된 예약';
            default:
                return '예약 관리';
        }
    };
    
    return (
        <div className={styles.container}>
            {/* 좌측 메뉴 */}
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>예약 관리</h2>
                <div 
                    className={`${styles.menuItem} ${currentStatus === 'pending' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('pending')}
                >
                    <i className="fas fa-tasks"></i>
                    <span>처리 중</span>
                </div>
                <div 
                    className={`${styles.menuItem} ${currentStatus === 'confirmed' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('confirmed')}
                >
                    <i className="fas fa-check-circle"></i>
                    <span>완료</span>
                </div>
                <div 
                    className={`${styles.menuItem} ${currentStatus === 'cancelled' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('cancelled')}
                >
                    <i className="fas fa-ban"></i>
                    <span>취소</span>
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
                <h3 className={styles.reservationTitle}>{getReservationTitle()}</h3>

                {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <div
                            key={reservation.reservationId}
                            className={`${styles.reservationItem} ${selectedReservation?.reservationId === reservation.reservationId ? styles.selected : ''}`}
                            onClick={() => handleReservationClick(reservation)}
                        >
                            <span className={styles.tableInfo}>예약 {reservation.reservationId}번 - {reservation.numGuests}명</span>
                            <span className={styles.time}>예약 시간: {reservation.reservationTime}</span>
                        </div>
                    ))
                ) : (
                    <p>예약이 없습니다.</p>
                )}
            </div>

            {/* 예약 상세 정보 */}
            {selectedReservation && (
                <div className={styles.reservationDetails}>
                    <h3 className={styles.detailsTitle}>예약 상세 정보</h3>
                    <div className={styles.detailInfo}>
                        <p>예약 번호: {selectedReservation.reservationId}번</p>
                        <p>예약 시간: {selectedReservation.reservationTime}</p>
                        <p>예약 날짜: {formatReservationDate(selectedReservation.reservationDate)}</p>
                        <p>예약자: {selectedReservation.userName}</p>
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
