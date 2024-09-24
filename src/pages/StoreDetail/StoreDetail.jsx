import React, { useEffect, useState } from 'react'
import ReserveButton from './ReserveButton/ReserveButton'
import { api } from '../../config/config'
import { useParams } from 'react-router-dom'
import './StoreDetail.css' // CSS 파일 추가
import ReserveModal from './ReserveButton/ReserveModal/ReserveModal'
import ConfirmReserveModal from './ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveModal'
import defaultImage from '../../img/store.png'
import FinalConfirmReserveModal from './ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveButton/FinalConfirmReserveModal/FinalConfirmReserveModal'

function StoreDetail() {
    const { storeId } = useParams() // storeId는 메뉴 요청에 사용
    const [store, setStore] = useState(null)
    const [menus, setMenus] = useState([])
    const [photos, setPhotos] = useState([]) // 사진 데이터를 관리하는 상태
    const [visibleMenus, setVisibleMenus] = useState(5) // 처음에 표시할 메뉴 개수
    const [notice, setNotice] = useState('') // 공지사항을 저장하는 상태
    const [reviews, setReviews] = useState([]) // 가게 리뷰 상태 관리
    const [visibleReviews, setVisibleReviews] = useState(3) // 처음에 표시할 리뷰 개수

    // 강제 리렌더링을 위한 상태
    const [refresh, setRefresh] = useState(0);

    // 모달 상태 관리
    const [isReserveModalOpen, setIsReserveModalOpen] = useState(false)
    const [isConfirmReserveModalOpen, setIsConfirmReserveModalOpen] =
        useState(false)
    const [isFinalConfirmModalOpen, setIsFinalConfirmModalOpen] =
        useState(false)
    const [reserveDetails, setReserveDetails] = useState(null) // 예약 정보를 저장하는 상태

    // 가게 공지사항을 가져오는 함수
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await api.get(`/notice/store/${storeId}`)
                if (response.status === 200) {
                    setNotice(response.data.content)
                } else {
                    setNotice('공지사항이 없습니다.')
                }
            } catch (error) {
                console.error('Error fetching notice:', error)
                setNotice('공지사항을 가져오는 데 실패했습니다.')
            }
        }

        if (storeId) {
            fetchNotice()
        }
    }, [storeId])

    // 가게 상세 정보를 서버로부터 가져오는 함수
    useEffect(() => {
        const fetchStoreDetails = async () => {
            try {
                const response = await api.get(`/store/${storeId}`)
                setStore(response.data)
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching store details:', error)
            }
        }

        if (storeId) {
            fetchStoreDetails()
        }
    }, [storeId, refresh])

    // 가게의 메뉴 데이터를 서버로부터 가져오는 함수 (storeId 사용)
    useEffect(() => {
        const fetchMenuDetails = async () => {
            try {
                const response = await api.get(`/menu/store/${storeId}`)
                setMenus(response.data)
            } catch (error) {
                console.error('Error fetching menu details:', error)
            }
        }

        if (storeId) {
            fetchMenuDetails()
        }
    }, [storeId])

    // 가게의 리뷰 데이터를 서버로부터 가져오는 함수
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviews/store/${storeId}`)
                if (response.status === 200) {
                    setReviews(response.data.reviews)
                } else {
                    console.log('리뷰 데이터를 가져오는데 실패했습니다.')
                }
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        }

        if (storeId) {
            fetchReviews()
        }
    }, [storeId])

    // storeSeq를 사용하여 사진 데이터를 가져오는 함수
    const fetchRestaurantPhotos = storeSeq => {
        return fetch(
            `${process.env.REACT_APP_SERVER_URL}/photos/store/${storeSeq}`,
            {
                method: 'GET',
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching photos')
                }
                return response.json()
            })
            .catch(error => {
                console.error('Error fetching photos:', error)
                return [] // 에러가 발생한 경우 빈 배열 반환
            })
    }

    // storeSeq를 사용하여 사진 데이터를 가져오는 useEffect
    useEffect(() => {
        if (store && store.storeSeq) {
            const fetchPhotos = async () => {
                try {
                    const photosData = await fetchRestaurantPhotos(
                        store.storeSeq
                    )
                    setPhotos(photosData) // 사진 데이터를 상태에 저장
                } catch (error) {
                    console.error('Error fetching photos:', error)
                }
            }

            fetchPhotos()
        }
    }, [store])

    // 지도 API 로드
    useEffect(() => {
        const loadKakaoMapScript = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script')
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=b924aaca10af3dbd3c75d198e88d0de0&autoload=false&libraries=services`
                script.async = true
                script.onload = () => resolve(window.kakao)
                script.onerror = () =>
                    reject(new Error('Failed to load Kakao Map API'))
                document.head.appendChild(script)
            })
        }

        if (store && store.address1) {
            loadKakaoMapScript().then(kakao => {
                kakao.maps.load(() => {
                    const mapContainer = document.getElementById('map')
                    const mapOption = {
                        center: new kakao.maps.LatLng(33.450701, 126.570667),
                        level: 3,
                    }

                    const map = new kakao.maps.Map(mapContainer, mapOption)
                    const geocoder = new kakao.maps.services.Geocoder()
                    const fullAddress = `${store.address1} ${store.address2}`

                    geocoder.addressSearch(
                        fullAddress,
                        function (result, status) {
                            if (status === kakao.maps.services.Status.OK) {
                                const coords = new kakao.maps.LatLng(
                                    result[0].y,
                                    result[0].x
                                )
                                map.setCenter(coords)
                                const marker = new kakao.maps.Marker({
                                    map: map,
                                    position: coords,
                                })
                                marker.setMap(map)
                            }
                        }
                    )
                })
            })
        }
    }, [store])

    // "더보기" 버튼 클릭 시 더 많은 메뉴를 표시
    const handleLoadMoreMenus = () => {
        setVisibleMenus(prevVisibleMenus => prevVisibleMenus + 5) // 5개씩 더 로드
    }

    // "더보기" 버튼 클릭 시 더 많은 리뷰를 표시
    const handleLoadMoreReviews = () => {
        setVisibleReviews(prevVisibleReviews => prevVisibleReviews + 3) // 3개씩 더 로드
    }

    // 모달 관련 함수
    const openReserveModal = () => setIsReserveModalOpen(true)
    const closeReserveModal = () => setIsReserveModalOpen(false)

    const handleNextToConfirmModal = details => {
        setReserveDetails(details)
        setIsReserveModalOpen(false)
        setIsConfirmReserveModalOpen(true)
    }

    const handleNextToFinalModal = () => {
        setIsConfirmReserveModalOpen(false)
        setIsFinalConfirmModalOpen(true)
    }

    const handleFinalConfirm = () => {
        setIsFinalConfirmModalOpen(false);
        setRefresh(prev => prev + 1); // 리렌더링 트리거
    };

    // 가게 정보가 없을 경우 로딩 메시지 표시
    if (!store)
        return <div className="loading">가게 정보를 불러오는 중입니다...</div>

    return (
        <div className="store-detail-container">
            <div className="store-info">
                {/* 사진을 가게 이름 아래에 표시하는 부분 */}
                <div className="photos-container">
                    {photos.length > 0 ? (
                        photos.map(photo => (
                            <div
                                key={photo.photoId}
                                className="store-photo"
                                style={{
                                    backgroundImage: `url(${
                                        photo.imageUrl
                                            ? photo.imageUrl
                                            : defaultImage
                                    })`, // 사진이 없는 경우 기본 이미지 표시
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '900px', // 사진 크기 지정
                                    height: '400px',
                                }}
                            ></div>
                        ))
                    ) : (
                        <div
                            className="store-photo"
                            style={{
                                backgroundImage: `url(${defaultImage})`, // 기본 이미지 표시
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '600px', // 사진 크기 지정
                                height: '400px',
                            }}
                        ></div>
                    )}
                </div>
                {/* 가게 이름과 주소를 출력하는 부분 */}
                <h3>{store.name}</h3> {/* 가게 이름 출력 */}
                <p>{store.description}</p>
                <div id="map"></div> {/* 지도 */}
                <p>
                    {store.address1} {store.address2}
                </p>{' '}
                {/* 지도 아래 가게 주소 출력 */}
            </div>

            {/* Reserve Modal */}
            {isReserveModalOpen && (
                <ReserveModal
                    storeSeq={storeId}
                    name={store.name}
                    seatStatus={store.seatStatus}
                    seatCapacity={store.seatCapacity}
                    onClose={closeReserveModal}
                    onNext={handleNextToConfirmModal}
                />
            )}

            {/* Confirm Reserve Modal */}
            {isConfirmReserveModalOpen && (
                <ConfirmReserveModal
                    date={reserveDetails?.date}
                    time={reserveDetails?.time}
                    guests={reserveDetails?.guests}
                    storeSeq={storeId}
                    name={store.name}
                    onClose={() => setIsConfirmReserveModalOpen(false)}
                    onNext={handleNextToFinalModal}
                />
            )}

            {/* Final Confirm Reserve Modal */}
            {isFinalConfirmModalOpen && (
                <FinalConfirmReserveModal
                    date={reserveDetails?.date}
                    time={reserveDetails?.time}
                    guests={reserveDetails?.guests}
                    storeSeq={storeId}
                    name={store.name}
                    onClose={handleFinalConfirm}
                />
            )}

            {/* 공지사항 영역 추가 */}
            <div className="notice-section">
                <h3>공지사항</h3>
                <p>{notice ? notice : '공지사항이 없습니다.'}</p>
            </div>

            <div className="menu-list">
                <div className="menu-title-container">
                    <h3>메뉴</h3> {/* 메뉴 제목 */}
                    <div className="reserve-button-container">
                        <button
                            onClick={openReserveModal}
                            className="reserve-button"
                        >
                            예약하기
                        </button>
                    </div>{' '}
                    {/* 예약 버튼 */}
                </div>

                {menus.length > 0 ? (
                    <div>
                        {menus.slice(0, visibleMenus).map(menu => (
                            <div key={menu.menuSeq} className="menu-item">
                                <strong>{menu.name}</strong>
                                <div>
                                    {menu.price ? menu.price : '가격 정보 없음'}
                                </div>
                                {menu.description && <p>{menu.description}</p>}
                            </div>
                        ))}
                        {visibleMenus < menus.length && (
                            <button
                                className="load-more"
                                onClick={handleLoadMoreMenus}
                            >
                                더보기
                            </button>
                        )}
                    </div>
                ) : (
                    <p>메뉴가 없습니다.</p>
                )}
            </div>

            {/* 리뷰 섹션 */}
            <div className="review-section">
                <h1>리뷰</h1>
                {reviews.length > 0 ? (
                    <div className="reviews-list">
                        {reviews.slice(0, visibleReviews).map(review => (
                            <div key={review.reviewId} className="review-item">
                                <div className="review-header">
                                    <div className="review-rating">
                                        {[...Array(review.rating)].map(
                                            (_, i) => (
                                                <span key={i} className="star">
                                                    ★
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <span className="review-date">
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString('ko-KR')}
                                    </span>
                                </div>
                                <p className="review-text">
                                    {review.reviewText}
                                </p>
                                <span className="review-user">
                                    작성자: {review.userId}
                                </span>
                            </div>
                        ))}
                        {visibleReviews < reviews.length && (
                            <button
                                className="load-more-reviews"
                                onClick={handleLoadMoreReviews}
                            >
                                더보기
                            </button>
                        )}
                    </div>
                ) : (
                    <p>리뷰가 없습니다.</p>
                )}
            </div>
        </div>
    )
}

export default StoreDetail
