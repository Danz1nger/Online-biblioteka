import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Menu, MenuItem, Avatar
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

      if (sortConfig.key === 'name') {
        aValue = `${a.name} ${a.surname}`.toLowerCase();
        bValue = `${b.name} ${b.surname}`.toLowerCase();
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

  return (
    <div className="students-container">
      <h1>Učenici</h1>
      <div className="actions-container">
        <NavLink to="/ucenici/noviucenik" className="new-student-btn">Novi Učenik</NavLink>
        <div className="search-container">
          <input
            type="text"
            placeholder="Pretraži učenike..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
      <div className="table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={selectedStudents.length === students.length}
                  />
                </TableCell>
                <TableCell onClick={() => handleSort('name')}>
                  Ime i Prezime {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Razred</TableCell>
                <TableCell>Odjeljenje</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <div className="spinner-container">
                      <div className="spinner"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={student.photoPath} alt={`${student.name} ${student.surname}`} />
                        <span style={{ marginLeft: '10px' }}>{`${student.name} ${student.surname}`}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.razred}</TableCell>
                    <TableCell>{student.odjeljenje}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuOpen(event, student)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedStudent === student}
                        onClose={() => handleMenuClose()}
                      >
                        <MenuItem onClick={() => handleMenuClose('view')}>Pogledaj</MenuItem>
                        <MenuItem onClick={() => handleMenuClose('edit')}>Izmijeni</MenuItem>
                        <MenuItem onClick={() => handleMenuClose('delete')}>Obriši</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
};

export default Ucenici;