import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MyDining.module.css'
import { api } from '../../config/config'
import ReviewDetailModal from './ReviewDetailModal/ReviewDetaiModall'
import ReviewModal from './ReviewModal/ReviewModal'

function MyDining() {
    const [reservations, setReservations] = useState([])
    const [reviewsMap, setReviewsMap] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [storeInfoMap, setStoreInfoMap] = useState({})
    const reservationsPerPage = 5
    const [showReviewModal, setShowReviewModal] = useState(false) // 리뷰 작성 모달 상태
    const [showReviewDetailModal, setShowReviewDetailModal] = useState(false) // 리뷰 상세 모달 상태
    const [selectedReservation, setSelectedReservation] = useState(null) // 선택된 예약
    const [selectedReservationId, setSelectedReservationId] = useState(null) // 선택된 리뷰의 예약 ID
    const navigate = useNavigate()

    const extractGuDong = address => {
        if (!address) return '지역 정보 없음'
        const guIndex = address.indexOf('구')
        const dongIndex = address.indexOf('동')
        const siIndex = address.indexOf('시')

        if (guIndex !== -1) {
            return address.substring(0, guIndex + 1)
        } else if (dongIndex !== -1) {
            return address.substring(0, dongIndex + 1)
        } else if (siIndex !== -1) {
            return address.substring(0, siIndex + 1)
        }

        return address
    }

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await api.get('/reservation/user')
                if (response.status === 200) {
                    setReservations(response.data.reservations)
                    fetchReviewStatuses(response.data.reservations)
                    fetchAllStoreInfo(response.data.reservations)
                } else {
                    console.log('예약 데이터를 가져오는데 실패했습니다.')
                }
            } catch (error) {
                console.log('예약 데이터 로딩 중 오류 발생:', error)
            }
        }
        fetchReservations()
    }, [])

    const fetchReviewStatuses = async reservations => {
        const reviewsStatus = {}
        await Promise.all(
            reservations.map(async reservation => {
                try {
                    const response = await api.get(
                        `/reviews/${reservation.reservationId}`
                    )
                    reviewsStatus[reservation.reservationId] =
                        response.status === 200
                } catch (error) {
                    reviewsStatus[reservation.reservationId] = false
                }
            })
        )
        setReviewsMap(reviewsStatus)
    }

    const fetchAllStoreInfo = async reservations => {
        const storeInfoPromises = reservations.map(async reservation => {
            if (!storeInfoMap[reservation.storeSeq]) {
                const storeInfo = await fetchStoreInfo(reservation.storeSeq)
                return { storeSeq: reservation.storeSeq, storeInfo }
            }
            return {
                storeSeq: reservation.storeSeq,
                storeInfo: storeInfoMap[reservation.storeSeq],
            }
        })

        const storeInfos = await Promise.all(storeInfoPromises)
        const updatedStoreInfoMap = { ...storeInfoMap }
        storeInfos.forEach(({ storeSeq, storeInfo }) => {
            if (storeInfo) {
                updatedStoreInfoMap[storeSeq] = storeInfo
            }
        })
        setStoreInfoMap(updatedStoreInfoMap)
    }

    const fetchStoreInfo = async storeSeq => {
        try {
            const response = await api.get(`/store/${storeSeq}`)
            const photoResponse = await api.get(`/store/${storeSeq}/photos`)
            return {
                ...response.data,
                photos: photoResponse.data,
            }
        } catch (error) {
            console.log(
                `가게 정보를 불러오는데 실패했습니다: ${storeSeq}`,
                error
            )
            return null
        }
    }

    const handleCancelReservation = async reservation => {
        const currentDate = new Date()
        const reservationDate = new Date(reservation.reservationDate)

        const isSameDay =
            currentDate.getFullYear() === reservationDate.getFullYear() &&
            currentDate.getMonth() === reservationDate.getMonth() &&
            currentDate.getDate() === reservationDate.getDate()

        if (isSameDay) {
            const confirmed = window.confirm(
                '당일 예약 취소 또는 노쇼일 경우 3분 동안 예약 등록이 제한됩니다. 정말로 취소하시겠습니까?'
            )
            if (!confirmed) return

            // 취소 처리
            try {
                const response = await api.delete(
                    `/reservation/${reservation.reservationId}`
                )
                if (response.status === 200) {
                    alert('예약이 성공적으로 취소되었습니다.')

                    // 예약 취소 후 3분 제한 체크 로직 추가
                    const cancelTime = new Date() // 취소 시간 기록
                    sessionStorage.setItem(
                        'lastCancellationTime',
                        cancelTime.toISOString()
                    ) // 취소 시간을 저장

                    setReservations(
                        reservations.filter(
                            res =>
                                res.reservationId !== reservation.reservationId
                        )
                    )
                } else {
                    alert('예약 취소 실패')
                }
            } catch (error) {
                console.log('예약 취소 중 오류 발생:', error)
                alert('예약 취소 중 오류 발생')
            }
        } else {
            const confirmed = window.confirm('정말로 예약을 취소하시겠습니까?')
            if (!confirmed) return

            try {
                const response = await api.delete(
                    `/reservation/${reservation.reservationId}`
                )
                if (response.status === 200) {
                    alert('예약이 성공적으로 취소되었습니다.')
                    setReservations(
                        reservations.filter(
                            res =>
                                res.reservationId !== reservation.reservationId
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
    }

    // 예약 등록 시 3분 제한 확인
    const handleReservationRegistration = async newReservation => {
        try {
            const checkResponse = await api.get('/reservation/canReserve')
            if (!checkResponse.data.canReserve) {
                alert('최근 취소로 인해 3분 동안 예약이 제한됩니다.')
                return // 제한 시간이 지나지 않았으므로 예약 등록을 중단
            }

            // 예약 등록 처리
            const response = await api.post('/reservation', newReservation)
            if (response.status === 200) {
                alert('예약이 성공적으로 등록되었습니다.')
            } else {
                alert('예약 등록 실패')
            }
        } catch (error) {
            console.log('예약 등록 중 오류 발생:', error)
            alert('예약 등록 중 오류 발생')
        }
    }

    const openReviewModal = reservation => {
        setSelectedReservation(reservation)
        setShowReviewModal(true)
    }

    const closeReviewModal = () => {
        setSelectedReservation(null)
        setShowReviewModal(false)
    }

    const openReviewDetailModal = reservationId => {
        setSelectedReservationId(reservationId)
        setShowReviewDetailModal(true)
    }

    const closeReviewDetailModal = () => {
        setSelectedReservationId(null)
        setShowReviewDetailModal(false)
    }

    const handleReviewSubmitted = reservationId => {
        setReviewsMap(prevMap => ({
            ...prevMap,
            [reservationId]: true,
        }))
    }

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
                                ? storeInfo.photos[0].imageUrl
                                : null

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
                                                onError={e => {
                                                    e.target.src =
                                                        'default-image-url'
                                                }}
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
                                            {extractGuDong(storeInfo.address1)}{' '}
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
                                                    openReviewDetailModal(
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
                                                    openReviewModal(reservation)
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
                                                    reservation
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

            {showReviewModal && (
                <ReviewModal
                    reservation={selectedReservation}
                    onClose={closeReviewModal}
                    onReviewSubmitted={() =>
                        handleReviewSubmitted(selectedReservation.reservationId)
                    }
                />
            )}

            {showReviewDetailModal && (
                <ReviewDetailModal
                    reservationId={selectedReservationId}
                    onClose={closeReviewDetailModal}
                />
            )}
        </div>
    )
}

export default MyDining
