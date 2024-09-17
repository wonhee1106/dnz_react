import React, { useEffect, useState } from 'react';
import ReserveButton from './ReserveButton/ReserveButton';

import { api } from '../../config/config';
import { useParams } from 'react-router-dom';
import './StoreDetail.css'; // CSS 파일 추가

function StoreDetail() {
    const { storeId } = useParams(); // storeId는 메뉴 요청에 사용
    const [store, setStore] = useState(null);
    const [menus, setMenus] = useState([]);
    const [photos, setPhotos] = useState([]); // 사진 데이터를 관리하는 상태

    // 가게 상세 정보를 서버로부터 가져오는 함수
    useEffect(() => {
        const fetchStoreDetails = async () => {
            try {
                const response = await api.get(`/store/${storeId}`);
                setStore(response.data);
            } catch (error) {
                console.error('Error fetching store details:', error);
            }
        };

        if (storeId) {
            fetchStoreDetails();
        }
    }, [storeId]);

    // 가게의 메뉴 데이터를 서버로부터 가져오는 함수 (storeId 사용)
    useEffect(() => {
        const fetchMenuDetails = async () => {
            try {
                const response = await api.get(`/menu/store/${storeId}`);
                setMenus(response.data);
            } catch (error) {
                console.error('Error fetching menu details:', error);
            }
        };

        if (storeId) {
            fetchMenuDetails();
        }
    }, [storeId]);

    // storeSeq를 사용하여 사진 데이터를 가져오는 함수
    const fetchRestaurantPhotos = (storeSeq) => {
        return fetch(`${process.env.REACT_APP_SERVER_URL}/photos/store/${storeSeq}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error fetching photos');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Error fetching photos:', error);
                return []; // 에러가 발생한 경우 빈 배열 반환
            });
    };

    // storeSeq를 사용하여 사진 데이터를 가져오는 useEffect
    useEffect(() => {
        if (store && store.storeSeq) {
            const fetchPhotos = async () => {
                try {
                    const photosData = await fetchRestaurantPhotos(store.storeSeq);
                    setPhotos(photosData); // 사진 데이터를 상태에 저장
                } catch (error) {
                    console.error('Error fetching photos:', error);
                }
            };

            fetchPhotos();
        }
    }, [store]);

    // 지도 API 로드
    useEffect(() => {
        const loadKakaoMapScript = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=02825686e2926de94f77186ec704adf1&autoload=false&libraries=services`;
                script.async = true;
                script.onload = () => resolve(window.kakao);
                script.onerror = () => reject(new Error('Failed to load Kakao Map API'));
                document.head.appendChild(script);
            });
        };

        if (store && store.address1) {
            loadKakaoMapScript().then((kakao) => {
                kakao.maps.load(() => {
                    const mapContainer = document.getElementById('map');
                    const mapOption = {
                        center: new kakao.maps.LatLng(33.450701, 126.570667),
                        level: 3,
                    };

                    const map = new kakao.maps.Map(mapContainer, mapOption);
                    const geocoder = new kakao.maps.services.Geocoder();
                    const fullAddress = `${store.address1} ${store.address2}`;

                    geocoder.addressSearch(fullAddress, function (result, status) {
                        if (status === kakao.maps.services.Status.OK) {
                            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                            map.setCenter(coords);
                            const marker = new kakao.maps.Marker({
                                map: map,
                                position: coords,
                            });
                            marker.setMap(map);
                        }
                    });
                });
            });
        }
    }, [store]);

    // 가게 정보가 없을 경우 로딩 메시지 표시
    if (!store) return <div className="loading">가게 정보를 불러오는 중입니다...</div>;

    return (
        <div className="store-detail-container">
           
            
            <div className="store-info">
                

                {/* 사진을 가게 이름 아래에 표시하는 부분 */}
                <div className="photos-container">
                    {photos.length > 0 ? (
                        photos.map((photo) => (
                            <div
                                key={photo.photoId}
                                className="store-photo"
                                style={{
                                    backgroundImage: `url(${photo.imageUrl || 'defaultImageUrl.jpg'})`, // 사진이 없는 경우 기본 이미지 표시
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '900px', // 사진 크기 지정
                                    height: '400px',
                                }}
                            ></div>
                        ))
                    ) : (
                        <p>사진이 없습니다.</p>
                    )}
                </div>

                <p>{store.address1} {store.address2}</p>
                <div id="map"></div>
                <p>{store.description}</p>
            </div>
            <h2>{store.name}</h2>
            <div className="menu-list">
                <h3>메뉴</h3>
                {menus.length > 0 ? (
                    <div>
                        {menus.map((menu) => (
                            <div key={menu.menuSeq} className="menu-item">
                                <strong>{menu.name}</strong>
                                <div>{menu.price ? menu.price + '원' : '가격 정보 없음'}</div>
                                {menu.description && <p>{menu.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>메뉴가 없습니다.</p>
                )}
            </div>

            <div className="reserve-button-container">
                <ReserveButton />
            </div>
        </div>
    );
}

export default StoreDetail;