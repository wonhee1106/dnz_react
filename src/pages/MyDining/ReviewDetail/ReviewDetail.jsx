import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../../config/config' // API 경로에 맞게 설정
import styles from './ReviewDetail.module.css'

function ReviewDetail() {
    const { reservationId } = useParams() // URL에서 reservationId 가져오기
    const location = useLocation() // state로 전달된 가게 이름을 받기 위한 useLocation 사용
    const navigate = useNavigate()
    const [review, setReview] = useState(null) // 리뷰 상태
    const [loading, setLoading] = useState(true) // 로딩 상태
    const [error, setError] = useState(null) // 오류 상태
    const [isEditing, setIsEditing] = useState(false) // 수정 모드 상태
    const [originalReviewText, setOriginalReviewText] = useState('') // 원본 리뷰 상태
    const [replies, setReplies] = useState([]) // 댓글 상태

    const storeName = location.state?.storeName // 가게 이름 받아오기

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

    useEffect(() => {
        // 댓글 데이터 가져오기
        const fetchReplies = async () => {
            try {
                const response = await api.get(`/replies/${review.reviewId}`)
                if (response.status === 200) {
                    setReplies(response.data) // 댓글 데이터 설정
                }
            } catch (error) {
                console.log('댓글 데이터를 가져오는데 실패했습니다.')
            }
        }

        if (review) {
            fetchReplies()
        }
    }, [review])

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
                navigate('/mydining') // 리뷰 삭제 후 마이 다이닝 페이지로 이동
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
        <div className={styles.reviewDetailContainer}>
            <h2 className={styles.title}>리뷰 상세 페이지</h2>
            <div className={styles.reviewInfo}>
                <p>
                    <strong>가게 이름: </strong>
                    {storeName || '정보 없음'}
                </p>
            </div>
            <div className={styles.reviewInfo}>
                <strong>평점:</strong>
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        className={styles.star}
                        style={{
                            color: star <= review.rating ? '#FFD700' : '#ccc',
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
            {isEditing ? (
                <textarea
                    className={`${styles.reviewText} ${styles.textAreaEdit}`} // 추가된 스타일 클래스
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
                            className={styles.editButton}
                            onClick={handleSaveChanges}
                        >
                            저장
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={handleCancelEdit}
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={styles.editButton}
                            onClick={() => setIsEditing(true)}
                        >
                            리뷰 수정
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={handleDeleteReview}
                        >
                            리뷰 삭제
                        </button>
                    </>
                )}
            </div>

            {/* 댓글 목록 표시 */}
            <div className={styles.repliesSection}>
                <h3>댓글</h3>
                {replies.length > 0 ? (
                    replies.map(reply => (
                        <div key={reply.replyId} className={styles.replyItem}>
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
        </div>
    )
}

export default ReviewDetail
