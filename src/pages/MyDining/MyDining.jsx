import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './MyDining.module.css'
import { api } from '../../config/config'

function MyDining() {
    const [reservations, setReservations] = useState([])
    const [reviewsMap, setReviewsMap] = useState({})
    const [currentPage, setCurrentPage] = useState(1) // 현재 페이지를 관리하는 상태
    const reservationsPerPage = 5 // 한 번에 보여줄 예약 개수
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await api.get('/reservation/user')
                if (response.status === 200) {
                    setReservations(response.data.reservations)
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
        if (location.state?.updatedReservationId) {
            const updatedId = location.state.updatedReservationId
            const newReviewsMap = { ...reviewsMap }
            newReviewsMap[updatedId] = true
            setReviewsMap(newReviewsMap)
        }
    }, [location.state])

    useEffect(() => {
        const fetchReviewStatus = async () => {
            const reviewsStatus = {}
            await Promise.all(
                reservations.map(async reservation => {
                    try {
                        const response = await api.get(
                            `/reviews/${reservation.reservationId}`
                        )
                        if (response.status === 200) {
                            reviewsStatus[reservation.reservationId] = true
                        }
                    } catch (error) {
                        reviewsStatus[reservation.reservationId] = false
                    }
                })
            )
            setReviewsMap(reviewsStatus)
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
        navigate(`/reviewDetail/${reservationId}`)
    }

    const loadMoreReservations = () => {
        setCurrentPage(prevPage => prevPage + 1)
    }

    // 현재 페이지에 따라 예약을 잘라서 보여줌
    const displayedReservations = reservations.slice(
        0,
        currentPage * reservationsPerPage
    )

    return (
        <div className={styles.reservationContainer}>
            <h2 className={styles.title}>나의 예약 내역</h2>
            {displayedReservations.length > 0 ? (
                <>
                    {displayedReservations.map(reservation => (
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
                                        {formatDate(
                                            reservation.reservationDate
                                        )}{' '}
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
                    ))}
                    {displayedReservations.length < reservations.length && (
                        <button
                            className={styles.loadMoreButton}
                            onClick={loadMoreReservations}
                        >
                            더보기
                        </button>
                    )}
                </>
            ) : (
                <p className={styles.noReservation}>예약 내역이 없습니다.</p>
            )}
        </div>
    )
}

export default MyDining
