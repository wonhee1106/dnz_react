import React, { useEffect, useState } from 'react'
import { api } from '../../../config/config' // API 경로에 맞게 설정
import styles from './ReviewDetailModal.module.css' // 방금 작성한 CSS 파일

function ReviewDetailModal({ reservationId, onClose }) {
    const [review, setReview] = useState(null) // 리뷰 상태
    const [loading, setLoading] = useState(true) // 로딩 상태
    const [error, setError] = useState(null) // 오류 상태
    const [isEditing, setIsEditing] = useState(false) // 수정 모드 상태
    const [originalReviewText, setOriginalReviewText] = useState('') // 원본 리뷰 상태
    const [replies, setReplies] = useState([]) // 답글 상태

    // 리뷰 정보 가져오기
    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await api.get(`/reviews/${reservationId}`)
                if (response.status === 200) {
                    setReview(response.data) // 리뷰 데이터 설정
                    setOriginalReviewText(response.data.reviewText) // 원본 리뷰 텍스트 저장
                } else {
                    setError('리뷰를 불러오는 중 오류가 발생했습니다.')
                }
            } catch (error) {
                setError('리뷰를 불러오는 중 오류가 발생했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchReview()
    }, [reservationId])

    const handleReviewTextChange = e => {
        setReview({ ...review, reviewText: e.target.value }) // 리뷰 내용만 수정
    }

    const handleSaveChanges = async () => {
        try {
            const response = await api.put(`/reviews/${reservationId}`, {
                reviewText: review.reviewText, // 수정된 리뷰 내용만 전송
            })
            if (response.status === 200) {
                alert('리뷰가 성공적으로 수정되었습니다.')
                setIsEditing(false) // 수정 모드 종료
                setOriginalReviewText(review.reviewText) // 저장된 리뷰를 원본 텍스트로 업데이트
            } else {
                alert('리뷰 수정에 실패했습니다.')
            }
        } catch (error) {
            alert('리뷰 수정 중 오류가 발생했습니다.')
        }
    }

    const handleDeleteReview = async () => {
        const confirmed = window.confirm('정말로 리뷰를 삭제하시겠습니까?')
        if (!confirmed) return

        try {
            const response = await api.delete(`/reviews/${reservationId}`)
            if (response.status === 200) {
                alert('리뷰가 삭제되었습니다.')
                onClose() // 리뷰 삭제 후 모달 닫기
            } else {
                alert('리뷰 삭제에 실패했습니다.')
            }
        } catch (error) {
            alert('리뷰 삭제 중 오류가 발생했습니다.')
        }
    }

    const handleCancelEdit = () => {
        setReview({ ...review, reviewText: originalReviewText }) // 원본으로 복원
        setIsEditing(false) // 수정 모드 종료
    }

    if (loading) {
        return <p>로딩 중...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    if (!review) {
        return <p>리뷰가 없습니다.</p>
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>리뷰 상세 페이지</h2>
                <div className={styles.reviewInfo}>
                    <p>
                        <strong>가게 이름: </strong>
                        {review.storeName || '정보 없음'}
                    </p>
                </div>
                <div className={styles.reviewInfo}>
                    <strong>평점:</strong>
                    <div className={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                className={styles.star}
                                style={{
                                    color:
                                        star <= review.rating
                                            ? '#FFD700'
                                            : '#ccc',
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                {isEditing ? (
                    <textarea
                        className={styles.reviewText}
                        value={review.reviewText}
                        onChange={handleReviewTextChange}
                        placeholder="리뷰를 수정해주세요."
                        maxLength="4000"
                    />
                ) : (
                    <div className={styles.reviewInfo}>
                        <p>
                            <strong>리뷰 내용: </strong>
                            {review.reviewText}
                        </p>
                    </div>
                )}
                <div className={styles.reviewActions}>
                    {isEditing ? (
                        <>
                            <button
                                className={styles.submitButton}
                                onClick={handleSaveChanges}
                            >
                                저장
                            </button>
                            <button
                                className={styles.closeButton}
                                onClick={handleCancelEdit}
                            >
                                취소
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={styles.submitButton}
                                onClick={() => setIsEditing(true)}
                            >
                                리뷰 수정
                            </button>
                            <button
                                className={styles.closeButton}
                                onClick={handleDeleteReview}
                            >
                                리뷰 삭제
                            </button>
                        </>
                    )}
                </div>
                <div className={styles.repliesSection}>
                    <h3>댓글</h3>
                    {replies.length > 0 ? (
                        replies.map(reply => (
                            <div
                                key={reply.replyId}
                                className={styles.replyItem}
                            >
                                <p>{reply.replyText}</p>
                                <p>
                                    <small>작성자: {reply.userId}</small>
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>댓글이 없습니다.</p>
                    )}
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    )
}

export default ReviewDetailModal
