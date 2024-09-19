import React, { useState } from 'react';
import './Banner.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 이미지 경로 배열 (public 폴더에 있는 이미지 파일 경로 사용)
  const slides = [
    `${process.env.PUBLIC_URL}/image1.png`,
    `${process.env.PUBLIC_URL}/image2.png`,
    `${process.env.PUBLIC_URL}/image3.png`,
    `${process.env.PUBLIC_URL}/image4.png`
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="banner">
      <button onClick={prevSlide}>Previous</button>
      <div className="slide">
        <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="slide-image" />
      </div>
      <button onClick={nextSlide}>Next</button>
    </div>
  );
};

export default Banner;
