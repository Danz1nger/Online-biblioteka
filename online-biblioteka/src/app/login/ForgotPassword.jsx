import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState({ type: '', message: '' });

  const API_URL = 'https://biblioteka.simonovicp.com/api/forgot_password';
  const API_KEY = 'b3Rvcmlub2xhcmluZ29sb2dpamE=';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, 
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      setResponseMessage({ type: 'success', message: response.data.message });
    } catch (error) {
      setResponseMessage({ type: 'error', message: error.response?.data?.message || 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <h1>Forgot Password</h1>
        {responseMessage.message && (
          <div className={`${styles.message} ${styles[responseMessage.type]}`}>
            {responseMessage.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        <div className={styles.links}>
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ForgotPassword);