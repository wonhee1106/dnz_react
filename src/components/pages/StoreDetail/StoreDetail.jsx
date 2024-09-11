import React, { useEffect, useState } from 'react';
import ReserveButton from './ReserveButton/ReserveButton';
import { api } from '../../config/config';
import { useParams } from 'react-router-dom';
import './StoreDetail.css'; // CSS 파일 추가

function StoreDetail() {
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [menus, setMenus] = useState([]);

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

    // 가게의 메뉴 데이터를 서버로부터 가져오는 함수
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

        if (store && store.address1 && store.address2) {
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

    if (!store) return <div className="loading">가게 정보를 불러오는 중입니다...</div>;

    return (
        <div className="store-detail-container">
            <div id="map"></div>
            
            <div className="store-info">
                <h2>{store.name}</h2>
                <p>{store.address1} {store.address2}</p>
                <p>{store.description}</p>
            </div>
        
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
