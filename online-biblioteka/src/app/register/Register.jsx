import React, { useState } from 'react';
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
  const API_TOKEN = process.env.REACT_APP_API_TOKEN;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://biblioteka.simonovicp.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json();

    if (responseData.success) {
      // Store the token in local storage
      localStorage.setItem('jwt', responseData.data.token);
      setResponseMessage({ type: 'success', message: responseData.message });
      // Refresh the site
      window.location.reload();
    } else {
      setResponseMessage({ type: 'error', message: responseData.message || 'Failed to create account' });
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
          />
          <input
            type="text"
            name="surname"
            placeholder="Last Name"
            value={formData.surname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="device"
            placeholder="Device"
            value={formData.device}
            onChange={handleChange}
            required
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