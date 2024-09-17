import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './PopularRestaurants.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';

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
  const navigate = useNavigate(); // useNavigate 훅 추가

  const fetchRestaurantPhotos = (storeSeq) => {
    return fetch(`${serverURL}/photos/store/${storeSeq}`, {
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

  const removeDuplicateNames = (restaurants) => {
    const uniqueRestaurants = [];
    const namesSet = new Set();

    restaurants.forEach((restaurant) => {
      if (!namesSet.has(restaurant.name)) {
        uniqueRestaurants.push(restaurant);
        namesSet.add(restaurant.name);
      }
    });

    return uniqueRestaurants;
  };

  const fetchRestaurants = (category, setRestaurants) => {
    fetch(`${serverURL}/store/category/${category}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(async (data) => {
        const updatedData = await Promise.all(
          data.map(async (restaurant) => {
            const photos = await fetchRestaurantPhotos(restaurant.storeSeq); // 사진 데이터 가져오기
            return { ...restaurant, photos, isBookmarked: false }; // 사진을 레스토랑 데이터에 추가
          })
        );

        const filteredData = removeDuplicateNames(updatedData); // 중복된 이름을 필터링
        setRestaurants(filteredData); // 상태에 설정
      })
      .catch((error) => console.error(`Error fetching ${category}:`, error));
  };

  useEffect(() => {
    fetchRestaurants('한식', setKoreanRestaurants);
    fetchRestaurants('중식', setChineseRestaurants);
    fetchRestaurants('양식', setWesternRestaurants);
    fetchRestaurants('일식', setJapaneseRestaurants);
  }, [serverURL]);

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

  const handleCardClick = (storeSeq) => {
    navigate(`/store/${storeSeq}`); // storeSeq를 포함하여 StoreDetail로 이동
  };

  // 북마크 토글
  const toggleBookmark = (e, restaurantId, setRestaurants, restaurants) => {
    e.stopPropagation(); // 클릭 이벤트가 카드로 전달되지 않도록 방지
    const updatedRestaurants = restaurants.map((restaurant) =>
      restaurant.storeSeq === restaurantId
        ? { ...restaurant, isBookmarked: !restaurant.isBookmarked }
        : restaurant
    );
    setRestaurants(updatedRestaurants); // 토글된 북마크 상태 반영
  };

  const renderRestaurantCard = (restaurant, restaurants, setRestaurants) => (
    <div
      key={restaurant.storeSeq}
      className="restaurant-list-item restaurant-card"
      role="button"
      tabIndex={0}
      onClick={() => handleCardClick(restaurant.storeSeq)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleCardClick(restaurant.storeSeq);
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="tb">
        <div
          className="img"
          style={{
            backgroundImage: `url(${restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos[0].imageUrl : 'defaultImageUrl'})`,
          }}
        ></div>
      </div>
      <div className="detail">
        <button
          className="btn-bookmark"
          onClick={(e) => toggleBookmark(e, restaurant.storeSeq, setRestaurants, restaurants)}
        >
          <FontAwesomeIcon
            icon={restaurant.isBookmarked ? solidBookmark : regularBookmark}
            className="faBookmark1"
          />
        </button>
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

  const handleMoreClick = (category) => {
    navigate(`/storeList/${category}`); // 카테고리를 URL에 포함하여 페이지로 이동
  };

  return (
    <div>
      {/* 한식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <div className="section-header-wrap">
          <h2 className="section-header">한식</h2>
          <button className="btn-more" onClick={() => handleMoreClick('한식')}>
            더보기
          </button>
        </div>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef1)}>
            {'<'}
          </button>
          <div className="v-scroll-inner" ref={scrollRef1}>
            <div className="restaurant-list restaurant-list-sm">
              {koreanRestaurants.map((restaurant) =>
                renderRestaurantCard(restaurant, koreanRestaurants, setKoreanRestaurants)
              )}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef1)}>
            {'>'}
          </button>
        </div>
      </div>

      {/* 중식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <div className="section-header-wrap">
          <h2 className="section-header">중식</h2>
          <button className="btn-more" onClick={() => handleMoreClick('중식')}>
            더보기
          </button>
        </div>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef2)}>
            {'<'}
          </button>
          <div className="v-scroll-inner" ref={scrollRef2}>
            <div className="restaurant-list restaurant-list-sm">
              {chineseRestaurants.map((restaurant) =>
                renderRestaurantCard(restaurant, chineseRestaurants, setChineseRestaurants)
              )}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef2)}>
            {'>'}
          </button>
        </div>
      </div>

      {/* 양식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <div className="section-header-wrap">
          <h2 className="section-header">양식</h2>
          <button className="btn-more" onClick={() => handleMoreClick('양식')}>
            더보기
          </button>
        </div>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef3)}>
            {'<'}
          </button>
          <div className="v-scroll-inner" ref={scrollRef3}>
            <div className="restaurant-list restaurant-list-sm">
              {westernRestaurants.map((restaurant) =>
                renderRestaurantCard(restaurant, westernRestaurants, setWesternRestaurants)
              )}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef3)}>
            {'>'}
          </button>
        </div>
      </div>

      {/* 일식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <div className="section-header-wrap">
          <h2 className="section-header">일식</h2>
          <button className="btn-more" onClick={() => handleMoreClick('일식')}>
            더보기
          </button>
        </div>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef4)}>
            {'<'}
          </button>
          <div className="v-scroll-inner" ref={scrollRef4}>
            <div className="restaurant-list restaurant-list-sm">
              {japaneseRestaurants.map((restaurant) =>
                renderRestaurantCard(restaurant, japaneseRestaurants, setJapaneseRestaurants)
              )}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef4)}>
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularRestaurants;
