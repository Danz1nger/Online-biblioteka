import React, { useEffect, useState } from 'react';
import './Header.css';
import axios from 'axios';

const Header = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const response = await axios.post('https://biblioteka.simonovicp.com/api/users/me', {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json; charset=utf-8',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <svg className="logo-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
                <span className="logo-text">Online Biblioteka</span>
            </div>
            <div className="user-section-header">
                <div className="user-info-header">
                    <svg className="notification-icon" viewBox="0 0 24 24" fill="white">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"></path>
                    </svg>
                    {userData && (
                        <a href="/me">
                            <img 
                                src={userData.photoPath ? userData.photoPath : '/path/to/default-avatar.svg'} 
                                alt="User Avatar" 
                                className="user-avatar" 
                            />
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
