import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../me/Me.css'; // Reusing the CSS styles from Me.css
import Spinner from '../components/Spinner'; // Importing Spinner component

const EditBook = () => {
  const { id } = useParams();
  const [editedBook, setEditedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get(`https://biblioteka.simonovicp.com/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let bookData = response.data.data;

        // Replace default image URLs with book.png
        const defaultImageUrls = [
          'http://library.test/img/profile.jpg',
          'https://biblioteka.simonovicp.com/img/profile.jpg'
        ];

        if (defaultImageUrls.includes(bookData.photo)) {
          bookData.photo = '/book.png';
        }

        bookData.pictures = bookData.pictures.map(picture =>
          defaultImageUrls.includes(picture.path) ? 
          { ...picture, path: '/book.png' } : picture
        );

        setEditedBook(bookData);
        setLoading(false);
      } catch (err) {
        // Error handling removed, React Toastify will handle it
      }
    };

    fetchBook();
  }, [id]);

  const handleInputChange = useCallback((e) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
  }, [editedBook]);

  const handleSave = useCallback(() => {
    const token = localStorage.getItem('jwt');
    axios.post(`https://biblioteka.simonovicp.com/api/books/${id}/update`, editedBook, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      navigate(`/books/book/${id}`);
    })
    .catch(error => {
      // Error handling removed, React Toastify will handle it
    });
  }, [id, editedBook, navigate]);

  const handleCancelEdit = useCallback(() => {
    navigate(`/books/book/${id}`);
  }, [id, navigate]);

  if (loading) {
    return <Spinner />; // Using Spinner component
  }

  return (
    <div className="user-profile">
      <h1>Edit Book</h1>
      <div className="user-info">
        <img src={editedBook.photo} alt={`Cover of the book ${editedBook.title}`} />
        <input name="nazivKnjiga" value={editedBook.title} onChange={handleInputChange} />
        <input name="brStrana" value={editedBook.pages} onChange={handleInputChange} />
        <input name="pismo" value={editedBook.script.id} onChange={handleInputChange} />
        <input name="jezik" value={editedBook.language.id} onChange={handleInputChange} />
        <input name="povez" value={editedBook.bookbind.id} onChange={handleInputChange} />
        <input name="format" value={editedBook.format.id} onChange={handleInputChange} />
        <input name="izdavac" value={editedBook.publisher.id} onChange={handleInputChange} />
        <input name="godinaIzdavanja" value={editedBook.pDate} onChange={handleInputChange} />
        <input name="isbn" value={editedBook.isbn} onChange={handleInputChange} />
        <input name="knjigaKolicina" value={editedBook.samples} onChange={handleInputChange} />
        <textarea name="kratki_sadrzaj" value={editedBook.description} onChange={handleInputChange} />
        <div className="button-group">
          <button className="save-button" onClick={handleSave}>Save</button>
          <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditBook);