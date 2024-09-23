import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from '../components/Spinner'
import './PublishingDetail.css'
const PublishingDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [book, setBook] = useState(location.state?.book);
  const [loading, setLoading] = useState(!book);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!book) {
      const fetchBookDetails = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("jwt");
          const response = await axios.get(
            "https://biblioteka.simonovicp.com/api/books/borrows",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          // Find the specific book issuance by id
          const foundBook = response.data.data.izdate.find(
            (borrow) => borrow.id === parseInt(id)
          );

          if (foundBook) {
            setBook(foundBook);
          } else {
            setError("Book issuance not found");
          }

          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchBookDetails(); // Fetch details
    }
  }, [id, book]);

  if (loading) {
    return <Spinner />; // Using Spinner component
  }

  if (error) {
    return <div>Error:</div>;
  }

  return (
    <div class="book-details-container">
      <div class="book-details-content ">
      <h1>{book.knjiga.title}</h1>
      </div>
      <div class="book-info-section">
        <p>
          Author:{" "}
          {book.knjiga.authors
            .map((author) => `${author.name} ${author.surname}`)
            .join(", ")}
        </p>
        <p>
          Category: {book.knjiga.categories.map((cat) => cat.name).join(", ")}
        </p>
        <p>
          Genres: {book.knjiga.genres.map((genre) => genre.name).join(", ")}
        </p>
        <p>Publisher: {book.knjiga.publisher.name}</p>
        <p>Language: {book.knjiga.language.name}</p>
        <p>Binding: {book.knjiga.bookbind.name}</p>
        <p>Format: {book.knjiga.format.name}</p>
        <p>Pages: {book.knjiga.pages}</p>
        <p>Published Date: {book.knjiga.pDate}</p>
        <p>Description: {book.knjiga.description}</p>
        <p>
          Borrowed by: {book.student.name} {book.student.surname}
        </p>
        <p>Borrow Date: {book.borrow_date}</p>
        <p>Return Date: {book.return_date || "Not yet returned"}</p>
        <p>
          Librarian: {book.bibliotekar0.name} {book.bibliotekar0.surname}
        </p>
      </div>
    </div>
  );
};

export default PublishingDetail;
