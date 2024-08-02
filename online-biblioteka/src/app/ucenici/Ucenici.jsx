import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Menu, MenuItem, Avatar, CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Ucenici.css';

const Ucenici = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get('https://biblioteka.simonovicp.com/api/users', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        // Filter users to keep only those with role "Učenik"
        const filteredStudents = response.data.data.filter(user => user.role === "Učenik");
        setStudents(filteredStudents);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('jwt');
    try {
      await axios.delete(`https://biblioteka.simonovicp.com/api/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`
        }
      });
      setStudents(students.filter(student => student.id !== userId));
      handleMenuClose();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedStudents(students.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prevSelectedStudents => {
      if (prevSelectedStudents.includes(studentId)) {
        return prevSelectedStudents.filter(id => id !== studentId);
      } else {
        return [...prevSelectedStudents, studentId];
      }
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = (action) => {
    if (action === 'delete' && selectedStudent) {
      handleDeleteUser(selectedStudent.id);
    } else if (action === 'view' && selectedStudent) {
      navigate(`/ucenici/ucenik/${selectedStudent.id}`);
    } else if (action === 'edit' && selectedStudent) {
      navigate(`/ucenici/ucenik/${selectedStudent.id}/edit`);
    }
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'name' || sortConfig.key === 'surname') {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredStudents = sortedStudents.filter(student =>
    `${student.name} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="students-container">
      <h1>Učenici</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Pretraži učenike..."
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Search students"
        />
        <span className="search-icon" aria-hidden="true">🔍</span>
      </div>
      <button className="new-student-btn" onClick={() => navigate('/ucenici/noviucenik')}>Novi Učenik</button>
      {loading ? (
        <div className="spinner-container">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="Students table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={selectedStudents.length === students.length}
                    aria-label="Select all students"
                  />
                </TableCell>
                <TableCell onClick={() => handleSort('name')}>
                  Ime i Prezime {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Zadnji pristup sistemu</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map(student => (
                <TableRow key={student.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      aria-label={`Select ${student.name} ${student.surname}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={student.photoPath || 'https://biblioteka.simonovicp.com/img/profile.jpg'} alt={`${student.name} ${student.surname}`} />
                      <span style={{ marginLeft: '8px' }}>{`${student.name} ${student.surname}`}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.lastAccess}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(event) => handleMenuOpen(event, student)} aria-label="More options">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && selectedStudent !== null}
        onClose={() => handleMenuClose()}
      >
        <MenuItem onClick={() => handleMenuClose('view')}>Pogledaj</MenuItem>
        <MenuItem onClick={() => handleMenuClose('edit')}>Izmijeni</MenuItem>
        <MenuItem onClick={() => handleMenuClose('delete')}>Obriši</MenuItem>
      </Menu>
    </div>
  );
};

export default Ucenici;