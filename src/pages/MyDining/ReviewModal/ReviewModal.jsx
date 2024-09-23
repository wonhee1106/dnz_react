import React, { useState } from 'react'
import styles from './ReviewModal.module.css' // 모달용 스타일
import { api } from '../../../config/config'

function ReviewModal({ reservation, onClose }) {
    const [rating, setRating] = useState(0) // 평점 상태
    const [reviewText, setReviewText] = useState('') // 리뷰 텍스트 상태
    const [isSubmitting, setIsSubmitting] = useState(false) // 제출 중 상태

    const formatDateToLocal = dateString => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
        })
    }

    const handleRatingChange = newRating => {
        if (newRating === rating) {
            setRating(rating - 1) // 동일한 별을 클릭하면 평점 초기화
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

        setIsSubmitting(true)

        try {
            const reviewData = {
                storeSeq: reservation.storeSeq, // 가게 고유 번호
                userId: reservation.userId, // 사용자 고유 번호
                reservationId: reservation.reservationId, // 예약 고유 번호
                rating,
                reviewText,
            }

            const response = await api.post('/reviews', reviewData)

            if (response.status === 200) {
                alert('리뷰가 성공적으로 제출되었습니다.')
                onClose() // 모달 닫기
            } else {
                alert('리뷰 제출에 실패했습니다.')
            }
        } catch (error) {
            console.error('리뷰 제출 중 오류 발생:', error)
            alert('리뷰 제출 중 문제가 발생했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>리뷰 작성 페이지</h2>
                {reservation ? (
                    <div>
                        <p>
                            <strong>가게 이름: </strong>
                            {reservation.storeName}
                        </p>
                        <p>
                            <strong>예약 날짜: </strong>
                            {formatDateToLocal(reservation.reservationDate)}
                        </p>
                        <p>
                            <strong>예약 시간: </strong>
                            {reservation.reservationTime}
                        </p>
                        <p>
                            <strong>예약 인원: </strong>
                            {reservation.numGuests}명
                        </p>
                        <div className={styles.ratingContainer}>
                            <label>평점:</label>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    className={styles.star}
                                    onClick={() => handleRatingChange(star)}
                                    style={{
                                        color:
                                            star <= rating ? '#FFD700' : '#ccc',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            className={styles.reviewText}
                            value={reviewText}
                            onChange={handleReviewTextChange}
                            placeholder="리뷰를 작성해주세요 (최대 4000자)"
                            maxLength="4000"
                        />
                        <button
                            className={styles.submitButton}
                            onClick={handleSubmitReview}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '제출 중...' : '리뷰 제출'}
                        </button>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                        >
                            닫기
                        </button>
                    </div>
                ) : (
                    <p>예약 정보가 없습니다.</p>
                )}
            </div>
        </div>
    )
}

export default ReviewModal
