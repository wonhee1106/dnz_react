import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './MyDining.module.css'
import { api } from '../../config/config'

function MyDining() {
    const [reservations, setReservations] = useState([])
    const [reviewsMap, setReviewsMap] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [storeInfoMap, setStoreInfoMap] = useState({})
    const reservationsPerPage = 5
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

    // 가게 정보를 가져오는 함수 (사진 포함)
    useEffect(() => {
        const fetchStoreInfo = async storeSeq => {
            try {
                const response = await api.get(`/store/${storeSeq}`)
                const photoResponse = await api.get(`/store/${storeSeq}/photos`)
                return {
                    ...response.data,
                    photos: photoResponse.data, // 가게 사진 데이터 포함
                }
            } catch (error) {
                console.log(`가게 정보를 불러오는데 실패했습니다: ${storeSeq}`)
                return null
            }
        }

        if (reservations.length > 0) {
            const fetchAllStoreInfo = async () => {
                const storeInfoPromises = reservations.map(
                    async reservation => {
                        if (!storeInfoMap[reservation.storeSeq]) {
                            const storeInfo = await fetchStoreInfo(
                                reservation.storeSeq
                            )
                            return { storeSeq: reservation.storeSeq, storeInfo }
                        }
                        return {
                            storeSeq: reservation.storeSeq,
                            storeInfo: storeInfoMap[reservation.storeSeq],
                        }
                    }
                )

                const storeInfos = await Promise.all(storeInfoPromises)
                const updatedStoreInfoMap = { ...storeInfoMap }
                storeInfos.forEach(({ storeSeq, storeInfo }) => {
                    if (storeInfo) {
                        updatedStoreInfoMap[storeSeq] = storeInfo
                    }
                })
                setStoreInfoMap(updatedStoreInfoMap)
            }

            fetchAllStoreInfo()
        }
    }, [reservations])

    // 리뷰 상태 업데이트
    useEffect(() => {
        if (location.state?.updatedReservationId) {
            const updatedId = location.state.updatedReservationId
            const newReviewsMap = { ...reviewsMap }
            newReviewsMap[updatedId] = true
            setReviewsMap(newReviewsMap)
        }
    }, [location.state])

    // 예약 취소 처리 함수
    const handleCancelReservation = async (
        reservationId,
        reservationDate,
        reservationTime
    ) => {
        const confirmed = window.confirm('정말로 예약을 취소하시겠습니까?')
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

    // 리뷰 작성 페이지로 이동
    const handleGoToReview = reservation => {
        navigate('/review', { state: { reservation } })
    }

    // 리뷰 상세 보기 페이지로 이동
    const handleGoToViewReview = reservationId => {
        navigate(`/reviewDetail/${reservationId}`)
    }

    // 더보기 버튼 클릭 시 페이지 증가
    const loadMoreReservations = () => {
        setCurrentPage(prevPage => prevPage + 1)
    }

    const displayedReservations = reservations.slice(
        0,
        currentPage * reservationsPerPage
    )

    return (
        <div className={styles.reservationContainer}>
            <h2 className={styles.title}>나의 예약 내역</h2>
            {displayedReservations.length > 0 ? (
                <>
                    {displayedReservations.map(reservation => {
                        const storeInfo =
                            storeInfoMap[reservation.storeSeq] || {}
                        const photoUrl =
                            storeInfo.photos && storeInfo.photos.length > 0
                                ? storeInfo.photos[0] // 첫 번째 가게 사진 사용
                                : null // 사진이 없을 경우

                        return (
                            <div
                                key={reservation.reservationId}
                                className={styles.reservationCard}
                            >
                                <div className={styles.reservationInfoRow}>
                                    <div className={styles.imagePlaceholder}>
                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt="가게 이미지"
                                                className={styles.storeImage}
                                            />
                                        ) : (
                                            '이미지 없음'
                                        )}
                                    </div>
                                    <div className={styles.textInfo}>
                                        <p className={styles.restaurantName}>
                                            {reservation.storeName}
                                        </p>
                                        <p className={styles.additionalInfo}>
                                            {storeInfo.address1 ||
                                                '지역 정보 없음'}{' '}
                                            ·{' '}
                                            {storeInfo.category ||
                                                '음식종류 정보 없음'}
                                        </p>
                                        <p className={styles.dateInfo}>
                                            {new Date(
                                                reservation.reservationDate
                                            ).toLocaleDateString('ko-KR')}{' '}
                                            {reservation.reservationTime}{' '}
                                            {reservation.numGuests}명
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.reservationActions}>
                                    {reservation.status === 'confirmed' ? (
                                        reviewsMap[
                                            reservation.reservationId
                                        ] ? (
                                            <button
                                                className={
                                                    styles.viewReviewButton
                                                }
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
                                                    handleGoToReview(
                                                        reservation
                                                    )
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
                                                    reservation.reservationId
                                                )
                                            }
                                        >
                                            예약 취소
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
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
