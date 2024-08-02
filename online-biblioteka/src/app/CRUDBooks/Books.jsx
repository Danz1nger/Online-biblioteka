import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Menu, MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get('https://biblioteka.simonovicp.com/api/books', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
          }
        });
        setBooks(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedBooks(books.map(book => book.id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks(prevSelectedBooks => {
      if (prevSelectedBooks.includes(bookId)) {
        return prevSelectedBooks.filter(id => id !== bookId);
      } else {
        return [...prevSelectedBooks, bookId];
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

  const handleMenuOpen = (event, book) => {
    setAnchorEl(event.currentTarget);
    setSelectedBook(book);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBook(null);
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'title' || sortConfig.key === 'authors') {
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

  const filteredBooks = sortedBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="books-container">
      <h1>Knjige</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Pretraži knjige..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <span className="search-icon">🔍</span>
      </div>
      <button className="new-book-btn">Nova Knjiga</button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedBooks.length === books.length}
                />
              </TableCell>
              <TableCell onClick={() => handleSort('title')}>
                Naziv Knjige {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('authors')}>
                Autor {sortConfig.key === 'authors' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>Kategorija</TableCell>
              <TableCell onClick={() => handleSort('samples')}>
                Na raspolaganju {sortConfig.key === 'samples' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>Rezervisano</TableCell>
              <TableCell>Izdato</TableCell>
              <TableCell>U prekoračenju</TableCell>
              <TableCell onClick={() => handleSort('samples')}>
                Ukupna količina {sortConfig.key === 'samples' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map(book => (
              <TableRow key={book.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => handleSelectBook(book.id)}
                  />
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.authors.map(author => `${author.name} ${author.surname}`).join(', ')}</TableCell>
                <TableCell>{book.categories.map(category => category.name).join(', ')}</TableCell>
                <TableCell>{book.samples}</TableCell>
                <TableCell>{book.rSamples}</TableCell>
                <TableCell>{book.bSamples}</TableCell>
                <TableCell>{book.fSamples}</TableCell>
                <TableCell>{book.samples}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(event) => handleMenuOpen(event, book)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedBook === book}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>Pogledaj</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Izmijeni</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Obriši</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Vrati</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Rezerviši</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Izdaj</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && <div className="spinner"></div>}
    </div>
  );
};

export default Books;