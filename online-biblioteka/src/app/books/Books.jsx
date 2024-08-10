import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Menu, MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete'; // Importing Delete Icon
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Importing Arrow Up Icon
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Importing Arrow Down Icon
import { useNavigate, NavLink } from 'react-router-dom'; // Import NavLink
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
  const navigate = useNavigate();

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
          if (book.photo === 'https://biblioteka.simonovicp.com/img/profile.jpg' || book.photo === 'http://library.test/img/profile.jpg') {
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

  const handleMenuClose = async (action) => {
    setAnchorEl(null);
    if (action === 'view' && selectedBook) {
      navigate(`/books/book/${selectedBook.id}`);
    } else if (action === 'edit' && selectedBook) {
      navigate(`/books/book/${selectedBook.id}/edit`);
    } else if (action === 'delete' && selectedBook) {
      const confirmDelete = window.confirm('Are you sure you want to delete this book?');
      if (confirmDelete) {
        try {
          const token = localStorage.getItem('jwt');
          await axios.delete(`https://biblioteka.simonovicp.com/api/books/${selectedBook.id}/destroy`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          setBooks(books.filter(book => book.id !== selectedBook.id));
        } catch (err) {
          setError('There was an error deleting the book.');
        }
      }
    } else if (action === 'reserve' && selectedBook) {
      navigate(`/books/book/reservations/${selectedBook.id}`);
    } else if (action === 'izdaj' && selectedBook) {
      // Navigate to the BookIzdavanje page
      navigate(`/books/book/izdavanja/${selectedBook.id}`);
    }
    setSelectedBook(null);
  };

  const handleBulkDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete these books?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete('https://biblioteka.simonovicp.com/api/books/bulkdelete', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: { ids: selectedBooks }
        });
        setBooks(books.filter(book => !selectedBooks.includes(book.id)));
        setSelectedBooks([]);
      } catch (err) {
        setError('There was an error deleting the selected books.');
      }
    }
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
    }
    return null;
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
      <div className="books-header">
        <h1>Knjige</h1>
        {selectedBooks.length > 1 && (  /* Show the delete button only when more than one book is selected */
          <IconButton onClick={handleBulkDelete} style={{ marginLeft: '20px', color: 'red' }}>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
      <div className="books-header">
        <NavLink to="/books/newbook" className="new-book-link">
          <button className="new-book-btn">Nova knjiga</button>
        </NavLink>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="search-icon">🔍</span>
        </div>
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
              <TableCell onClick={() => handleSort('title')}>
                Title {renderSortArrow('title')}
              </TableCell>
              <TableCell>Authors</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell onClick={() => handleSort('samples')}>
                Samples {renderSortArrow('samples')}
              </TableCell>
              <TableCell onClick={() => handleSort('rSamples')}>
                Reserved Samples {renderSortArrow('rSamples')}
              </TableCell>
              <TableCell onClick={() => handleSort('bSamples')}>
                Borrowed Samples {renderSortArrow('bSamples')}
              </TableCell>
              <TableCell onClick={() => handleSort('fSamples')}>
                Free Samples {renderSortArrow('fSamples')}
              </TableCell>
              <TableCell onClick={() => handleSort('samples')}>
                Total Samples {renderSortArrow('samples')}
              </TableCell>
              <TableCell align="right"></TableCell>
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
                    <MenuItem onClick={() => handleMenuClose('view')}>Pogledaj</MenuItem>
                    <MenuItem onClick={() => handleMenuClose('edit')}>Izmijeni</MenuItem>
                    <MenuItem onClick={() => handleMenuClose('delete')}>Obriši</MenuItem> {/* Delete option */}
                    <MenuItem onClick={() => handleMenuClose('reserve')}>Rezerviši</MenuItem> {/* Rezerviši option */}
                    <MenuItem onClick={() => handleMenuClose('izdaj')}>Izdaj</MenuItem> {/* Izdaj option */}
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
