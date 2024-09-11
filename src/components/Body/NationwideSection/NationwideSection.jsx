import React from "react";
import { useNavigate } from "react-router-dom";
import "./NationwideSection.css";

// Location data for buttons
const locations = [
  { name: "압구정 청담", img: "https://image.toast.com/aaaaaqx/md/0706apgujeong.jpg" },
  //... (rest of the locations as in your example)
];

const NationwideSection = () => {
  const navigate = useNavigate();

  // Function to handle "Near Me" button click and navigate to maps
  const handleNearMeClick = () => {
    navigate('/maps'); // Navigate to the MyMaps page
  };

  return (
    <div className="nationwide-section">
      <h2>어디로 가시나요?</h2>
      <div className="section-body">
        <div className="v-scroll">
        
        
        </div>
      </div>
    </div>
  );
};

export default NationwideSection;
