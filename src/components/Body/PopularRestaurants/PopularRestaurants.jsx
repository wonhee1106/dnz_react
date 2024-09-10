import React, { useRef, useEffect, useState } from 'react';
import './PopularRestaurants.css';

const PopularRestaurants = () => {
  const [koreanRestaurants, setKoreanRestaurants] = useState([]);
  const [chineseRestaurants, setChineseRestaurants] = useState([]);
  const [westernRestaurants, setWesternRestaurants] = useState([]);
  const [japaneseRestaurants, setJapaneseRestaurants] = useState([]);

  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);

  const serverURL = process.env.REACT_APP_SERVER_URL;
  const token = localStorage.getItem('jwtToken'); // 로컬 스토리지에서 JWT 토큰 가져오기

  const fetchRestaurantPhotos = (storeSeq) => {
    return fetch(`${serverURL}/photos/${storeSeq}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => response.json());
  };

  const fetchRestaurants = (category, setRestaurants) => {
    fetch(`${serverURL}/stores/category/${category}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // JWT 토큰을 포함한 Authorization 헤더 추가
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(async (data) => {
        // 각 가게에 대해 사진 데이터를 가져온 후 가게 데이터와 병합
        const updatedData = await Promise.all(
          data.map(async (restaurant) => {
            const photos = await fetchRestaurantPhotos(restaurant.storeSeq);
            return { ...restaurant, photos };
          })
        );
        setRestaurants(updatedData);
      })
      .catch((error) => console.error(`Error fetching ${category}:`, error));
  };

  useEffect(() => {
    fetchRestaurants('한식', setKoreanRestaurants);
    fetchRestaurants('중식', setChineseRestaurants);
    fetchRestaurants('양식', setWesternRestaurants);
    fetchRestaurants('일식', setJapaneseRestaurants);
  }, [serverURL, token]);

  const scrollLeft = (scrollRef) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (scrollRef) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleCardClick = (url) => {
    window.location.href = url;
  };

  const renderRestaurantCard = (restaurant) => (
    <div
      key={restaurant.name}
      className="restaurant-list-item restaurant-card"
      role="button"
      tabIndex={0}
      onClick={() => handleCardClick(restaurant.url)} // 클릭 시 URL로 이동
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleCardClick(restaurant.url);
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="tb">
        <div
          className="img"
          style={{ backgroundImage: `url(${restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos[0].imageUrl : 'defaultImageUrl'})` }} // 이미지 표시
        ></div>
      </div>
      <div className="detail">
        <button className="btn-bookmark" onClick={(e) => e.stopPropagation()}>북마크</button>
        <div>
          <h3 className="name">{restaurant.name}</h3>
          <div className="meta">
            <span className="score">{restaurant.score}</span>
            <span className="tags">{restaurant.description}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* 한식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">한식</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef1)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef1}>
            <div className="restaurant-list restaurant-list-sm">
              {koreanRestaurants.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef1)}>{">"}</button>
        </div>
      </div>

      {/* 중식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">중식</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef2)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef2}>
            <div className="restaurant-list restaurant-list-sm">
              {chineseRestaurants.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef2)}>{">"}</button>
        </div>
      </div>

      {/* 양식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">양식</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef3)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef3}>
            <div className="restaurant-list restaurant-list-sm">
              {westernRestaurants.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef3)}>{">"}</button>
        </div>
      </div>

      {/* 일식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">일식</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef4)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef4}>
            <div className="restaurant-list restaurant-list-sm">
              {japaneseRestaurants.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef4)}>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default PopularRestaurants;
