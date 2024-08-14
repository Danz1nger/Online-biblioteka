import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import './AuthorDetails.css';

const AuthorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get(`https://biblioteka.simonovicp.com/api/authors/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setAuthor(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  const handleEditClick = () => {
    navigate(`/authors/author/${id}/edit`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!author) {
    return <div>Autor not found</div>;
  }

  return (
    <div className="author-details-container">
      <Sidebar />
      <Header />
      <div className="author-details-content">
        <h1>Detalji o {author.name} {author.surname}</h1>
        <div className="author-info">
          <img 
            src={author.photoPath || 'https://biblioteka.simonovicp.com/img/profile.jpg'} 
            alt={`${author.name} ${author.surname}`} 
            className="author-photo"
          />
          <p><strong>Ime:</strong> {author.name}</p>
          <p><strong>Prezime:</strong> {author.surname}</p>
          <p><strong>Opis:</strong> {author.bio || 'Nema opisa'}</p>
          <button onClick={handleEditClick}>Uredi</button>
        </div>

        <div className="books-section">
          <h2>Knjige koje je napisao {author.name} {author.surname}</h2>
          <div className="books-list">
            {author.books.length === 0 ? (
              <p>Autor nema knjiga.</p>
            ) : (
              author.books.map(book => (
                <div key={book.id} className="book-item">
                  <img
                    src={book.photo || 'https://biblioteka.simonovicp.com/img/book-cover-placeholder.png'}
                    alt={book.title}
                    className="book-photo"
                  />
                  <div className="book-details">
                    <h3>{book.title}</h3>
                    <p><strong>Opis:</strong> {book.description || 'Nema opisa'}</p>
                    <p><strong>Godina izdanja:</strong> {book.pDate}</p>
                    <p><strong>Broj strana:</strong> {book.pages}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;
