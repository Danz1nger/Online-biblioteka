import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/me');
  };

  return (
    <header className="header">
      <p className="library-header">Online Biblioteka</p>
      <div className="profile" onClick={handleProfileClick}>
        <img src="/ava.png" alt="Profile" />
      </div>
    </header>
  );
};

export default Header;