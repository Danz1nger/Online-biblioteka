import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../me/Me.css'; // Reusing the CSS styles from Me.css
import Spinner from '../components/Spinner'; // Importing Spinner component
import DeleteIcon from '@mui/icons-material/Delete'; // Importing Delete Icon
import IconButton from '@mui/material/IconButton'; // Importing IconButton
import EditIcon from '@mui/icons-material/Edit'; // Importing Edit Icon
import MessageIcon from '@mui/icons-material/Message'; // Importing Message Icon

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewStar, setReviewStar] = useState(0);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
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

        setBook(bookData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = useCallback(async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete(`https://biblioteka.simonovicp.com/api/books/${id}/destroy`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        navigate('/books');
      } catch (err) {
        setError('There was an error deleting the book.');
      }
    }
  }, [id, navigate]);

  const handleEdit = useCallback(() => {
    navigate(`/books/book/${id}/edit`);
  }, [id, navigate]);

  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');

    try {
      await axios.post(
        `https://biblioteka.simonovicp.com/api/books/${id}/review`,
        {
          body: reviewBody,
          star: reviewStar,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      setReviewSuccess('Review submitted successfully!');
      setReviewBody('');
      setReviewStar(0);
      setShowReviewForm(false);
    } catch (err) {
      setReviewError('There was an error submitting the review.');
    }
  }, [id, reviewBody, reviewStar]);

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  if (loading) {
    return <Spinner />; // Using Spinner component
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>No book found.</div>;
  }

  return (
    <div className="user-profile">
      <div className="icon-container" style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <IconButton onClick={toggleReviewForm} style={{ marginRight: '10px' }}>
          <MessageIcon style={{ color: 'green' }} />
        </IconButton>
        <IconButton onClick={handleEdit} style={{ marginRight: '10px' }}>
          <EditIcon style={{ color: 'blue' }} />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon style={{ color: 'red' }} />
        </IconButton>
      </div>
      <h1>{book.title}</h1>
      <div className="user-info">
        <img src={book.photo} alt={`Cover of the book ${book.title}`} />
        <p><strong>Description:</strong> {book.description}</p>
        <p><strong>Pages:</strong> {book.pages}</p>
        <p><strong>Published Date:</strong> {book.pDate}</p>
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Publisher:</strong> {book.publisher.name}</p>
        <p><strong>Script:</strong> {book.script.name}</p>
        <p><strong>Language:</strong> {book.language.name}</p>
        <p><strong>Bookbind:</strong> {book.bookbind.name}</p>
        <p><strong>Format:</strong> {book.format.name}</p>
        <p><strong>Rating:</strong> {book.rating}</p>
        <p><strong>Samples:</strong> {book.samples}</p>
        <p><strong>Borrowed Samples:</strong> {book.bSamples}</p>
        <p><strong>Reserved Samples:</strong> {book.rSamples}</p>
        <p><strong>Free Samples:</strong> {book.fSamples}</p>
        <p><strong>Able to Borrow:</strong> {book.ableToBorrow ? 'Yes' : 'No'}</p>
        <p><strong>Able to Reserve:</strong> {book.ableToReserve ? 'Yes' : 'No'}</p>
      </div>

      {showReviewForm && (
        <div style={{
          position: 'fixed',
          bottom: '150px', // Increased from '92px' to '150px' to move it higher
          right: '20px',
          width: '300px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          backgroundColor: 'white',
          zIndex: 1000
        }}>
          <h2 style={{ marginTop: 0 }}>Leave a Review</h2>
          {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}
          {reviewSuccess && <p style={{ color: 'green' }}>{reviewSuccess}</p>}
          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Review:</label>
              <textarea
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Rating:</label>
              <input
                type="number"
                value={reviewStar}
                onChange={(e) => setReviewStar(e.target.value)}
                min="1"
                max="5"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </div>
            <button type="submit" style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '10px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default React.memo(BookDetail);
