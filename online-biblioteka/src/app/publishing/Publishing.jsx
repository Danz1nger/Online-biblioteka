import React, { useState } from 'react';
import './Publishing.css';

const IzdavanjeKnjiga = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const books = [
    { naziv: '1984', autor: 'George Orwell', datum: '15.09.2023', trajanje: '2 nedelje', korisnik: 'Marko Marković' },
    { naziv: 'Ana Karenjina', autor: 'Lav Tolstoj', datum: '20.09.2023', trajanje: '3 nedelje', korisnik: 'Jovana Jovanović' },
    { naziv: 'Gospodar prstenova', autor: 'J.R.R. Tolkien', datum: '05.10.2023', trajanje: '1 mesec', korisnik: 'Nikola Nikolić' },
    { naziv: 'Sto godina samoće', autor: 'Gabriel García Márquez', datum: '12.10.2023', trajanje: '2 nedelje', korisnik: 'Ana Anić' },
    { naziv: 'Zločin i kazna', autor: 'Fjodor Dostojevski', datum: '18.10.2023', trajanje: '3 nedelje', korisnik: 'Petar Petrović' }
  ];

  const filteredBooks = books.filter(book =>
    Object.values(book).some(value =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container">
      <h1>Izdavanje knjiga</h1>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Pretraži knjige"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" className="checkbox" /></th>
            <th>Naziv Knjige</th>
            <th>Autor</th>
            <th>Datum izdavanja</th>
            <th>Trajanje zaduženja</th>
            <th>Korisnik</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, index) => (
            <tr key={index}>
              <td><input type="checkbox" className="checkbox" /></td>
              <td>{book.naziv}</td>
              <td>{book.autor}</td>
              <td>{book.datum}</td>
              <td>{book.trajanje}</td>
              <td>{book.korisnik}</td>
              <td className="options">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IzdavanjeKnjiga;
