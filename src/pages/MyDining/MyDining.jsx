import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './MyDining.module.css'
import { api } from '../../config/config'

function MyDining() {
    const [reservations, setReservations] = useState([]) // 예약 목록 상태
    const [reviewsMap, setReviewsMap] = useState({}) // 리뷰 상태를 저장하는 객체
    const [currentPage, setCurrentPage] = useState(1) // 현재 페이지 상태
    const reservationsPerPage = 5 // 한 번에 보여줄 예약 개수
    const navigate = useNavigate()
    const location = useLocation()

    // 예약 데이터를 가져오는 함수
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

    // 리뷰 상태를 업데이트하는 로직
    useEffect(() => {
        if (location.state?.updatedReservationId) {
            const updatedId = location.state.updatedReservationId
            const newReviewsMap = { ...reviewsMap }
            newReviewsMap[updatedId] = true
            setReviewsMap(newReviewsMap)
        }
    }, [location.state])

    // 각 예약의 리뷰 상태를 확인하는 함수
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

    // 예약 날짜와 시간이 현재 시간보다 지났는지 확인하는 함수
    const isPastReservation = (reservationDate, reservationTime) => {
        const now = new Date()
        const [hour, minute] = reservationTime.split(':')
        const reservationDateTime = new Date(reservationDate)
        reservationDateTime.setHours(hour)
        reservationDateTime.setMinutes(minute)
        return reservationDateTime < now
    }

    // 날짜 형식을 '년.월.일 (요일)'로 변환하는 함수
    const formatDate = date => {
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'short',
        })
    }

    // 예약 취소 처리 함수
    const handleCancelReservation = async (
        reservationId,
        reservationDate,
        reservationTime
    ) => {
        const now = new Date()
        const reservationDateTime = new Date(reservationDate)
        const [hour, minute] = reservationTime.split(':')
        reservationDateTime.setHours(hour)
        reservationDateTime.setMinutes(minute)

        // 당일 예약인지 확인
        const isSameDay =
            now.getFullYear() === reservationDateTime.getFullYear() &&
            now.getMonth() === reservationDateTime.getMonth() &&
            now.getDate() === reservationDateTime.getDate()

        // 예약 시간이 현재 시간보다 지났는지 확인 (노쇼 여부)
        const isNoShow = reservationDateTime < now

        // 당일 취소 또는 노쇼일 경우 바로 경고 메시지 띄움
        if (isSameDay || isNoShow) {
            const confirmed = window.confirm(
                '당일 취소 및 노쇼는 3분 동안 예약이 불가능합니다. 그래도 취소하시겠습니까?'
            )
            if (!confirmed) return
        } else {
            // 당일 취소가 아닌 경우 일반적인 경고 메시지 띄움
            const confirmed = window.confirm('정말로 취소하시겠습니까?')
            if (!confirmed) return
        }

        // 예약 취소 로직 (백엔드와 통신)
        try {
            const response = await api.delete(`/reservation/${reservationId}`)
            if (response.status === 200) {
                alert('예약이 성공적으로 취소되었습니다.')
                setReservations(
                    reservations.filter(
                        res => res.reservationId !== reservationId
                    )
                )
                // 예약 취소 후 3분 동안 예약 불가 처리
                setTimeout(async () => {
                    alert('3분 후에 다시 예약할 수 있습니다.')
                }, 3 * 60 * 1000) // 3분 대기
            } else {
                alert('예약 취소 실패')
            }
        } catch (error) {
            console.log('예약 취소 중 오류 발생:', error)
            alert('예약 취소 중 오류 발생')
        }
    }

    // 리뷰 작성 페이지로 이동하는 함수
    const handleGoToReview = reservation => {
        navigate('/review', {
            state: { reservation },
        })
    }

    // 리뷰 상세 보기 페이지로 이동하는 함수
    const handleGoToViewReview = reservationId => {
        navigate(`/reviewDetail/${reservationId}`)
    }

    // 더보기 버튼 클릭 시 페이지 증가
    const loadMoreReservations = () => {
        setCurrentPage(prevPage => prevPage + 1)
    }

    // 현재 페이지에 따라 예약 목록을 제한
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
                                                reservation.reservationDate,
                                                reservation.reservationTime
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
