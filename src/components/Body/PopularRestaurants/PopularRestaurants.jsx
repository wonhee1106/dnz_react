import React, { useRef } from 'react';
import './PopularRestaurants.css';

const PopularRestaurants = () => {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

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

  const restaurants1 = [
    { name: "보자기", description: "한식 • 담양", score: "4.6", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sfCloqq0AADMEb-nDF0CeDg/m/cd67b0c70b1840bcb0d4fdf5c8e28942?small400" },
    { name: "하이디라오 영등포점", description: "중식 • 영등포", score: "4.7", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/suvCy7x_-YLvNDnFlM2l8DA/e9b5ce94d3104f1abad59b40bd04e57f?small400" },
    { name: "명륜진사갈비 오산원동점", description: "육류,고기요리 • 오산", score: "4.6", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/shGD4ouK4GcsbS09XngFv0w/m/1516407c61544a3fb6bbe709e81b9a0b?small400" },
    { name: "류센소 본점", description: "일식 • 부산 해운대", score: "4.8", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sO8NcB0cIHazped-jtVkQ0g/59a0ff89500f42c6a730ff0ca372ba0e?small400" },
    { name: "오이지 연남", description: "한식 • 연남", score: "4.5", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sQPBdjjRAZsW7iXlpkTE_Cg/m/f9efbe91fb8447d782b09ad3d83e98ee?small400" },
  ];

  const restaurants2 = [
    { name: "사모님짬뽕", description: "중식 • 방화", score: "4.4", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sHvXPu_dh3WI-HfEXWAiy8g/m/2af69cd75dde4c1d83323c29dd1fe520?small400" },
    { name: "해물꾼조태산 양평본점", description: "국수,냉면 • 양평", score: "4.4", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sJ_iYIb6EUAwqIVI7Qlvogw/73cacec16595424dacf3e8c80dfd4969?small400" },
    { name: "환장라멘", description: "일식 • 울산", score: "4.8", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/s_JXhisYUplrQvc6Lhpr9hw/m/feb49448f3384842867d470dcc634a75?small400" },
    { name: "부강옥 세종부강본점", description: "한식 • 세종", score: "4.5", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/s0Io_hg-Vyu6tOWh7-jA-YQ/f8e83dfdf47d4d79be7c3ae074ce0a45?small400" },
    { name: "블루보틀 여의도 카페", description: "카페,디저트 • 여의도", score: "3.8", img: "https://ugc-images.catchtable.co.kr/catchtable/shopinfo/sbfs2MxW9a1IyF00CXSe83A/m/2e5702273d074485a09ece2652b24c51?small400" },
  ];

  return (
    <div>
      {/* 인기식당 섹션 */}
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">인기식당</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef1)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef1}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants1.map((restaurant, index) => (
                <div key={index} className="restaurant-list-item restaurant-card">
                  <a className="tb">
                    <div className="img" style={{ backgroundImage: `url(${restaurant.img})` }}></div>
                  </a>
                  <div className="detail">
                    <a className="btn-bookmark">북마크</a>
                    <a>
                      <h3 className="name">{restaurant.name}</h3>
                      <div className="meta">
                        <span className="score">{restaurant.score}</span>
                        <span className="tags">{restaurant.description}</span>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
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
              {restaurants2.map((restaurant, index) => (
                <div key={index} className="restaurant-list-item restaurant-card">
                  <a className="tb">
                    <div className="img" style={{ backgroundImage: `url(${restaurant.img})` }}></div>
                  </a>
                  <div className="detail">
                    <a className="btn-bookmark">북마크</a>
                    <a>
                      <h3 className="name">{restaurant.name}</h3>
                      <div className="meta">
                        <span className="score">{restaurant.score}</span>
                        <span className="tags">{restaurant.description}</span>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef2)}>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default PopularRestaurants;
