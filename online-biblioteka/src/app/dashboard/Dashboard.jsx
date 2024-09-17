import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './Dashboard.css';  // Import the CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@mui/material';

const Dashboard = () => {
  const [latestReservations, setLatestReservations] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [popularBooks, setPopularBooks] = useState([]);
  const [totalIssuedBooks, setTotalIssuedBooks] = useState(0);
  const [totalReservedBooks, setTotalReservedBooks] = useState(0);
  const [totalWrittenOffBooks, setTotalWrittenOffBooks] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const [reservationsResponse, booksResponse, issuedBooksResponse, reservedBooksResponse, writtenOffBooksResponse] = await Promise.all([
        axios.get('https://biblioteka.simonovicp.com/api/books/reservations', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 3 },
        }),
        axios.get('https://biblioteka.simonovicp.com/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://biblioteka.simonovicp.com/api/books/borrows', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://biblioteka.simonovicp.com/api/books/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://biblioteka.simonovicp.com/api/books/borrows', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setLatestReservations(reservationsResponse.data.data.active.slice(0, 3));

      const sortedBooks = booksResponse.data.data
        .sort((a, b) => b.rSamples - a.rSamples)
        .slice(0, 5);
      setPopularBooks(sortedBooks);

      const totalIssued = issuedBooksResponse.data.data.izdate.length + issuedBooksResponse.data.data.prekoracene.length;
      setTotalIssuedBooks(totalIssued);

      const totalReserved = reservedBooksResponse.data.data.active.length;
      setTotalReservedBooks(totalReserved);

      const totalWrittenOff = writtenOffBooksResponse.data.data.otpisane.length;
      setTotalWrittenOffBooks(totalWrittenOff);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const students = useMemo(() => [
    { name: "Marko Marković", photoPath: "https://biblioteka.simonovicp.com/img/profile.jpg" },
    { name: "Ana Anić", photoPath: "https://biblioteka.simonovicp.com/img/profile.jpg" },
    { name: "Ivan Ivić", photoPath: "https://biblioteka.simonovicp.com/img/profile.jpg" },
    { name: "Jovana Jovanović", photoPath: "https://biblioteka.simonovicp.com/img/profile.jpg" },
    { name: "Nikola Nikolić", photoPath: "https://biblioteka.simonovicp.com/img/profile.jpg" }
  ], []);

  const books = useMemo(() => [
    "1984", "Ana Karenjina", "Gospodar prstenova", "Sto godina samoće", "Zločin i kazna"
  ], []);

  const actions = useMemo(() => ["je iznajmio", "je vratila", "je produžio rok za", "je rezervisala", "je otkazao rezervaciju za"], []);

  const timeAgo = useMemo(() => ["prije 2 sata", "prije 5 sati", "prije 1 dan", "prije 3 dana", "prije 1 sedmicu"], []);

  const generateRandomActivities = (count) => {
    const activities = [];
    for (let i = 0; i < count; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      activities.push({
        name: student.name,
        photoPath: student.photoPath,
        action: actions[Math.floor(Math.random() * actions.length)],
        book: books[Math.floor(Math.random() * books.length)],
        timeAgo: timeAgo[Math.floor(Math.random() * timeAgo.length)]
      });
    }
    return activities;
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="refresh-button" onClick={handleRefresh} disabled={isRefreshing}>
          <FontAwesomeIcon icon={faSync} spin={isRefreshing} />
        </button>
      </div>
      <div className="dashboard-grid">
        {/* Activities Card */}
        <div className="dashboard-card">
          <h2>Aktivnosti</h2>
          <ul className="activity-list">
            {generateRandomActivities(3).map((activity, index) => (
              <li key={index} className="activity-item">
                <img src={activity.photoPath} alt="User avatar" className="activity-avatar" />
                <div>
                  <strong>{activity.name}</strong> {activity.action} knjigu "{activity.book}"
                  <small>{activity.timeAgo}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Reservations Card */}
        <div className="dashboard-card">
          <h2>Rezervacije knjiga</h2>
          <ul className="reservations-list">
            {latestReservations.map((reservation) => (
              <li key={reservation.id} className="reservation-item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={reservation.student.photoPath || "https://biblioteka.simonovicp.com/img/profile.jpg"} 
                    alt={`${reservation.student.name} ${reservation.student.surname}`} 
                  />
                  <div style={{ marginLeft: '10px' }}>
                    <strong>{reservation.student.name} {reservation.student.surname}</strong>
                    <div>{reservation.knjiga.title}</div>
                    <small>{new Date(reservation.action_date).toLocaleDateString()}</small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Statistics Card */}
        <div className="dashboard-card">
          <h2>Statistika</h2>
          <div className="statistics">
            <div>
              <strong>Iznajmljene knjige</strong>
              <div className="stat-bar" style={{ width: `${(totalIssuedBooks / (totalIssuedBooks + totalReservedBooks + totalWrittenOffBooks)) * 100}%`, backgroundColor: '#4CAF50' }}></div>
              <span>{totalIssuedBooks}</span>
            </div>
            <div>
              <strong>Rezervisane knjige</strong>
              <div className="stat-bar" style={{ width: `${(totalReservedBooks / (totalIssuedBooks + totalReservedBooks + totalWrittenOffBooks)) * 100}%`, backgroundColor: '#FFC107' }}></div>
              <span>{totalReservedBooks}</span>
            </div>
            <div>
              <strong>Otpisane knjige</strong>
              <div className="stat-bar" style={{ width: `${(totalWrittenOffBooks / (totalIssuedBooks + totalReservedBooks + totalWrittenOffBooks)) * 100}%`, backgroundColor: '#F44336' }}></div>
              <span>{totalWrittenOffBooks}</span>
            </div>
          </div>
        </div>

        {/* Most Popular Books Card */}
        <div className="dashboard-card">
          <h2>Najpopularnije knjige</h2>
          <ol>
            {popularBooks.map((book) => (
              <li key={book.id}>
                {book.title} - {book.authors.map(author => `${author.name} ${author.surname}`).join(', ')}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
