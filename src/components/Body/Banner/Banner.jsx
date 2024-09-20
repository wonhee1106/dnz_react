// Banner.jsx

import React, { useState, useEffect } from 'react';
import './Banner.module.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 이미지 경로 배열 (src/img 폴더에 있는 이미지 파일 경로 사용)
  const slides = [
    require('../../../img/image1.png'),
    require('../../../img/image2.png'),
    require('../../../img/image3.png'),
    require('../../../img/image4.png')
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // 3초마다 이미지 전환

    return () => {
      clearInterval(slideInterval);
    };
  }, [slides.length]);

  return (
    <div className="banner">
      <div className="slide">
        <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="slide-image" />
      </div>
    </div>
  );
};

export default Banner;
