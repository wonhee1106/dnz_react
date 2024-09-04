import React, { useRef } from 'react';
import './PopularRestaurants.css';

const PopularRestaurants = () => {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const scrollRef5 = useRef(null);

  // 좌우로 스크롤하는 함수
  const scrollLeft = (scrollRef) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' }); // 스크롤 속도 조정
    }
  };

  const scrollRight = (scrollRef) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // 스크롤 속도 조정
    }
  };

  const handleCardClick = (url) => {
    window.location.href = url; // 클릭 시 페이지 이동
  };

  const restaurants1 = [
    { name: "보자기", description: "한식 • 담양", score: "4.6", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sfCloqq0AADMEb-nDF0CeDg/m/cd67b0c70b1840bcb0d4fdf5c8e28942?small400", url: "https://example.com/bojagi" },
    { name: "하이디라오 영등포점", description: "중식 • 영등포", score: "4.7", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/suvCy7x_-YLvNDnFlM2l8DA/e9b5ce94d3104f1abad59b40bd04e57f?small400", url: "https://example.com/haidilao" },
    { name: "명륜진사갈비 오산원동점", description: "육류,고기요리 • 오산", score: "4.6", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/shGD4ouK4GcsbS09XngFv0w/m/1516407c61544a3fb6bbe709e81b9a0b?small400", url: "https://example.com/myeongnyun" },
    { name: "류센소 본점", description: "일식 • 부산 해운대", score: "4.8", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sO8NcB0cIHazped-jtVkQ0g/59a0ff89500f42c6a730ff0ca372ba0e?small400", url: "https://example.com/ryusenso" },
    { name: "오이지 연남", description: "한식 • 연남", score: "4.5", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sQPBdjjRAZsW7iXlpkTE_Cg/m/f9efbe91fb8447d782b09ad3d83e98ee?small400", url: "https://example.com/oyjyeon" },
  ];

  const restaurants2 = [
    { name: "사모님짬뽕", description: "중식 • 방화", score: "4.4", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sHvXPu_dh3WI-HfEXWAiy8g/m/2af69cd75dde4c1d83323c29dd1fe520?small400", url: "https://example.com/samonnim" },
    { name: "해물꾼조태산 양평본점", description: "국수,냉면 • 양평", score: "4.4", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sJ_iYIb6EUAwqIVI7Qlvogw/73cacec16595424dacf3e8c80dfd4969?small400", url: "https://example.com/haemul" },
    { name: "환장라멘", description: "일식 • 울산", score: "4.8", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/s_JXhisYUplrQvc6Lhpr9hw/m/feb49448f3384842867d470dcc634a75?small400", url: "https://example.com/ramen" },
    { name: "부강옥 세종부강본점", description: "한식 • 세종", score: "4.5", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/s0Io_hg-Vyu6tOWh7-jA-YQ/f8e83dfdf47d4d79be7c3ae074ce0a45?small400", url: "https://example.com/bukang" },
    { name: "블루보틀 여의도 카페", description: "카페,디저트 • 여의도", score: "3.8", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sbfs2MxW9a1IyF00CXSe83A/m/2e5702273d074485a09ece2652b24c51?small400", url: "https://example.com/bluebottle" },
  ];

  const restaurants3 = [
    { name: "차이홍", description: "중식 • 강남", score: "4.6", img: "https://example.com/image1.jpg", url: "https://example.com/chaihong" },
    { name: "딘타이펑", description: "중식 • 명동", score: "4.7", img: "https://example.com/image2.jpg", url: "https://example.com/dintaifung" },
    { name: "자금성", description: "중식 • 종로", score: "4.8", img: "https://example.com/image3.jpg", url: "https://example.com/jageumseong" },
  ];

  const restaurants4 = [
    { name: "파스타리움", description: "양식 • 이태원", score: "4.5", img: "https://example.com/image4.jpg", url: "https://example.com/pastarrium" },
    { name: "라브레드", description: "양식 • 홍대", score: "4.7", img: "https://example.com/image5.jpg", url: "https://example.com/labread" },
    { name: "더블랙", description: "양식 • 강남", score: "4.8", img: "https://example.com/image6.jpg", url: "https://example.com/theblack" },
    { name: "BBQ", description: "양식 • 노량진", score: "4.7", img: "https://example.com/image5.jpg", url: "https://example.com/labread" },
    { name: "식당1", description: "양식 • 신길", score: "4.8", img: "https://example.com/image6.jpg", url: "https://example.com/theblack" }
  ];

  const restaurants5 = [
    { name: "스시야", description: "일식 • 강남", score: "4.9", img: "https://example.com/image7.jpg", url: "https://example.com/sushiya" },
    { name: "모로미", description: "일식 • 신사", score: "4.8", img: "https://example.com/image8.jpg", url: "https://example.com/moromi" },
    { name: "사이카", description: "일식 • 홍대", score: "4.7", img: "https://example.com/image9.jpg", url: "https://example.com/saika" },
    { name: "타코야끼", description: "일식 • 남대문", score: "4.8", img: "https://example.com/image8.jpg", url: "https://example.com/moromi" },
    { name: "초빕", description: "일식 • 동대문", score: "4.7", img: "https://example.com/image9.jpg", url: "https://example.com/saika" }
  ];

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
        <div className="img" style={{ backgroundImage: `url(${restaurant.img})` }}></div>
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
      {/* 인기식당 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">인기식당</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef1)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef1}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants1.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef1)}>{">"}</button>
        </div>
      </div>

      {/* 한식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">한식</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef2)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef2}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants2.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef2)}>{">"}</button>
        </div>
      </div>

      {/* 중식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">중식</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef3)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef3}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants3.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef3)}>{">"}</button>
        </div>
      </div>

      {/* 양식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">양식</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef4)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef4}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants4.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef4)}>{">"}</button>
        </div>
      </div>

      {/* 일식 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">일식</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef5)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef5}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants5.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef5)}>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default PopularRestaurants;
