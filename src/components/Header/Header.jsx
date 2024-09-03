import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Logo</div>
      <input type="text" placeholder="검색" />
      <div className="login-buttons">
        <button>Login</button>
      </div>
    </header>
  );
}

export default Header;
