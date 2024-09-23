import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MyDining.module.css'
import { api } from '../../config/config'
import ReviewModal from './ReviewModal/ReviewModal'
import ReviewDetailModal from './ReviewDetailModal/ReviewDetaiModall'

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

    // '구'나 '동' '시' 단위로 자르기
    const extractGuDong = address => {
        if (!address) return '지역 정보 없음'
        const guIndex = address.indexOf('구')
        const dongIndex = address.indexOf('동')
        const siIndex = address.indexOf('시')

        if (guIndex !== -1) {
            return address.substring(0, guIndex + 1) // '구'까지 포함
        } else if (dongIndex !== -1) {
            return address.substring(0, dongIndex + 1) // '동'까지 포함
        } else if (siIndex !== -1) {
            return address.substring(0, siIndex + 1) // '시'까지 포함
        }

        return address // '구'나 '동', '시' 없으면 전체 출력
    }

    // 예약 데이터 가져오기
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

    // 리뷰 상태 가져오기
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

    // 가게 정보 가져오기
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

    // 가게 정보 및 사진 가져오기
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

    // 예약 취소 처리
    const handleCancelReservation = async reservationId => {
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

    // 리뷰 작성 모달 열기
    const openReviewModal = reservation => {
        setSelectedReservation(reservation)
        setShowReviewModal(true)
    }

    // 리뷰 작성 모달 닫기
    const closeReviewModal = () => {
        setSelectedReservation(null)
        setShowReviewModal(false)
    }

    // 리뷰 상세 모달 열기
    const openReviewDetailModal = reservationId => {
        setSelectedReservationId(reservationId)
        setShowReviewDetailModal(true)
    }

    // 리뷰 상세 모달 닫기
    const closeReviewDetailModal = () => {
        setSelectedReservationId(null)
        setShowReviewDetailModal(false)
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

            {/* 리뷰 작성 모달 */}
            {showReviewModal && (
                <ReviewModal
                    reservation={selectedReservation}
                    onClose={closeReviewModal} // 모달 닫기 함수 전달
                />
            )}

            {/* 리뷰 상세 모달 */}
            {showReviewDetailModal && (
                <ReviewDetailModal
                    reservationId={selectedReservationId}
                    onClose={closeReviewDetailModal} // 모달 닫기 함수 전달
                />
            )}
        </div>
    )
}

export default MyDining
