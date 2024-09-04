import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); 
  }

  return (
    <header className="header">
      <div className="logo">9900</div>
      <input type="text" placeholder="검색" />
      <div className="login-buttons">
        <button onClick={handleLoginClick}>Login</button>
      </div>
    </header>
  );
}

export default Header;
