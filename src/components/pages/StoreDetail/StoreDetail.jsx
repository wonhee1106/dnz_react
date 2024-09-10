import React, { useEffect, useState } from 'react';
import ReserveButton from './ReserveButton/ReserveButton';
import ReserveModal from './ReserveButton/ReserveModal/ReserveModal';
import { api } from '../../config/config';

function StoreDetail({ storeId }) {
    const [store, setStore] = useState(null);

    useEffect(() => {
        // 가게 상세 정보를 서버로부터 가져오는 함수
        setStore(3);
        const fetchStoreDetails = async () => {
            try {
                const response = await api.get(`/store/${storeId}`);
                setStore(response.data);
            } catch (error) {
                console.error('가게 정보를 불러오는 중 오류 발생:', error);
            }
        };

        fetchStoreDetails();
    }, [storeId]);

    useEffect(() => {
        if (store && window.daum && window.daum.maps) {
            const mapContainer = document.getElementById('map'); // 지도를 표시할 div
            const mapOption = {
                center: new window.daum.maps.LatLng(33.450701, 126.570667), // 기본 좌표
                level: 3, // 지도 확대 레벨
            };

            const map = new window.daum.maps.Map(mapContainer, mapOption); // 지도를 생성

            // 주소를 좌표로 변환하기 위한 Geocoder 객체 생성
            const geocoder = new window.daum.maps.services.Geocoder();

            // 주소로 좌표 검색
            geocoder.addressSearch(store.address, function (result, status) {
                if (status === window.daum.maps.services.Status.OK) {
                    const coords = new window.daum.maps.LatLng(result[0].y, result[0].x);

                    // 지도 중심을 검색된 좌표로 이동
                    map.setCenter(coords);

                    // 마커 생성 및 지도에 표시
                    const marker = new window.daum.maps.Marker({
                        map: map,
                        position: coords,
                    });

                    marker.setMap(map);
                } else {
                    console.error('주소 변환 실패:', status);
                }
            });
        }
    }, [store]);

    if (!store) return <div>가게 정보를 불러오는 중입니다...</div>;
    return (
        <div>
            <div>여기는 디테일 영역</div>

            {/* Kakao 지도 영역 */}
            <div id="map" style={{ width: '100%', height: '400px', margin: '20px 0' }}></div>

            {/* 가게 정보 표시 */}
            <div>
                <h2>{store.name}</h2>
                <p>{store.description}</p>
            </div>

            <div>
                <ReserveButton />
            </div>
        </div>
    )
}

export default StoreDetail
