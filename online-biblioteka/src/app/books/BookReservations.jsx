import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../me/Me.css'; // Importing the Me.css for styling

const BookReservations = () => {
  const [selectedTab, setSelectedTab] = useState('reserve');
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    datumRezervisanja: '',
    reservation_id: '',
    book_id: '',
  });

  const jwtToken = localStorage.getItem('jwt');

  const handleTabChange = useCallback((tab) => {
    setSelectedTab(tab);
  }, []);

  const handleInputChange = useCallback((e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }, [formData]);

  const reserveBook = useCallback(async () => {
    try {
      await axios.post(
        `https://biblioteka.simonovicp.com/api/books/${formData.book_id}/reserve`,
        {
          student_id: formData.student_id,
          datumRezervisanja: formData.datumRezervisanja,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Book reserved successfully!');
    } catch (error) {
      alert('Failed to reserve book.');
    }
  }, [formData, jwtToken]);

  const cancelReservation = useCallback(async () => {
    try {
      await axios.post(
        'https://biblioteka.simonovicp.com/api/books/reservations/cancel',
        {
          reservation_id: formData.reservation_id,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Reservation cancelled successfully!');
    } catch (error) {
      alert('Failed to cancel reservation.');
    }
  }, [formData.reservation_id, jwtToken]);

  const deleteReservation = useCallback(async () => {
    try {
      await axios.delete(
        `https://biblioteka.simonovicp.com/api/books/reservations/${formData.reservation_id}/destroy`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Reservation deleted successfully!');
    } catch (error) {
      alert('Failed to delete reservation.');
    }
  }, [formData.reservation_id, jwtToken]);

  const getAllReservations = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://biblioteka.simonovicp.com/api/books/reservations',
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          params: {
            book_id: formData.book_id || undefined,
          },
        }
      );
      setReservations(Array.isArray(response.data) ? response.data : []); // Ensure reservations is an array
    } catch (error) {
      alert('Failed to fetch reservations.');
    }
  }, [formData.book_id, jwtToken]);

  useEffect(() => {
    if (selectedTab === 'all') {
      getAllReservations();
    }
  }, [selectedTab, getAllReservations]);

  return (
    <div className="user-profile">
      <h1>Book Reservations</h1>
      <div className="record-buttons">
        <button 
          className={`record-button ${selectedTab === 'reserve' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('reserve')}
        >
          Reserve a Book
        </button>
        <button 
          className={`record-button ${selectedTab === 'cancel' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('cancel')}
        >
          Cancel Reservation
        </button>
        <button 
          className={`record-button ${selectedTab === 'delete' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('delete')}
        >
          Delete zapis rezervacije
        </button>
        <button 
          className={`record-button ${selectedTab === 'all' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('all')}
        >
          All Reservations
        </button>
      </div>

      <div className="separator"></div>

      <div className="user-info">
        {selectedTab === 'reserve' && (
          <div>
            <h2>Reserve a Book</h2>
            <input
              type="text"
              name="student_id"
              placeholder="Student ID"
              value={formData.student_id}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="datumRezervisanja"
              placeholder="Reservation Date"
              value={formData.datumRezervisanja}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="book_id"
              placeholder="Book ID"
              value={formData.book_id}
              onChange={handleInputChange}
            />
            <button className="save-button" onClick={reserveBook}>Reserve</button>
          </div>
        )}
        {selectedTab === 'cancel' && (
          <div>
            <h2>Cancel Reservation</h2>
            <input
              type="text"
              name="reservation_id"
              placeholder="Reservation ID"
              value={formData.reservation_id}
              onChange={handleInputChange}
            />
            <button className="cancel-button" onClick={cancelReservation}>Cancel</button>
          </div>
        )}
        {selectedTab === 'delete' && (
          <div>
            <h2>Delete Reservation</h2>
            <input
              type="text"
              name="reservation_id"
              placeholder="Reservation ID"
              value={formData.reservation_id}
              onChange={handleInputChange}
            />
            <button className="cancel-button" onClick={deleteReservation}>Delete</button>
          </div>
        )}
        {selectedTab === 'all' && (
          <div>
            <h2>All Reservations</h2>
            <input
              type="text"
              name="book_id"
              placeholder="Book ID (optional)"
              value={formData.book_id}
              onChange={handleInputChange}
            />
            <button className="save-button" onClick={getAllReservations}>Fetch Reservations</button>
            <table>
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>Student ID</th>
                  <th>Book ID</th>
                  <th>Reservation Date</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.id}</td>
                    <td>{reservation.student_id}</td>
                    <td>{reservation.book_id}</td>
                    <td>{reservation.datumRezervisanja}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(BookReservations);
