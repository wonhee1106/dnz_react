import React, { useState, useEffect } from 'react';
import { api } from '../../config/config'; // JWT 토큰을 포함한 Axios 인스턴스
import styles from './StoreManagementPage.module.css';

const StoreManagementPage = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [userName, setUserName] = useState("");
    const [currentStatus, setCurrentStatus] = useState('pending');
    const [reviews, setReviews] = useState([]);
    const [replyContent, setReplyContent] = useState({});  // 각 리뷰별로 개별 답글을 관리


// 하드코딩된 리뷰 데이터
const hardcodedReviews = [
    {
        review_id: 1,
        store_seq: 1,
        user_id: 1,
        reservation_id: 1,
        rating: 5,
        review_text: '음식이 정말 맛있었고 서비스도 훌륭했습니다!',
        created_at: '2024-09-19 12:00:00',
        reservationDate: '2024-09-19',
        reservationTime: '12:00',
        numGuests: 2,
        userName: '사용자1',
    },
    {
        review_id: 2,
        store_seq: 1,
        user_id: 2,
        reservation_id: 2,
        rating: 4,
        review_text: '전체적으로 좋았지만 조금 시끄러웠습니다.',
        created_at: '2024-09-20 13:00:00',
        reservationDate: '2024-09-20',
        reservationTime: '13:00',
        numGuests: 4,
        userName: '사용자2',
    },
    {
        review_id: 3,
        store_seq: 1,
        user_id: 3,
        reservation_id: 3,
        rating: 3,
        review_text: '음식이 조금 늦게 나왔어요.',
        created_at: '2024-09-21 18:30:00',
        reservationDate: '2024-09-21',
        reservationTime: '18:30',
        numGuests: 3,
        userName: '사용자3',
    }
];


    
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

    // 서버에서 리뷰 데이터를 가져오는 함수
    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews`);  // 서버에서 내 가게에 대한 리뷰 데이터를 가져옴
            setReviews(response.data.reviews); // 최신순으로 리뷰 데이터 설정
        } catch (error) {
            console.error('리뷰 데이터를 가져오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        if (currentStatus === 'review') {
            setReviews(hardcodedReviews);  // 하드코딩된 리뷰 데이터를 설정
        } else {
            fetchReservations(currentStatus); // 예약 상태에 따라 필터링
        }
    }, [currentStatus]);

    const handleMenuClick = (status) => {
        setCurrentStatus(status); // 메뉴 클릭 시 상태 변경
    };

    const handleReservationClick = (reservation) => {
        setSelectedReservation(reservation);
    };

    // 예약 상태 업데이트 함수 (취소/완료 처리)
    const handleUpdateReservationStatus = async (newStatus) => {
        const confirmMessage = newStatus === 'cancelled' ? '취소' : '완료';
        if (window.confirm(`이 예약을 ${confirmMessage} 처리하시겠습니까?`)) {
            try {
                // 서버로 상태 변경 요청 전송
                await api.put(`/reservation/${selectedReservation.reservationId}?status=${newStatus}`);
                alert(`예약이 ${confirmMessage} 처리되었습니다.`);
                
                // 예약 목록을 새로고침
                fetchReservations(currentStatus);
            } catch (error) {
                console.error(`예약 ${confirmMessage} 처리에 실패했습니다.`, error);
                alert(`예약 ${confirmMessage} 처리에 실패했습니다.`);
            }
        }
    };

    const handleReplyChange = (reviewId, value) => {
        setReplyContent((prevState) => ({
            ...prevState,
            [reviewId]: value,  // 각 리뷰 ID별로 개별 답글 상태를 저장
        }));
    };

    const handleReplySubmit = async (reviewId) => {
        const replyText = replyContent[reviewId]?.trim();
        if (!replyText) return;

        try {
            const response = await api.post(`/replies/${reviewId}`, {
                replyText: replyText,
            });
            const newReply = response.data;

            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.review_id === reviewId
                        ? { ...review, replies: [...(review.replies || []), newReply] }
                        : review
                )
            );
            setReplyContent((prevState) => ({
                ...prevState,
                [reviewId]: '',  // 답글 제출 후 상태 초기화
            }));
        } catch (error) {
            console.error("답글을 달지 못했습니다.", error);
            alert("답글을 달지 못했습니다.");
        }
    };
    // const formatReservationTime = (time) => {
    //     const parsedTime = Date.parse(time);
    //     if (!isNaN(parsedTime)) {
    //         return new Date(parsedTime).toLocaleTimeString();
    //     }
    //     return 'Invalid Date';
    // };

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
            case 'review':
                return '리뷰 관리';
            default:
                return '예약 관리';
        }
    };

    // 리뷰 별점 출력
    const renderStars = (rating) => {
        return (
            <span>
                {[...Array(5)].map((_, index) => (
                    <i key={index} className={index < rating ? 'fas fa-star' : 'far fa-star'}></i>
                ))}
            </span>
        );
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
                <div 
                    className={`${styles.menuItem} ${currentStatus === 'review' ? styles.selectedMenu : ''}`} 
                    onClick={() => handleMenuClick('review')}
                >
                    <i className="fas fa-star"></i>
                    <span>리뷰 관리</span>
                </div>
                <div className={`${styles.menuItem} ${styles.settings}`}>
                    <i className="fas fa-cogs"></i>
                    <span>설정</span>
                </div>
            </div>

            {/* 예약 관리 화면 */}
            {currentStatus !== 'review' && (
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
            )}

            {/* 예약 상세 정보 */}
            {selectedReservation && currentStatus !== 'review' && (
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
                        <p>예약 상태: {selectedReservation.status === 'pending' ? '처리 중' : selectedReservation.status === 'confirmed' ? '완료' : selectedReservation.status === 'cancelled' ? '취소' : '알 수 없음'}</p>
                    </div>
                    {currentStatus === 'pending' && (
                        <div className={styles.buttons}>
                            <button 
                                className={styles.cancelButton} 
                                onClick={() => handleUpdateReservationStatus('cancelled')}
                            >
                                취소
                            </button>
                            <button 
                                className={styles.completeButton} 
                                onClick={() => handleUpdateReservationStatus('confirmed')}
                            >
                                완료
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 리뷰 관리 화면 */}
            {currentStatus === 'review' && (
                <div className={styles.reviewList}>
                    <h3 className={styles.reviewTitle}>리뷰 목록</h3>

                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.review_id} className={styles.reviewItem}>
                                <span className={styles.reviewTime}>{new Date(review.created_at).toLocaleString()}</span>
                                <p><strong>예약 날짜/시간:</strong> {review.reservationDate} {review.reservationTime}</p>
                                <p><strong>예약 인원:</strong> {review.numGuests}명</p>
                                <p><strong>평점:</strong> {renderStars(review.rating)}</p>
                                <p><strong>리뷰 내용:</strong> {review.review_text}</p>
                                <p><strong>작성자:</strong> {review.userName}</p>

                {/* 사장 답글 달기 */}
                                <div className={styles.replySection}>
                                    <textarea
                                        placeholder="답글을 작성하세요..."
                                        className={styles.replyInput}
                                        rows={1}
                                        value={replyContent[review.review_id] || ''}
                                        onChange={(e) => handleReplyChange(review.review_id, e.target.value)}
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                    ></textarea>
                                    <button className={styles.replyButton} onClick={() => handleReplySubmit(review.review_id)}>
                                        답글 달기
                                    </button>
                                </div>

                </div>
                        ))
                    ) : (
                        <p>리뷰가 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StoreManagementPage;
