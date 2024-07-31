import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Me.css';

const Me = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    axios.post('https://biblioteka.simonovicp.com/api/users/me', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setUser(response.data.data);
    })
    .catch(error => {
      console.error("There was an error fetching the user data!", error);
    });
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem('jwt');
    axios.post('https://biblioteka.simonovicp.com/api/logout', { all: true }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.success) {
        localStorage.removeItem('jwt');
        navigate('/login');
        window.location.reload(); // Refresh the page after logout
      }
    })
    .catch(error => {
      console.error("There was an error logging out!", error);
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h1>Me</h1>
      <div className="user-info">
        <img src={user.photoPath} alt="Profile" />
        <p>Username: {user.username}</p>
        <p>Name: {user.name}</p>
        <p>Surname: {user.surname}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Me;