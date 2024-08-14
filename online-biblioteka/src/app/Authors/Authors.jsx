import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Menu, MenuItem, Avatar,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Authors.css';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get('https://biblioteka.simonovicp.com/api/authors', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setAuthors(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleDeleteAuthor = async (authorId) => {
    const token = localStorage.getItem('jwt');
    try {
      await axios.delete(`https://biblioteka.simonovicp.com/api/authors/${authorId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`
        }
      });
      setAuthors(authors.filter(author => author.id !== authorId));
      handleMenuClose();
    } catch (err) {
      console.error('Error deleting author:', err);
      setError('Failed to delete author. Please try again.');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedAuthors(authors.map(author => author.id));
    } else {
      setSelectedAuthors([]);
    }
  };

  const handleSelectAuthor = (authorId) => {
    setSelectedAuthors(prevSelectedAuthors => {
      if (prevSelectedAuthors.includes(authorId)) {
        return prevSelectedAuthors.filter(id => id !== authorId);
      } else {
        return [...prevSelectedAuthors, authorId];
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

  const handleMenuOpen = (event, author) => {
    setAnchorEl(event.currentTarget);
    setSelectedAuthor(author);
  };

  const handleMenuClose = (action) => {
    if (action === 'delete' && selectedAuthor) {
      setOpenDeleteDialog(true);
    } else if (action === 'view' && selectedAuthor) {
      navigate(`/authors/author/${selectedAuthor.id}`);
    } else if (action === 'edit' && selectedAuthor) {
      navigate(`/authors/author/${selectedAuthor.id}/edit`);
    } else {
      setAnchorEl(null);
      setSelectedAuthor(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedAuthor) {
      await handleDeleteAuthor(selectedAuthor.id);
    }
    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    handleMenuClose();
  };

  const sortedAuthors = [...authors].sort((a, b) => {
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

  const filteredAuthors = sortedAuthors.filter(author =>
    `${author.name} ${author.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="authors-container">
      <h1>Autori</h1>
      <div className="actions-container">
        <NavLink to="/authors/add" className="new-author-btn">Novi Autor</NavLink>
        <div className="search-container">
          <input
            type="text"
            placeholder="Pretraži autore..."
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
                    checked={selectedAuthors.length === authors.length}
                  />
                </TableCell>
                <TableCell onClick={() => handleSort('name')}>
                  Ime i Prezime {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
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
                filteredAuthors.map(author => (
                  <TableRow key={author.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAuthors.includes(author.id)}
                        onChange={() => handleSelectAuthor(author.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={author.photoPath} alt={`${author.name} ${author.surname}`} />
                        <span style={{ marginLeft: '10px' }}>{`${author.name} ${author.surname}`}</span>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuOpen(event, author)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedAuthor === author}
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

export default Authors;
