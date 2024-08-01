import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Books.css'; // Create a CSS file for styling

const Books = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    // Fetch books from API
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
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message);
        setLoading(false); // Set loading to false if there's an error
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

  const filteredBooks = books.filter(book =>
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
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedBooks.length === books.length}
              />
            </th>
            <th>Naziv Knjige</th>
            <th>Autor</th>
            <th>Kategorija</th>
            <th>Na raspolaganju</th>
            <th>Rezervisano</th>
            <th>Izdato</th>
            <th>U prekoračenju</th>
            <th>Ukupna količina</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book.id)}
                  onChange={() => handleSelectBook(book.id)}
                />
              </td>
              <td>{book.title}</td>
              <td>{book.authors.map(author => `${author.name} ${author.surname}`).join(', ')}</td>
              <td>{book.categories.map(category => category.name).join(', ')}</td>
              <td>{book.samples}</td>
              <td>{book.rSamples}</td>
              <td>{book.bSamples}</td>
              <td>{book.fSamples}</td>
              <td>{book.samples}</td>
              <td>
                <div className="actions-menu">
                  <button className="actions-button">⋮</button>
                  <div className="dropdown-content">
                    <button>Pogledaj</button>
                    <button>Izmijeni</button>
                    <button>Obriši</button>
                    <button>Vrati</button>
                    <button>Rezerviši</button>
                    <button>Izdaj</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="spinner"></div>} {/* Show spinner while loading */}
    </div>
  );
};

export default Books;