import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress
} from '@mui/material';
import './EvidencijaRezervacija.css';

const EvidencijaRezervacija = () => {
  const [records, setRecords] = useState({
    active: [],
    archive: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get('https://biblioteka.simonovicp.com/api/users/me/rezervacije', {
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
              <TableCell>Datum rezervacije</TableCell>
              <TableCell>Datum zatvaranja</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Razlog zatvaranja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.knjiga?.title || 'N/A'}</TableCell>
                  <TableCell>
                    {record.knjiga?.authors
                      ? record.knjiga.authors.map(author => `${author.name || ''} ${author.surname || ''}`).join(', ')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{record.submitting_date ? new Date(record.submitting_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{record.closing_date ? new Date(record.closing_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{record.status || 'N/A'}</TableCell>
                  <TableCell>{record.closing_reason || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <div className="evidencija-rezervacija-container">
      <h1>Evidencija rezervacija</h1>
      {renderTable(records.active, 'Aktivne rezervacije')}
      {renderTable(records.archive, 'Arhivirane rezervacije')}
    </div>
  );
};

export default React.memo(EvidencijaRezervacija);
