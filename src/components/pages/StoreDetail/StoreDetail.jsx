import React, { useEffect, useState } from 'react';
import ReserveButton from './ReserveButton/ReserveButton';
import { api } from '../../config/config';
import { useParams } from 'react-router-dom';

function StoreDetail() {
    const { storeId } = useParams(); // URL 파라미터에서 storeId를 받아옴
    const [store, setStore] = useState(null);
    const [menus, setMenus] = useState([]); // 메뉴 상태 추가

    // 가게 상세 정보를 가져오는 함수
    useEffect(() => {
        const fetchStoreDetails = async () => {
            try {
                console.log("가게 정보 불러오는 중");
                const response = await api.get(`/store/${storeId}`);
                setStore(response.data);
                console.log(response.data); // 가게 정보 로그 확인
            } catch (error) {
                console.error('가게 정보를 불러오는 중 오류 발생:', error);
            }
        };

        if (storeId) {
            fetchStoreDetails(); // storeId가 존재할 경우만 데이터를 불러옴
        }
    }, [storeId]);

    // 메뉴 정보를 가져오는 함수
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await api.get(`/menu/store/${storeId}`);
                setMenus(response.data); // 메뉴 데이터 설정
                console.log("Menus:", response.data); // 메뉴 데이터 로그 확인
            } catch (error) {
                console.error('메뉴 정보를 불러오는 중 오류 발생:', error);
            }
        };

        if (storeId) {
            fetchMenus(); // storeId가 존재할 경우만 데이터를 불러옴
        }
    }, [storeId]);

    useEffect(() => {
        const loadKakaoMapScript = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=02825686e2926de94f77186ec704adf1&autoload=false&libraries=services`; // autoload를 false로 설정
                script.async = true;
                script.onload = () => resolve(window.kakao); // 스크립트가 로드되면 resolve
                script.onerror = () => reject(new Error("Kakao Map API 로드 실패"));
                document.head.appendChild(script);
            });
        };

        if (store && store.address1 && store.address2) {
            loadKakaoMapScript().then((kakao) => {
                kakao.maps.load(() => {
                    const mapContainer = document.getElementById('map'); // 지도를 표시할 div
                    const mapOption = {
                        center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 좌표 (없을 때를 대비한 기본 좌표)
                        level: 3, // 지도 확대 레벨
                    };

                    const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성

                    // 주소를 좌표로 변환하기 위한 Geocoder 객체 생성
                    const geocoder = new kakao.maps.services.Geocoder();
                    const fullAddress = `${store.address1} ${store.address2}`; // 기본 주소 + 상세 주소 결합
                    console.log("Full Address: ", fullAddress); // 주소 확인용 로그

                    // 주소로 좌표 검색
                    geocoder.addressSearch(fullAddress, function (result, status) {
                        if (status === kakao.maps.services.Status.OK) {
                            console.log("Geocoding Success", result); // 변환 성공 로그
                            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                            // 지도 중심을 검색된 좌표로 이동
                            map.setCenter(coords);

                            // 마커 생성 및 지도에 표시
                            const marker = new kakao.maps.Marker({
                                map: map,
                                position: coords,
                            });

                            marker.setMap(map);
                        } else {
                            console.error('주소 변환 실패:', status);
                        }
                    });
                });
            }).catch(error => console.error(error));
        }
    }, [store]);

    if (!store) return <div>가게 정보를 불러오는 중입니다...</div>; // 데이터 로딩 중 메시지

    return (
        <div>
            <div>여기는 디테일 영역</div>

            {/* Kakao 지도 영역 */}
            <div id="map" style={{ width: '100%', height: '400px', margin: '20px 0' }}></div>

            {/* 가게 정보 표시 */}
            {store && (
                <div>
                    <h2>{store.name}</h2>
                    <p>{store.description}</p>
                    <p>{store.address1} {store.address2}</p> {/* 주소 출력 */}
                </div>
            )}

            {/* 메뉴 리스트 출력 */}
            {menus.length > 0 ? (
                <div>
                    <h3>메뉴 목록</h3>
                    <ul>
                        {menus.map((menu) => (
                            <li key={menu.menuSeq}>
                                <p>메뉴 이름: {menu.name}</p>
                                <p>가격: {menu.price}</p>
                                <p>설명: {menu.description || '설명 없음'}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>메뉴 정보가 없습니다.</div>
            )}

            <div>
                <ReserveButton />
            </div>
        </div>
    );
}

export default StoreDetail;
