import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import './BibliotekarDetalji.css';

const BibliotekarDetalji = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bibliotekar, setBibliotekar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBibliotekar = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get(`https://biblioteka.simonovicp.com/api/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setBibliotekar(response.data.data); // Ovdje koristimo response.data.data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBibliotekar();
  }, [id]);

  const handleEditClick = () => {
    navigate(`/bibliotekari/bibliotekar/${id}/edit`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bibliotekar) {
    return <div>Bibliotekar not found</div>;
  }

  return (
    <div className="bibliotekar-detalji-container">
      <Sidebar />
      <Header />
      <div className="bibliotekar-detalji-content">
        <h1>Detalji o {bibliotekar.name} {bibliotekar.surname}</h1>
        <div className="bibliotekar-info">
          <img 
            src={bibliotekar.photoPath || 'https://biblioteka.simonovicp.com/img/profile.jpg'} 
            alt={`${bibliotekar.name} ${bibliotekar.surname}`} 
            className="bibliotekar-photo"
          />
          <p><strong>Ime:</strong> {bibliotekar.name}</p>
          <p><strong>Prezime:</strong> {bibliotekar.surname}</p>
          <p><strong>Email:</strong> {bibliotekar.email}</p>
          <p><strong>Korisničko ime:</strong> {bibliotekar.username}</p>
          <p><strong>JMBG:</strong> {bibliotekar.jmbg}</p>
          <p><strong>Uloga:</strong> {bibliotekar.role}</p>
          <button onClick={handleEditClick}>Uredi</button>
        </div>
      </div>
    </div>
  );
};

export default BibliotekarDetalji;
