import React, { useEffect, useState } from 'react'
import { api } from '../../../../../../../../../config/config' // API 경로에 맞게 설정
import styles from './ReserveDetail.module.css'

function ReserveDetail() {
    const [reservations, setReservations] = useState([])

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

    const isPastReservation = (reservationDate, reservationTime) => {
        const now = new Date()
        const [hour, minute] = reservationTime.split(':')
        const reservationDateTime = new Date(reservationDate)
        reservationDateTime.setHours(hour)
        reservationDateTime.setMinutes(minute)
        return reservationDateTime < now
    }

    const isSameDay = reservationDate => {
        const today = new Date().setHours(0, 0, 0, 0)
        const resDate = new Date(reservationDate).setHours(0, 0, 0, 0)
        return today === resDate
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
        if (isSameDay(reservationDate)) {
            const confirmed = window.confirm(
                '당일 예약 취소 시 노쇼로 인해 3일간 예약이 제한됩니다. 정말 취소하시겠습니까?'
            )
            if (!confirmed) return
        } else {
            const confirmed = window.confirm('정말 예약을 취소하시겠습니까?')
            if (!confirmed) return
        }

        try {
            const response = await api.delete(`/reservation/${reservationId}`)
            if (response.status === 200) {
                alert('예약이 성공적으로 취소되었습니다.')
                setReservations(
                    reservations.filter(
                        res => res.reservationId !== reservationId
                    )
                ) // 상태 업데이트
            } else {
                alert('예약 취소 실패ㅠㅠ')
            }
        } catch (error) {
            console.log('예약 취소 중 오류 발생:', error)
            alert('예약 취소 중 오류 발생ㅠㅠ')
        }
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
                                <button className={styles.goToReview}>
                                    리뷰 작성
                                </button>
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
