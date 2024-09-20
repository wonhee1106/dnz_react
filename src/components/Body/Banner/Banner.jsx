import React from 'react';
import 'swiper/css';  // 기본 스타일 가져오기
import 'swiper/css/navigation';  // 네비게이션 스타일
import 'swiper/css/pagination';  // 페이지네이션 스타일
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';  // 모듈 가져오기
import './Banner.css';

const Banner = () => {
  // 이미지 경로 배열 (src/img 폴더에 있는 이미지 파일 경로 사용)
  const slides = [
    require('../../../img/image1.png'),
    require('../../../img/image2.png'),
    require('../../../img/image3.png'),
    require('../../../img/image4.png'),
    require('../../../img/image5.png'),
    require('../../../img/image6.png'),
    require('../../../img/image7.png')
  ];

  return (
    <div className="banner">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}  // Autoplay, Navigation, Pagination 모듈 사용
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,  // 3초마다 이미지 전환
          disableOnInteraction: false,  // 상호작용 후에도 자동 전환 유지
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide">
              <img src={slide} alt={`Slide ${index + 1}`} className="slide-image" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
