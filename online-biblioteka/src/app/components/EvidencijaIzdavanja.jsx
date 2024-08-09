import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress
} from '@mui/material';
import './EvidencijaIzdavanja.css';

const EvidencijaIzdavanja = () => {
  const [records, setRecords] = useState({
    izdate: [],
    vracene: [],
    otpisane: [],
    prekoracene: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get('https://biblioteka.simonovicp.com/api/users/me/izdavanja', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setRecords(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <CircularProgress />
      </div>
    );
  }

  const renderTable = (data, title) => (
    <div className="table-section">
      <h2>{title}</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Knjiga</TableCell>
              <TableCell>Autori</TableCell>
              <TableCell>Datum izdavanja</TableCell>
              <TableCell>Datum vraćanja</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.knjiga?.title || 'N/A'}</TableCell>
                <TableCell>
                  {record.knjiga?.authors
                    ? record.knjiga.authors.map(author => `${author.name || ''} ${author.surname || ''}`).join(', ')
                    : 'N/A'}
                </TableCell>
                <TableCell>{record.borrow_date ? new Date(record.borrow_date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{record.return_date ? new Date(record.return_date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{record.status || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <div className="evidencija-izdavanja-container">
      <h1>Evidencija izdavanja</h1>
      {records.izdate && records.izdate.length > 0 && renderTable(records.izdate, 'Izdate knjige')}
      {records.vracene && records.vracene.length > 0 && renderTable(records.vracene, 'Vraćene knjige')}
      {records.otpisane && records.otpisane.length > 0 && renderTable(records.otpisane, 'Otpisane knjige')}
      {records.prekoracene && records.prekoracene.length > 0 && renderTable(records.prekoracene, 'Prekoračene knjige')}
    </div>
  );
};

export default EvidencijaIzdavanja;