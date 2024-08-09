import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewAuthor.css'; // Uvezi CSS fajl

const NewAuthor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    bio: '',
    photoPath: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = 'Morate unijeti ime!';
    if (!formData.surname) formErrors.surname = 'Morate unijeti prezime!';
    if (!formData.bio) formErrors.bio = 'Morate unijeti biografiju!';
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
      const response = await axios.post('https://biblioteka.simonovicp.com/api/authors/store', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          navigate('/authors'); // Navigacija ka listi autora
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
      bio: '',
      photoPath: '',
    });
    setErrors({});
    setApiError('');
    setSuccessMessage('');
  };

  const defaultImageUrl = "https://biblioteka.simonovicp.com/img/profile.jpg";

  return (
    <div>
      <h1 style={{ textAlign: 'left' }}>Novi Autor</h1>
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
            <textarea
              name="bio"
              placeholder="Unesite biografiju autora.."
              value={formData.bio}
              onChange={handleChange}
              className="input-field-novi"
            />
            {errors.bio && <div className="error">{errors.bio}</div>}
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

export default NewAuthor;
