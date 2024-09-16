import React, { useEffect, useState } from 'react';

const MyMaps = () => {
  const [map, setMap] = useState(null);
  const [restaurants, setRestaurants] = useState([]);  // 맛집 정보를 저장하는 상태

  // 지도 초기화 함수
  const initMap = () => {
    const mapDiv = document.getElementById('map');  // 지도를 표시할 div
    if (window.naver) {
      const map = new window.naver.maps.Map(mapDiv, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),  // 서울 중심 좌표
        zoom: 14,  // 줌 레벨
      });
      setMap(map);  // map 객체를 상태로 저장
    }
  };

  // 네이버 검색 API로 맛집 정보 가져오기
  const fetchRestaurants = async () => {
    const query = 'blog';
   

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': 'ChKDn5ZXWdLP0wtTxULN',  // 검색 API Client ID
          'X-Naver-Client-Secret': 'RwZj03KpZ_'  // 검색 API Client Secret
        }
      });

      const contentType = response.headers.get("content-type");

      // 응답이 성공적인지 확인
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 응답이 JSON 형식인지 확인
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setRestaurants(data.items);  // JSON 응답 처리
      } else {
        const errorText = await response.text();
        throw new Error(`Unexpected response format: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  };

  // 지도에 마커 추가하는 함수
  const addMarkers = () => {
    if (!map || restaurants.length === 0) return;

    restaurants.forEach((restaurant) => {
      const { mapx, mapy, title } = restaurant;

      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(mapy, mapx),
        map: map,
        title: title,
      });

      // 마커 클릭 이벤트 추가 (마커 클릭 시 정보 창 표시)
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:5px;">${title}</div>`,  // 맛집 이름을 정보 창으로 표시
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);  // 마커 클릭 시 정보 창 열기
      });
    });
  };

  // 컴포넌트 마운트 시 지도 초기화 및 맛집 데이터 가져오기
  useEffect(() => {
    initMap();
  }, []);

  // 맛집 데이터를 가져오고 마커를 지도에 추가
  useEffect(() => {
    fetchRestaurants();
  }, [map]);

  // 마커를 지도에 추가
  useEffect(() => {
    addMarkers();
  }, [restaurants]);

  return (
    <div>
      <h2>내 주변 맛집</h2>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default MyMaps;
