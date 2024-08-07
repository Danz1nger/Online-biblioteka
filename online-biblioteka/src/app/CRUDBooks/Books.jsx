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
        
        const booksData = response.data.data.map(book => {
          if (book.photo === 'https://biblioteka.simonovicp.com/img/profile.jpg') {
            return { ...book, photo: 'book.png' };
          }
          return book;
        });
        setBooks(booksData);
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

  const sortedBooks = [...books].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredBooks = sortedBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuOpen = (event, book) => {
    setAnchorEl(event.currentTarget);
    setSelectedBook(book);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="books-container">
      <h1>Books List</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedBooks.length > 0 && selectedBooks.length < books.length}
                  checked={books.length > 0 && selectedBooks.length === books.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell onClick={() => handleSort('title')}>Title</TableCell>
              <TableCell>Authors</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell onClick={() => handleSort('samples')}>Samples</TableCell>
              <TableCell onClick={() => handleSort('rSamples')}>Reserved Samples</TableCell>
              <TableCell onClick={() => handleSort('bSamples')}>Borrowed Samples</TableCell>
              <TableCell onClick={() => handleSort('fSamples')}>Free Samples</TableCell>
              <TableCell onClick={() => handleSort('samples')}>Total Samples</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                <TableCell className="title-cell" style={{ width: `${book.title.length * 10}px` }}>
                  <img src={book.photo} alt="book cover" style={{ width: '50px' }} />
                  {book.title}
                </TableCell>
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
    </div>
  );
};

export default Books;
