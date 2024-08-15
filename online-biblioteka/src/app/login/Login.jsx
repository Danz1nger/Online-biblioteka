import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [device, setDevice] = useState('');
  const [responseMessage, setResponseMessage] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const API_URL = 'https://biblioteka.simonovicp.com/api/login';
  const API_KEY = 'b3Rvcmlub2xhcmluZ29sb2dpamE=';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, {
        username,
        password,
        device
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      const { data } = response;
      if (data.success) {
        localStorage.setItem('jwt', data.data.token);
        setResponseMessage({ type: 'success', message: data.message });
        navigate('/');
      } else {
        setResponseMessage({ type: 'error', message: data.message || 'Login failed' });
      }
    } catch (error) {
      setResponseMessage({ type: 'error', message: error.response?.data?.message || 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <h1>Log In</h1>
        {responseMessage.message && (
          <div className={`${styles.message} ${styles[responseMessage.type]}`}>
            {responseMessage.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
          <input
            type="text"
            name="device"
            id="device"
            placeholder="Enter your device"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            required
            aria-label="Device"
          />
          <button type="submit">Log In</button>
        </form>
        <div className={styles.links}>
          <Link to="/register">Create account</Link>
          <Link to="/forgotpassword">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);