import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

const Header = () => {
  const navigate = useNavigate();
  const { isAuth, logout } = useAuthStore(); // Zustand에서 인증 상태와 로그아웃 함수 가져오기

  const handleLogoClick = () => {
    navigate('/'); 
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAlarmClick = () => {
    navigate('/alarm'); 
  };

  const handleLogout = () => {
    logout(); // Zustand에서 로그아웃 처리
    sessionStorage.removeItem('token'); // 토큰 제거
    navigate('/login'); // 로그인 페이지로 리디렉션
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
          onClick={handleAlarmClick}
          role="button" 
          tabIndex="0"
          onKeyPress={(e) => e.key === 'Enter' && handleAlarmClick()}
        />
      </div>
      <div className="header-section login-buttons">
        {isAuth ? (
          <button onClick={handleLogout}>로그아웃</button>
        ) : (
          <button onClick={handleLoginClick}>로그인</button>
        )}
      </div>
    </header>
  );
}

export default Header;
