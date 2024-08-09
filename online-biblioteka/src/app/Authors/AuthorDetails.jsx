import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

const AuthorDetails = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      const token = localStorage.getItem("jwt");
      try {
        const response = await axios.get(
          `https://biblioteka.simonovicp.com/api/authors/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAuthor(response.data.data); // Postavljamo podatke o autoru
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!author) {
    return <div>Author not found</div>;
  }

  return (
    <div>
        <Header/>
        <Sidebar/>
    <div className="author-details-container">
      <div className="author-details-content">
        {author.image && <img src={author.image} alt={`${author.name} ${author.surname}`} />}
        <h1>Detalji o {author.name} {author.surname}</h1>
        <p><strong>Ime:</strong> {author.name}</p>
        <p><strong>Prezime:</strong> {author.surname}</p>
        {author.bio && <p><strong>Opis:</strong> {author.bio}</p>}
      </div>
    </div>
    </div>
  );
};

export default AuthorDetails;
