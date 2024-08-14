import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Menu, MenuItem, Avatar,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Bibliotekari.css';

const Bibliotekari = () => {
  const [librarians, setLibrarians] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLibrarians, setSelectedLibrarians] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibrarians = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get('https://biblioteka.simonovicp.com/api/users', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const filteredLibrarians = response.data.data.filter(user => user.role === "Bibliotekar");
        setLibrarians(filteredLibrarians);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLibrarians();
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
      setLibrarians(librarians.filter(librarian => librarian.id !== userId));
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
      setSelectedLibrarians(librarians.map(librarian => librarian.id));
    } else {
      setSelectedLibrarians([]);
    }
  };

  const handleSelectLibrarian = (librarianId) => {
    setSelectedLibrarians(prevSelectedLibrarians => {
      if (prevSelectedLibrarians.includes(librarianId)) {
        return prevSelectedLibrarians.filter(id => id !== librarianId);
      } else {
        return [...prevSelectedLibrarians, librarianId];
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

  const handleMenuOpen = (event, librarian) => {
    setAnchorEl(event.currentTarget);
    setSelectedLibrarian(librarian);
  };

  const handleMenuClose = (action) => {
    if (action === 'delete' && selectedLibrarian) {
      setOpenDeleteDialog(true);
    } else if (action === 'view' && selectedLibrarian) {
      navigate(`/bibliotekari/bibliotekar/${selectedLibrarian.id}`);
    } else if (action === 'edit' && selectedLibrarian) {
      navigate(`/bibliotekari/bibliotekar/${selectedLibrarian.id}/edit`);
    } else {
      setAnchorEl(null);
      setSelectedLibrarian(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedLibrarian) {
      await handleDeleteUser(selectedLibrarian.id);
    }
    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    handleMenuClose();
  };

  const sortedLibrarians = [...librarians].sort((a, b) => {
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

  const filteredLibrarians = sortedLibrarians.filter(librarian =>
    `${librarian.name} ${librarian.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="librarians-container">
      <h1>Bibliotekari</h1>
      <div className="actions-container">
        <NavLink to="/bibliotekari/add" className="new-librarian-btn">Novi Bibliotekar</NavLink>
        <div className="search-container">
          <input
            type="text"
            placeholder="Pretraži bibliotekare..."
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
                    checked={selectedLibrarians.length === librarians.length}
                  />
                </TableCell>
                <TableCell onClick={() => handleSort('name')}>
                  Ime i Prezime {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tip korisnika</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <div className="spinner-container">
                      <div className="spinner"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLibrarians.map(librarian => (
                  <TableRow key={librarian.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedLibrarians.includes(librarian.id)}
                        onChange={() => handleSelectLibrarian(librarian.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={librarian.photoPath} alt={`${librarian.name} ${librarian.surname}`} />
                        <span style={{ marginLeft: '10px' }}>{`${librarian.name} ${librarian.surname}`}</span>
                      </div>
                    </TableCell>
                    <TableCell>{librarian.email}</TableCell>
                    <TableCell>{librarian.role}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuOpen(event, librarian)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedLibrarian === librarian}
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

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Bibliotekari;
