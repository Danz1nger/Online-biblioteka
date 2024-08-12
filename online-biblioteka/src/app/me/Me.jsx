import Spinner from '../components/Spinner';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Me.css';

const Me = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
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
      setEditedUser(response.data.data);
    })
    .catch(error => {
      console.error("There was an error fetching the user data!", error);
    });
  };

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
        window.location.reload();
      }
    })
    .catch(error => {
      console.error("There was an error logging out!", error);
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const token = localStorage.getItem('jwt');
    axios.put('https://biblioteka.simonovicp.com/api/users/me', editedUser, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setUser(response.data.data);
      setIsEditing(false);
    })
    .catch(error => {
      console.error("There was an error updating the user data!", error);
    });
  };

  if (!user) {
    return <div><Spinner /></div>;
  }

  return (
    <div className="user-profile">
      <h1>My Profile</h1>
      <div className="user-info">
        <img src={user.photoPath} alt="Profile" />
        {isEditing ? (
          <>
            <input name="name" value={editedUser.name} onChange={handleInputChange} />
            <input name="surname" value={editedUser.surname} onChange={handleInputChange} />
            <input name="email" value={editedUser.email} onChange={handleInputChange} />
            <input name="username" value={editedUser.username} onChange={handleInputChange} />
            <input name="jmbg" value={editedUser.jmbg} onChange={handleInputChange} />
            <input type="password" name="password" placeholder="New Password" onChange={handleInputChange} />
            <input type="password" name="password_confirmation" placeholder="Confirm New Password" onChange={handleInputChange} />
            <input name="photoPath" value={editedUser.photoPath} onChange={handleInputChange} />
            <div className="button-group">
              <button className="save-button" onClick={handleSave}>Save</button>
              <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p>Username: {user.username}</p>
            <p>Name: {user.name}</p>
            <p>Surname: {user.surname}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>JMBG: {user.jmbg}</p>
            <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
            <div className="separator"></div>
            <div className="record-buttons">
              <Link to="/me/izdavanje" className="record-button izdavanja">
                Evidencija izdavanja
              </Link>
              <Link to="/me/rezervacija" className="record-button rezervacija">
                Evidencija rezervacija
              </Link>
            </div>
          </>
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default React.memo(Me);