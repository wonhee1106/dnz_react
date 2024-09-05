import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 컴포넌트
import { faBell } from '@fortawesome/free-regular-svg-icons'; // faBell 아이콘 임포트
import { faBookmark } from '@fortawesome/free-regular-svg-icons'; // faBookmark 아이콘 임포트

const Header = () => {
  const navigate = useNavigate();

  // Navigate to the home page
  const handleLogoClick = () => {
    navigate('/'); 
  };

  // Navigate to the login page
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Navigate to the alarm page when the bell icon is clicked
  const handleAlarmClick = () => {
    navigate('/alarm'); 
  };

  return (
    <header className="header">
      <div 
        className="header-section logo" 
        onClick={handleLogoClick} 
        role="button" 
        tabIndex="0" 
        onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
      >
        9900
      </div>
      <div className="header-section search-container">
        <input className="search" type="text" placeholder="검색" />
      </div>
      <div className="header-section icon">
        <FontAwesomeIcon icon={faBookmark} className="faBookmark" />
        <FontAwesomeIcon 
          icon={faBell} 
          className="faBell" 
          onClick={handleAlarmClick} // Add onClick handler for the alarm icon
          role="button" 
          tabIndex="0"
          onKeyPress={(e) => e.key === 'Enter' && handleAlarmClick()}
        />
      </div>
      <div className="header-section login-buttons">
        <button onClick={handleLoginClick}>로그인</button>
      </div>
    </header>
  );
}

export default Header;
