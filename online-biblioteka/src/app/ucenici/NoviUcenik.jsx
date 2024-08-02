import React, { useState } from 'react';
import axios from 'axios';

const NoviUcenik = () => {
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
        role_id: 2,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log(response.data);
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
      <h1 style={{ textAlign: 'left' }}>Novi Ucenik</h1>
      <div>
        <img 
          src={formData.photoPath || defaultImageUrl} 
          alt="Profile" 
          style={{ width: '150px', height: '150px' }} 
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
      <style jsx>{`
        .input-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 50%;
        }
        .input-field-novi {
          width: calc(380% - 20px); /* Adjust the width of the input fields here */
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }
        .password-field-novi {
          width: calc(79% - 20px); /* Adjust the width of the password fields here */
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }
        .input-field-novi::placeholder,
        .password-field::placeholder {
          color: rgba(0, 0, 0, 0.5); /* Semi-transparent */
        }
        .password-container {
          position: relative;
          width: 100%;
        }
        .eye-icon {
          position: absolute;
        
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          left: 570px;
          top: 50%;
        
        
        }
        .button-group {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          margin-top: 20px;
          margin-left: 0; /* Reset button group margin */
        }
        .submit-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        .submit-button:hover {
          background-color: #0056b3;
        }
        .reset-button {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        .reset-button:hover {
          background-color: #5a6268;
        }
        .error {
          color: red;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default NoviUcenik;