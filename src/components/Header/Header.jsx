import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 컴포넌트
import { faBell } from '@fortawesome/free-regular-svg-icons'; // faBell 아이콘 임포트
import { faBookmark } from '@fortawesome/free-regular-svg-icons'; // faBookmark 아이콘 임포트

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // 로고 클릭 시 메인 페이지로 이동
  }

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 버튼 클릭 시 로그인 페이지로 이동
  }

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
        <FontAwesomeIcon icon={faBell} className="faBell" />
      </div>
      <div className="header-section login-buttons">
        <button onClick={handleLoginClick}>로그인</button>
      </div>
    </header>
  );
}

export default Header;
