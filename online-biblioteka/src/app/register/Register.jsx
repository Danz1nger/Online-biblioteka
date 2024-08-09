import React, { useState } from 'react';
import axios from 'axios';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    device: '',
  });

  const [responseMessage, setResponseMessage] = useState({ type: '', message: '' });
  const API_KEY = 'b3Rvcmlub2xhcmluZ29sb2dpamE=';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://biblioteka.simonovicp.com/api/register', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      const responseData = response.data;

      if (responseData.success) {
        // Store the token in local storage
        localStorage.setItem('jwt', responseData.data.token);
        setResponseMessage({ type: 'success', message: responseData.message });
        // Refresh the site
        window.location.reload();
      } else {
        setResponseMessage({ type: 'error', message: responseData.message || 'Failed to create account' });
      }
    } catch (error) {
      setResponseMessage({ type: 'error', message: error.response?.data?.message || 'An error occurred while creating the account' });
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.register}>
        <h1>Register</h1>
        <p>Create your account for Online Biblioteka</p>
        {responseMessage.message && (
          <p className={`${styles.responseMessage} ${styles[responseMessage.type]}`}>
            {responseMessage.message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="First Name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="given-name"
          />
          <input
            type="text"
            name="surname"
            placeholder="Last Name"
            value={formData.surname}
            onChange={handleChange}
            required
            autoComplete="family-name"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <input
            type="text"
            name="device"
            placeholder="Device"
            value={formData.device}
            onChange={handleChange}
            required
            autoComplete="device-name"
          />
          <button type="submit">Register</button>
        </form>
        <div className={styles.loginLink}>
          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;