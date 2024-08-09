import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../me/Me.css'; // Reusing the CSS styles from Me.css

const NewBook = () => {
  const [bookData, setBookData] = useState({
    nazivKnjiga: '',
    brStrana: '',
    pismo: '',
    jezik: '',
    povez: '',
    format: '',
    izdavac: '',
    godinaIzdavanja: '',
    isbn: '',
    knjigaKolicina: '',
    kratki_sadrzaj: '',
    categories: [],
    genres: [],
    authors: [],
    pictures: [],
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleSave = () => {
    const token = localStorage.getItem('jwt');
    axios.post('https://biblioteka.simonovicp.com/api/books/store', bookData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      navigate('/books');
    })
    .catch(error => {
      setError('There was an error creating the book!');
    });
  };

  const handleCancel = () => {
    navigate('/books');
  };

  return (
    <div className="user-profile">
      <h1>Create New Book</h1>
      <div className="user-info">
        <input name="nazivKnjiga" placeholder="Title" value={bookData.nazivKnjiga} onChange={handleInputChange} />
        <input name="brStrana" placeholder="Pages" value={bookData.brStrana} onChange={handleInputChange} />
        <input name="pismo" placeholder="Script ID" value={bookData.pismo} onChange={handleInputChange} />
        <input name="jezik" placeholder="Language ID" value={bookData.jezik} onChange={handleInputChange} />
        <input name="povez" placeholder="Binding ID" value={bookData.povez} onChange={handleInputChange} />
        <input name="format" placeholder="Format ID" value={bookData.format} onChange={handleInputChange} />
        <input name="izdavac" placeholder="Publisher ID" value={bookData.izdavac} onChange={handleInputChange} />
        <input name="godinaIzdavanja" placeholder="Year of Publication" value={bookData.godinaIzdavanja} onChange={handleInputChange} />
        <input name="isbn" placeholder="ISBN" value={bookData.isbn} onChange={handleInputChange} />
        <input name="knjigaKolicina" placeholder="Quantity" value={bookData.knjigaKolicina} onChange={handleInputChange} />
        <textarea name="kratki_sadrzaj" placeholder="Short Description" value={bookData.kratki_sadrzaj} onChange={handleInputChange} />
        <div className="button-group">
          <button className="save-button" onClick={handleSave}>Save</button>
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
};

export default NewBook;
