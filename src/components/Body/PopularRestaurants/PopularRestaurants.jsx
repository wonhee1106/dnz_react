import React, { useRef } from 'react';
import './PopularRestaurants.css';

const PopularRestaurants = () => {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const scrollRef5 = useRef(null);

  const handleMouseDown = (e, scrollRef) => {
    scrollRef.current.isDown = true;
    scrollRef.current.startX = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeftStart = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = (scrollRef) => {
    scrollRef.current.isDown = false;
  };

  const handleMouseUp = (scrollRef) => {
    scrollRef.current.isDown = false;
  };

  const handleMouseMove = (e, scrollRef) => {
    if (!scrollRef.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - scrollRef.current.startX); // 기본 속도 설정
    scrollRef.current.scrollLeft = scrollRef.current.scrollLeftStart - walk;
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

  const restaurants4 = [
    { name: "Restaurant AA", description: "Description AA" },
    { name: "Restaurant BB", description: "Description BB" },
    { name: "Restaurant CC", description: "Description CC" },
    { name: "Restaurant DD", description: "Description DD" },
    { name: "Restaurant EE", description: "Description EE" },
    { name: "Restaurant FF", description: "Description FF" },
  ];

  const restaurants5 = [
    { name: "Restaurant AAA", description: "Description AAA" },
    { name: "Restaurant BBB", description: "Description BBB" },
    { name: "Restaurant CCC", description: "Description CCC" },
    { name: "Restaurant DDD", description: "Description DDD" },
    { name: "Restaurant EEE", description: "Description EEE" },
    { name: "Restaurant FFF", description: "Description FFF" },
  ];

  return (
    <div>
      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">인기식당</h2>
        <div
          className="v-scroll-inner"
          ref={scrollRef1}
          onMouseDown={(e) => handleMouseDown(e, scrollRef1)}
          onMouseLeave={() => handleMouseLeave(scrollRef1)}
          onMouseUp={() => handleMouseUp(scrollRef1)}
          onMouseMove={(e) => handleMouseMove(e, scrollRef1)}
        >
          <div className="restaurant-list restaurant-list-sm">
            {restaurants1.map((restaurant, index) => (
              <div key={index} className="restaurant-list-item restaurant-card">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">한식</h2>
        <div
          className="v-scroll-inner"
          ref={scrollRef2}
          onMouseDown={(e) => handleMouseDown(e, scrollRef2)}
          onMouseLeave={() => handleMouseLeave(scrollRef2)}
          onMouseUp={() => handleMouseUp(scrollRef2)}
          onMouseMove={(e) => handleMouseMove(e, scrollRef2)}
        >
          <div className="restaurant-list restaurant-list-sm">
            {restaurants2.map((restaurant, index) => (
              <div key={index} className="restaurant-list-item restaurant-card">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">중식</h2>
        <div
          className="v-scroll-inner"
          ref={scrollRef3}
          onMouseDown={(e) => handleMouseDown(e, scrollRef3)}
          onMouseLeave={() => handleMouseLeave(scrollRef3)}
          onMouseUp={() => handleMouseUp(scrollRef3)}
          onMouseMove={(e) => handleMouseMove(e, scrollRef3)}
        >
          <div className="restaurant-list restaurant-list-sm">
            {restaurants3.map((restaurant, index) => (
              <div key={index} className="restaurant-list-item restaurant-card">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">양식</h2>
        <div
          className="v-scroll-inner"
          ref={scrollRef4}
          onMouseDown={(e) => handleMouseDown(e, scrollRef4)}
          onMouseLeave={() => handleMouseLeave(scrollRef4)}
          onMouseUp={() => handleMouseUp(scrollRef4)}
          onMouseMove={(e) => handleMouseMove(e, scrollRef4)}
        >
          <div className="restaurant-list restaurant-list-sm">
            {restaurants4.map((restaurant, index) => (
              <div key={index} className="restaurant-list-item restaurant-card">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="popular-restaurants container gutter-sm">
        <h2 className="section-header">일식</h2>
        <div
          className="v-scroll-inner"
          ref={scrollRef5}
          onMouseDown={(e) => handleMouseDown(e, scrollRef5)}
          onMouseLeave={() => handleMouseLeave(scrollRef5)}
          onMouseUp={() => handleMouseUp(scrollRef5)}
          onMouseMove={(e) => handleMouseMove(e, scrollRef5)}
        >
          <div className="restaurant-list restaurant-list-sm">
            {restaurants5.map((restaurant, index) => (
              <div key={index} className="restaurant-list-item restaurant-card">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default PopularRestaurants;
