import React, { useState } from "react";
import "./NationwideSection.css";

// Location data for buttons
const locations = [
  { name: "압구정 청담", img: "https://image.toast.com/aaaaaqx/md/0706apgujeong.jpg" },
  //... (rest of the locations as in your example)
];

const NationwideSection = () => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);

  // Function to handle "Near Me" button click
  const handleNearMeClick = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Fetch restaurants using Naver API
        try {
          const response = await fetch(`/v1/search/local.json?query=맛집&x=${longitude}&y=${latitude}`, {
            headers: {
              "X-NCP-APIGW-API-KEY-ID": "nwaozwnq5k", // Use your Client ID
              "X-NCP-APIGW-API-KEY": "wqes18RU8ntvAIbqWKMI0tdh2nmL6UzXY29jWSK", // Use your Client Secret
            },
          });
          const data = await response.json();
          setNearbyRestaurants(data.items);
        } catch (error) {
          console.error("Error fetching nearby restaurants:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="nationwide-section">
      <h2>어디로 가시나요?</h2>
      <div className="section-body">
        <div className="v-scroll">
          <div className="v-scroll-inner">
            {locations.map((location, index) => (
              <button
                key={index}
                className="location-item"
                style={{ backgroundImage: `url(${location.img})` }}
                aria-label={location.name}
              >
                <span className="label">{location.name}</span>
              </button>
            ))}
            {/* Add the "Near Me" button */}
            <button className="location-item nearme-button" onClick={handleNearMeClick}>
              <span className="label">내 주변</span>
            </button>
          </div>
        </div>
      </div>
      <div className="nearby-restaurants">
        {nearbyRestaurants.length > 0 ? (
          <ul>
            {nearbyRestaurants.map((restaurant, index) => (
              <li key={index}>{restaurant.title} - {restaurant.address}</li>
            ))}
          </ul>
        ) : (
          <p>내 주변에 맛집을 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default NationwideSection;
