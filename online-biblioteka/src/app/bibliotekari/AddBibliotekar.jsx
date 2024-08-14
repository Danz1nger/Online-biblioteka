import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddBibliotekar.css'; // Uvezi CSS fajl

const AddBibliotekar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    jmbg: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    photoPath: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = 'Morate unijeti ime!';
    if (!formData.surname) formErrors.surname = 'Morate unijeti prezime!';
    if (!formData.jmbg) formErrors.jmbg = 'Morate unijeti JMBG!';
    if (!formData.email) formErrors.email = 'Morate unijeti E-mail!';
    if (!formData.username) formErrors.username = 'Morate unijeti korisničko ime!';
    if (!formData.password) formErrors.password = 'Morate unijeti šifru!';
    if (formData.password !== formData.password_confirmation) formErrors.password_confirmation = 'Morate ponoviti unos šifre!';
    if (!formData.photoPath) formErrors.photoPath = 'Morate unijeti putanju do fotografije!';
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post('https://biblioteka.simonovicp.com/api/users/store', {
        ...formData,
        role_id: 1, //role_id za bibliotekare je 1
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          navigate('/bibliotekari'); // Navigacija ka listi bibliotekara
        }, 2000);
      }
    } catch (error) {
      setApiError('Došlo je do greške prilikom slanja podataka. Molimo pokušajte ponovo.');
      console.error(error);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      surname: '',
      jmbg: '',
      email: '',
      username: '',
      password: '',
      password_confirmation: '',
      photoPath: '',
    });
    setErrors({});
    setApiError('');
    setSuccessMessage('');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPasswordConfirmation = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const defaultImageUrl = "https://biblioteka.simonovicp.com/img/profile.jpg";

  return (
    <div>
      <h1 style={{ textAlign: 'left' }}>Novi Bibliotekar</h1>
      <div>
        <img 
          src={formData.photoPath || defaultImageUrl} 
          alt="Profile" 
          className="profile-image" 
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div>
            <input
              type="text"
              name="photoPath"
              placeholder="Unesite putanju do fotografije.."
              value={formData.photoPath}
              onChange={handleChange}
              className="input-field-novi"
            />
            {errors.photoPath && <div className="error">{errors.photoPath}</div>}
          </div>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Unesite Ime.."
              value={formData.name}
              onChange={handleChange}
              className="input-field-novi"
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          <div>
            <input
              type="text"
              name="surname"
              placeholder="Unesite Prezime.."
              value={formData.surname}
              onChange={handleChange}
              className="input-field-novi"
            />
            {errors.surname && <div className="error">{errors.surname}</div>}
          </div>
          <div>
            <input
              type="text"
              name="jmbg"
              placeholder="Unesite JMBG.."
              value={formData.jmbg}
              onChange={handleChange}
              className="input-field-novi"
            />
            {errors.jmbg && <div className="error">{errors.jmbg}</div>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Unesite E-mail.."
              value={formData.email}
              onChange={handleChange}
              className="input-field-novi"
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Unesite korisničko ime.."
              value={formData.username}
              onChange={handleChange}
              className="input-field-novi"
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Unesite željenu šifru.."
              value={formData.password}
              onChange={handleChange}
              className="password-field-novi"
            />
            <span onClick={toggleShowPassword} className="eye-icon">
              {showPassword ? "👁️" : "🙈"}
            </span>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <div className="password-container">
            <input
              type={showPasswordConfirmation ? "text" : "password"}
              name="password_confirmation"
              placeholder="Ponovo unesite šifru.."
              value={formData.password_confirmation}
              onChange={handleChange}
              className="password-field-novi"
            />
            <span onClick={toggleShowPasswordConfirmation} className="eye-icon">
              {showPasswordConfirmation ? "👁️" : "🙈"}
            </span>
            {errors.password_confirmation && <div className="error">{errors.password_confirmation}</div>}
          </div>
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">Sačuvaj</button>
          <button type="button" className="reset-button" onClick={handleReset}>Poništi</button>
        </div>
      </form>
      {apiError && <div className="error">{apiError}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
  );
};

export default AddBibliotekar;
