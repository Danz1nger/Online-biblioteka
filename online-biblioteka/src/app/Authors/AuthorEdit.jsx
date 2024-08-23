import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import './AuthorEdit.css';  // Prilagodite ili kreirajte novi CSS fajl za stilizovanje

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

const AuthorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [editedAuthor, setEditedAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get(`https://biblioteka.simonovicp.com/api/authors/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setAuthor(response.data.data);
        setEditedAuthor(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAuthor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.put(`https://biblioteka.simonovicp.com/api/authors/${id}`, editedAuthor, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Update response:', response.data);
      navigate('/authors'); // Preusmeri korisnika na stranicu sa listom autora
    } catch (err) {
      console.error('Update error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  if (loading) return (
    <div className="author-container">
      <div className="spinner-container">
        <CircularProgress />
      </div>
    </div>
  );

  if (error) return (
    <div className="author-container">
      <Typography color="error">Error: {error}</Typography>
    </div>
  );

  return (
    <div className="author-container">
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={editedAuthor?.name || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="surname"
          label="Surname"
          value={editedAuthor?.surname || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="biography"
          label="Biography"
          value={editedAuthor?.biography || ''}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
        />
       
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button variant="outlined" onClick={() => navigate('/authors')}>
          Cancel
        </Button>
      </StyledForm>
    </div>
  );
};

export default AuthorEdit;
