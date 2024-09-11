import React from 'react';
import Banner from './Banner/Banner';
import NationwideSection from './NationwideSection/NationwideSection';
import PopularRestaurants from './PopularRestaurants/PopularRestaurants';

import './Body.css';


const Body = () => {
  return (
    <div className="body">
      <Banner />
      <div className="sections">
        <NationwideSection />
        <PopularRestaurants />
      </div>
    </div>
  );
}

export default Body;
