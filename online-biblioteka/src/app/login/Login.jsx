import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          username: username,
          password: password,
          device: device
        })
      });
      const data = await response.json();
      if (data.success) {
        // Store the token in local storage
        localStorage.setItem('jwt', data.data.token);
        setResponseMessage({ type: 'success', message: data.message });
        navigate('/'); // Redirect to the home page
      } else {
        setResponseMessage({ type: 'error', message: data.message || 'Login failed' });
      }
    } catch (error) {
      setResponseMessage({ type: 'error', message: 'An error occurred. Please try again.' });
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
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            name="device"
            id="device"
            placeholder="Enter your device"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
        <div className={styles.links}>
          <a href="/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;