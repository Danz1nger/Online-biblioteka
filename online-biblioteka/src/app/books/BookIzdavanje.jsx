import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../me/Me.css'; // Importing the Me.css for styling

const BookIzdavanje = () => {
  const [selectedTab, setSelectedTab] = useState('izdaj');
  const [izdanja, setIzdanja] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    datumIzdavanja: '',
    datumVracanja: '',
    zapis_id: '',
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

  const izdajBook = useCallback(async () => {
    try {
      await axios.post(
        `https://biblioteka.simonovicp.com/api/books/${formData.book_id}/izdaj`,
        {
          student_id: formData.student_id,
          datumIzdavanja: formData.datumIzdavanja,
          datumVracanja: formData.datumVracanja,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Book issued successfully!');
    } catch (error) {
      alert('Failed to issue book.');
    }
  }, [formData, jwtToken]);

  const vratiBook = useCallback(async () => {
    try {
      await axios.post(
        'https://biblioteka.simonovicp.com/api/books/vrati',
        {
          toReturn: [formData.zapis_id],
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Book returned successfully!');
    } catch (error) {
      alert('Failed to return book.');
    }
  }, [formData.zapis_id, jwtToken]);

  const otpisiBook = useCallback(async () => {
    try {
      await axios.post(
        'https://biblioteka.simonovicp.com/api/books/otpisi',
        {
          toWriteoff: [formData.zapis_id],
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Book written off successfully!');
    } catch (error) {
      alert('Failed to write off book.');
    }
  }, [formData.zapis_id, jwtToken]);

  const deleteIzdavanje = useCallback(async () => {
    try {
      await axios.delete(
        `https://biblioteka.simonovicp.com/api/books/borrows/${formData.zapis_id}/destroy`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Issuance record deleted successfully!');
    } catch (error) {
      alert('Failed to delete issuance record.');
    }
  }, [formData.zapis_id, jwtToken]);

  const getAllIzdanja = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://biblioteka.simonovicp.com/api/books/borrows',
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          params: {
            book_id: formData.book_id || undefined,
          },
        }
      );
      setIzdanja(Array.isArray(response.data) ? response.data : []); // Ensure izdanja is an array
    } catch (error) {
      alert('Failed to fetch issuances.');
    }
  }, [formData.book_id, jwtToken]);

  useEffect(() => {
    if (selectedTab === 'all') {
      getAllIzdanja();
    }
  }, [selectedTab, getAllIzdanja]);

  return (
    <div className="user-profile">
      <h1>Book Issuances</h1>
      <div className="record-buttons">
        <button 
          className={`record-button ${selectedTab === 'izdaj' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('izdaj')}
        >
          Issue a Book
        </button>
        <button 
          className={`record-button ${selectedTab === 'vrati' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('vrati')}
        >
          Return a Book
        </button>
        <button 
          className={`record-button ${selectedTab === 'otpisi' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('otpisi')}
        >
          Write Off a Book
        </button>
        <button 
          className={`record-button ${selectedTab === 'delete' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('delete')}
        >
          Delete Issuance Record
        </button>
        <button 
          className={`record-button ${selectedTab === 'all' ? 'izdavanja' : ''}`} 
          onClick={() => handleTabChange('all')}
        >
          All Issuances
        </button>
      </div>

      <div className="separator"></div>

      <div className="user-info">
        {selectedTab === 'izdaj' && (
          <div>
            <h2>Issue a Book</h2>
            <input
              type="text"
              name="student_id"
              placeholder="Student ID"
              value={formData.student_id}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="datumIzdavanja"
              placeholder="Issue Date"
              value={formData.datumIzdavanja}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="datumVracanja"
              placeholder="Return Date"
              value={formData.datumVracanja}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="book_id"
              placeholder="Book ID"
              value={formData.book_id}
              onChange={handleInputChange}
            />
            <button className="save-button" onClick={izdajBook}>Issue</button>
          </div>
        )}
        {selectedTab === 'vrati' && (
          <div>
            <h2>Return a Book</h2>
            <input
              type="text"
              name="zapis_id"
              placeholder="Issuance Record ID"
              value={formData.zapis_id}
              onChange={handleInputChange}
            />
            <button className="cancel-button" onClick={vratiBook}>Return</button>
          </div>
        )}
        {selectedTab === 'otpisi' && (
          <div>
            <h2>Write Off a Book</h2>
            <input
              type="text"
              name="zapis_id"
              placeholder="Issuance Record ID"
              value={formData.zapis_id}
              onChange={handleInputChange}
            />
            <button className="cancel-button" onClick={otpisiBook}>Write Off</button>
          </div>
        )}
        {selectedTab === 'delete' && (
          <div>
            <h2>Delete Issuance Record</h2>
            <input
              type="text"
              name="zapis_id"
              placeholder="Issuance Record ID"
              value={formData.zapis_id}
              onChange={handleInputChange}
            />
            <button className="cancel-button" onClick={deleteIzdavanje}>Delete</button>
          </div>
        )}
        {selectedTab === 'all' && (
          <div>
            <h2>All Issuances</h2>
            <input
              type="text"
              name="book_id"
              placeholder="Book ID (optional)"
              value={formData.book_id}
              onChange={handleInputChange}
            />
            <button className="save-button" onClick={getAllIzdanja}>Fetch Issuances</button>
            <table>
              <thead>
                <tr>
                  <th>Issuance ID</th>
                  <th>Student ID</th>
                  <th>Book ID</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {izdanja.map((izdavanje) => (
                  <tr key={izdavanje.id}>
                    <td>{izdavanje.id}</td>
                    <td>{izdavanje.student_id}</td>
                    <td>{izdavanje.book_id}</td>
                    <td>{izdavanje.datumIzdavanja}</td>
                    <td>{izdavanje.datumVracanja}</td>
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

export default React.memo(BookIzdavanje);
