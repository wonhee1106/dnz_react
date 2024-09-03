import React from 'react';
import './PopularRestaurants.css';

const PopularRestaurants = () => {
  const restaurants = [
    { name: "Restaurant 1", description: "Description 1" },
    { name: "Restaurant 2", description: "Description 2" },
    { name: "Restaurant 3", description: "Description 3" },
    // 더 많은 레스토랑을 여기에 추가
  ];

  return (
    <div className="popular-restaurants">
      <h2>인기 식당</h2>
      <div className="restaurant-cards">
        {restaurants.map((restaurant, index) => (
          <div key={index} className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularRestaurants;
