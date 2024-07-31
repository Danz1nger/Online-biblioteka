import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Books.css'; // Create a CSS file for styling

const Books = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
            <th>Naziv Knjige</th>
            <th>Autor</th>
            <th>Kategorija</th>
            <th>Na raspolaganju</th>
            <th>Rezervisano</th>
            <th>Izdato</th>
            <th>U prekoračenju</th>
            <th>Ukupna količina</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.id}>
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
                    <button>Pogledaj Detalje</button>
                    <button>Izmeni Knjigu</button>
                    <button>Otpiši Knjigu</button>
                    <button>Izdaj Knjigu</button>
                    <button>Vrati Knjigu</button>
                    <button>Rezerviši Knjigu</button>
                    <button>Izbriši Knjigu</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;