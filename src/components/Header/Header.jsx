import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 컴포넌트
import { faBell } from '@fortawesome/free-regular-svg-icons'; // faBell 아이콘 임포트
import { faBookmark } from '@fortawesome/free-regular-svg-icons'; // faBookmark 아이콘 임포트

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); 
  }

  return (
    <header className="header">
      <div className="header-section logo">9900</div>
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
