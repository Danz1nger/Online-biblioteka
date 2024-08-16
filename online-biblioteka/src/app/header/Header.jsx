import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; 
import './Header.css';
import axios from 'axios';

const Header = ({ onHeaderVisibilityChange }) => {
    const [userData, setUserData] = useState(null);
    const [hidden, setHidden] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setHidden(false);  // Show header when at the top of the page
                onHeaderVisibilityChange(false); // Notify parent
            } else if (window.scrollY > 10) {
                setHidden(true);   // Hide header when scrolling down past 10px
                onHeaderVisibilityChange(true); // Notify parent
                setShowNotifications(false);  // Close notifications dropdown when header is hidden
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [onHeaderVisibilityChange]);

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

    useEffect(() => {
        const checkNotifications = () => {
            const newNotifications = [];
            if (localStorage.getItem('newStudents') === 'true') {
                newNotifications.push('There are new students!');
            }
            if (localStorage.getItem('newBooks') === 'true') {
                newNotifications.push('There are new books!');
            }
            setNotifications(newNotifications);
        };

        checkNotifications();
        
        // Set up an interval to check for notifications every 5 seconds
        const intervalId = setInterval(checkNotifications, 5000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const clearNotifications = () => {
        setNotifications([]);
        localStorage.removeItem('newStudents');
        localStorage.removeItem('newBooks');
    };

    return (
        <header className="header" style={{ top: hidden ? '-60px' : '0px' }}>
            <div className="logo">
                <svg className="logo-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
                <span className="logo-text">Online Biblioteka</span>
            </div>
            <div className="user-section-header">
                <div className="user-info-header">
                    <div className="notification-container" style={{ marginRight: '15px' }}>
                        <svg className="notification-icon" viewBox="0 0 24 24" fill="white" onClick={toggleNotifications}>
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"></path>
                        </svg>
                        {showNotifications && !hidden && (
                            <div className="notification-dropdown">
                                <div className="notification-header">
                                    <span style={{ color: 'black' }}>Notifications</span>
                                    <button onClick={clearNotifications} className="clear-notifications">X</button>
                                </div>
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <div key={index} className="notification-item" style={{ color: notification.includes('new') ? 'blue' : 'black' }}>
                                            {notification}
                                        </div>
                                    ))
                                ) : (
                                    <div className="notification-item" style={{ color: 'black' }}>No new notifications</div>
                                )}
                            </div>
                        )}
                    </div>
                    {userData && (
                        <NavLink to="/me">
                            <img 
                                src={userData.photoPath ? userData.photoPath : '/path/to/default-avatar.svg'} 
                                alt="User Avatar" 
                                className="user-avatar" 
                            />
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);
