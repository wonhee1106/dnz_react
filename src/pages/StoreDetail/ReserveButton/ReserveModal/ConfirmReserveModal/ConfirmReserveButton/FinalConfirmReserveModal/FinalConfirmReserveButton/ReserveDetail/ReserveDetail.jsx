import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ReserveDetail.module.css'
import { api } from '../../../../../../../../../config/config'

function ReserveDetail() {
    const [reservations, setReservations] = useState([])
    const [reviewsMap, setReviewsMap] = useState({}) // 각 예약에 대한 리뷰 여부를 저장
    const navigate = useNavigate()

    useEffect(() => {
        // 로그인한 사용자의 예약 내역을 API로부터 가져오는 함수
        const fetchReservations = async () => {
            try {
                const response = await api.get('/reservation/user') // 사용자 예약 내역 API 호출
                if (response.status === 200) {
                    setReservations(response.data.reservations) // 예약 데이터를 상태에 저장
                } else {
                    console.log('예약 데이터를 가져오는데 실패했습니다.')
                }
            } catch (error) {
                console.log('예약 데이터 로딩 중 오류 발생:', error)
            }
        }

        fetchReservations()
    }, [])

    useEffect(() => {
        // 각 예약에 대해 리뷰 여부를 서버에서 확인하는 함수
        const fetchReviewStatus = async () => {
            const reviewsStatus = {} // 각 예약에 대한 리뷰 여부를 저장할 객체
            await Promise.all(
                reservations.map(async reservation => {
                    try {
                        const response = await api.get(
                            `/reviews/${reservation.reservationId}`
                        )
                        if (response.status === 200) {
                            reviewsStatus[reservation.reservationId] = true // 리뷰가 존재함
                        }
                    } catch (error) {
                        reviewsStatus[reservation.reservationId] = false // 리뷰가 존재하지 않음
                    }
                })
            )
            setReviewsMap(reviewsStatus) // 각 예약의 리뷰 여부를 상태로 저장
        }

        if (reservations.length > 0) {
            fetchReviewStatus()
        }
    }, [reservations])

    const isPastReservation = (reservationDate, reservationTime) => {
        const now = new Date()
        const [hour, minute] = reservationTime.split(':')
        const reservationDateTime = new Date(reservationDate)
        reservationDateTime.setHours(hour)
        reservationDateTime.setMinutes(minute)
        return reservationDateTime < now
    }

    const formatDate = date => {
        const dateString = new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
        })
        return dateString
    }

    const handleCancelReservation = async (reservationId, reservationDate) => {
        const confirmed = window.confirm('정말 예약을 취소하시겠습니까?')
        if (!confirmed) return

        try {
            const response = await api.delete(`/reservation/${reservationId}`)
            if (response.status === 200) {
                alert('예약이 성공적으로 취소되었습니다.')
                setReservations(
                    reservations.filter(
                        res => res.reservationId !== reservationId
                    )
                )
            } else {
                alert('예약 취소 실패')
            }
        } catch (error) {
            console.log('예약 취소 중 오류 발생:', error)
            alert('예약 취소 중 오류 발생')
        }
    }

    const handleGoToReview = reservation => {
        navigate('/review', {
            state: { reservation },
        })
    }

    const handleGoToViewReview = reservationId => {
        navigate(`/review/${reservationId}`)
    }

    return (
        <div className={styles.reservationContainer}>
            <h2 className={styles.title}>나의 예약 내역</h2>
            {reservations.length > 0 ? (
                reservations.map(reservation => (
                    <div
                        key={reservation.reservationId}
                        className={styles.reservationCard}
                    >
                        <div className={styles.reservationInfoRow}>
                            <div className={styles.imagePlaceholder}>
                                이미지
                            </div>
                            <div className={styles.textInfo}>
                                <p className={styles.restaurantName}>
                                    {reservation.storeName}
                                </p>
                                <p className={styles.additionalInfo}>
                                    지역 · 음식종류
                                </p>
                                <p className={styles.dateInfo}>
                                    {formatDate(reservation.reservationDate)}{' '}
                                    {reservation.reservationTime}{' '}
                                    {reservation.numGuests}명
                                </p>
                            </div>
                        </div>
                        <div className={styles.reservationActions}>
                            {isPastReservation(
                                reservation.reservationDate,
                                reservation.reservationTime
                            ) ? (
                                reviewsMap[reservation.reservationId] ? (
                                    <button
                                        className={styles.viewReviewButton}
                                        onClick={() =>
                                            handleGoToViewReview(
                                                reservation.reservationId
                                            )
                                        }
                                    >
                                        리뷰 확인
                                    </button>
                                ) : (
                                    <button
                                        className={styles.goToReview}
                                        onClick={() =>
                                            handleGoToReview(reservation)
                                        }
                                    >
                                        리뷰 작성
                                    </button>
                                )
                            ) : (
                                <button
                                    className={styles.cancelButton}
                                    onClick={() =>
                                        handleCancelReservation(
                                            reservation.reservationId,
                                            reservation.reservationDate
                                        )
                                    }
                                >
                                    예약 취소
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noReservation}>예약 내역이 없습니다.</p>
            )}
        </div>
    )
}

export default ReserveDetail
