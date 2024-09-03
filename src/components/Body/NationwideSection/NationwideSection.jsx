import React from 'react';
import './NationwideSection.css';

const NationwideSection = () => {
  return (
    <div className="nationwide-section">
      <h2>전국</h2>
      <div className="local-list">내주변 지역 항목</div>
      {/* 여기서 각 항목을 지도에 나타낼 수 있음 */}
    </div>
  );
}

export default NationwideSection;
