import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios를 직접 import
import './mymaps.css'; // CSS 파일 추가

function Mymaps() {
  const [stores, setStores] = useState([]);

  // Axios 인스턴스 생성
  const api = axios.create({
    baseURL: 'http://192.168.1.11', // 백엔드 서버 주소와 포트로 수정하세요
  });

  // 모든 가게 정보를 가져오는 함수
  useEffect(() => {
    const fetchStores = async () => {
      try {
        // 모든 가게 데이터를 가져오는 API 호출 (/store/all)
        const response = await api.get('/store/all');
        setStores(response.data); // stores 상태에 데이터를 저장
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStores();
  }, []);

  // 카카오 지도 API를 불러와서 마커 생성
  useEffect(() => {
    const loadKakaoMapScript = () => {
      return new Promise((resolve, reject) => {
        // 이미 스크립트가 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
          resolve(window.kakao);
          return;
        }

        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=02825686e2926de94f77186ec704adf1&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => resolve(window.kakao);
        script.onerror = () => reject(new Error('Failed to load Kakao Map API'));
        document.head.appendChild(script);
      });
    };

    // 스크립트가 로드되면 지도 설정
    if (stores.length > 0) {
      loadKakaoMapScript().then((kakao) => {
        kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울을 기본 중심으로 설정
            level: 5, // 지도의 줌 레벨
          };

          const map = new kakao.maps.Map(mapContainer, mapOption);
          const geocoder = new kakao.maps.services.Geocoder();

          // 모든 가게 주소를 반복하여 마커로 표시
          stores.forEach((store) => {
            const fullAddress = `${store.address1} ${store.address2}`;

            geocoder.addressSearch(fullAddress, function (result, status) {
              if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 지도에 마커를 생성
                const marker = new kakao.maps.Marker({
                  map: map,
                  position: coords,
                });

                // 마커에 클릭 이벤트를 추가해 인포윈도우를 보여줌
                const infowindow = new kakao.maps.InfoWindow({
                  content: `<div style="padding:5px;">${store.name}</div>`,
                });

                kakao.maps.event.addListener(marker, 'click', function () {
                  infowindow.open(map, marker);
                });
              } else {
                console.error('주소 검색 실패:', fullAddress);
              }
            });
          });
        });
      });
    }
  }, [stores]);

  return (
    <div className="maps-container">
      <div id="map" style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
}

export default Mymaps;
