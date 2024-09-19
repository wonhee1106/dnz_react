import React from "react";
import { useNavigate } from "react-router-dom";
import "./NationwideSection.css";






const NationwideSection = () => {
  const navigate = useNavigate();

  // "내 주변" 버튼 클릭 시 maps 페이지로 이동하는 함수
  const handleNearMeClick = () => {
    navigate('/maps'); // MyMaps 페이지로 이동
  };

  return (
    <div className="nationwide-section">
      <h2>전국 맛집</h2>
      <div className="section-body">
        <div className="v-scroll">
          <button className="nearme-button" onClick={handleNearMeClick}>
            <div className="label">맛 집</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NationwideSection;
