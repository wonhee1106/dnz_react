import React, { useRef } from 'react';
import './PopularRestaurants.css';

const PopularRestaurants = () => {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);

  const scrollLeft = (scrollRef) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (scrollRef) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const restaurants1 = [
    { name: "Restaurant 1", description: "Description 1" },
    { name: "Restaurant 2", description: "Description 2" },
    { name: "Restaurant 3", description: "Description 3" },
    { name: "Restaurant 4", description: "Description 4" },
    { name: "Restaurant 5", description: "Description 5" },
    { name: "Restaurant 6", description: "Description 6" },
  ];

  const restaurants2 = [
    { name: "Restaurant A", description: "Description A" },
    { name: "Restaurant B", description: "Description B" },
    { name: "Restaurant C", description: "Description C" },
    { name: "Restaurant D", description: "Description D" },
    { name: "Restaurant E", description: "Description E" },
    { name: "Restaurant F", description: "Description F" },
  ];

  const restaurants3 = [
    { name: "Restaurant X", description: "Description X" },
    { name: "Restaurant Y", description: "Description Y" },
    { name: "Restaurant Z", description: "Description Z" },
    { name: "Restaurant W", description: "Description W" },
    { name: "Restaurant V", description: "Description V" },
    { name: "Restaurant U", description: "Description U" },
  ];

  return (
    <div>
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">인기 식당 - 섹션 1</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef1)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef1}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants1.map((restaurant, index) => (
                <div key={index} className="restaurant-list-item restaurant-card">
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.description}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef1)}>{">"}</button>
        </div>
      </div>

      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">인기 식당 - 섹션 2</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef2)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef2}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants2.map((restaurant, index) => (
                <div key={index} className="restaurant-list-item restaurant-card">
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.description}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef2)}>{">"}</button>
        </div>
      </div>

      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">인기 식당 - 섹션 3</h2>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef3)}>{"<"}</button>
          <div className="v-scroll-inner" ref={scrollRef3}>
            <div className="restaurant-list restaurant-list-sm">
              {restaurants3.map((restaurant, index) => (
                <div key={index} className="restaurant-list-item restaurant-card">
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.description}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef3)}>{">"}</button>
        </div>
      </div>
    </div>
  );
}

export default PopularRestaurants;
