import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import './Bibliotekari.css';

// Styled components
const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '600px',
  margin: '20px auto',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
});

// EditBibliotekar Component
const BibliotekarEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editedBibliotekar, setEditedBibliotekar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBibliotekarData = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get(`https://biblioteka.simonovicp.com/api/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setEditedBibliotekar(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBibliotekarData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBibliotekar(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.put(`https://biblioteka.simonovicp.com/api/users/${id}`, editedBibliotekar, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Update response:', response.data);
      navigate('/bibliotekari');
    } catch (err) {
      console.error('Update error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  if (loading) return (
    <div className="bibliotekari-container">
      <div className="spinner-container">
        <CircularProgress />
      </div>
    </div>
  );

  if (error) return (
    <div className="bibliotekari-container">
      <Typography color="error">Error: {error}</Typography>
    </div>
  );

  return (
    <div className="bibliotekari-container">
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          name="photoPath"
          label="Photo URL"
          value={editedBibliotekar?.photoPath || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="name"
          label="Name"
          value={editedBibliotekar?.name || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="surname"
          label="Surname"
          value={editedBibliotekar?.surname || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="email"
          label="Email"
          value={editedBibliotekar?.email || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="username"
          label="Username"
          value={editedBibliotekar?.username || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="jmbg"
          label="JMBG"
          value={editedBibliotekar?.jmbg || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="password"
          label="New Password"
          type="password"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="password_confirmation"
          label="Confirm New Password"
          type="password"
          onChange={handleChange}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button variant="outlined" onClick={() => navigate('/bibliotekari')}>
          Cancel
        </Button>
      </StyledForm>
    </div>
  );
};

export default BibliotekarEdit;
