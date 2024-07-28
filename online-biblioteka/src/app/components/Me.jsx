
// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Me.css';

const Me = () => {
  const [user, setUser] = useState(null);

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
    </div>
  );
};

export default Me;