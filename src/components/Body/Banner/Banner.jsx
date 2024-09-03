import React, { useState } from 'react';
import './Banner.css';
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["Slide 1", "Slide 2", "Slide 3"];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="banner">
      <button onClick={prevSlide}>Previous</button>
      <div className="slide">{slides[currentSlide]}</div>
      <button onClick={nextSlide}>Next</button>
    </div>
  );
}

export default Banner;
