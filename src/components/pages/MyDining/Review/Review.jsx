import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Review.module.css'
import { api } from '../../../config/config' // API 경로에 맞게 설정

function Review() {
    const location = useLocation()
    const { reservation } = location.state || {} // MyDining에서 전달된 예약 정보 가져오기
    const [rating, setRating] = useState(0) // 평점 상태
    const [reviewText, setReviewText] = useState('') // 리뷰 텍스트 상태
    const [isSubmitting, setIsSubmitting] = useState(false) // 제출 중 상태

    // UTC 날짜를 로컬 시간으로 변환하는 함수
    const formatDateToLocal = dateString => {
        const date = new Date(dateString) // 문자열을 Date 객체로 변환
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
        })
    }

    const handleRatingChange = newRating => {
        if (newRating === rating) {
            setRating(0) // 동일한 별을 클릭하면 평점 초기화
        } else {
            setRating(newRating) // 클릭한 별까지 평점을 업데이트
        }
    }

    const handleReviewTextChange = e => {
        setReviewText(e.target.value) // 리뷰 텍스트 변경
    }

    const handleSubmitReview = async () => {
        if (rating === 0 || reviewText.trim() === '') {
            alert('평점과 리뷰 내용을 입력해주세요.')
            return
        }

        setIsSubmitting(true) // 제출 중 상태로 변경

        try {
            const reviewData = {
                store_seq: reservation.storeSeq, // 가게 고유 번호
                user_id: reservation.userId, // 사용자 고유 번호
                reservation_id: reservation.reservationId, // 예약 고유 번호
                rating: rating,
                review_text: reviewText,
            }

            // 리뷰 데이터를 서버로 전송
            const response = await api.post('/reviews', reviewData)

            if (response.status === 200) {
                alert('리뷰가 성공적으로 제출되었습니다.')
                // 추가 작업: 성공적으로 제출 후 페이지 이동 등 처리
            } else {
                alert('리뷰 제출에 실패했습니다.')
            }
        } catch (error) {
            console.error('리뷰 제출 중 오류 발생:', error)
            alert('리뷰 제출 중 문제가 발생했습니다.')
        } finally {
            setIsSubmitting(false) // 제출 상태 해제
        }
    }

    return (
        <div className={styles.reviewContainer}>
            <h2 className={styles.title}>리뷰 작성 페이지</h2>
            {reservation ? (
                <div>
                    <p>가게 이름: {reservation.storeName}</p>
                    <p>
                        예약 날짜:{' '}
                        {formatDateToLocal(reservation.reservationDate)}
                    </p>{' '}
                    {/* UTC 날짜를 로컬 시간으로 변환 */}
                    <p>예약 시간: {reservation.reservationTime}</p>
                    <p>예약 인원: {reservation.numGuests}명</p>
                    {/* 평점 입력 */}
                    <div className={styles.ratingContainer}>
                        <label>평점:</label>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                className={styles.star}
                                onClick={() => handleRatingChange(star)}
                                style={{
                                    color: star <= rating ? '#FFD700' : '#ccc', // 별 색상 변경
                                    cursor: 'pointer',
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    {/* 리뷰 텍스트 입력 */}
                    <textarea
                        className={styles.reviewText}
                        value={reviewText}
                        onChange={handleReviewTextChange}
                        placeholder="리뷰를 작성해주세요 (최대 4000자)"
                        maxLength="4000"
                    />
                    {/* 제출 버튼 */}
                    <button
                        className={styles.submitButton}
                        onClick={handleSubmitReview}
                        disabled={isSubmitting} // 제출 중에는 버튼 비활성화
                    >
                        {isSubmitting ? '제출 중...' : '리뷰 제출'}
                    </button>
                </div>
            ) : (
                <p>예약 정보가 없습니다.</p>
            )}
        </div>
    )
}

export default Review
