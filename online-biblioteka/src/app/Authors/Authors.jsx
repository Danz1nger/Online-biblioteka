import React, { useState, useEffect } from "react";
import "./Authors.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { Menu, MenuItem, CircularProgress } from "@mui/material";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const navigate = useNavigate();

  const fetchAuthors = async () => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await axios.get(
        "https://biblioteka.simonovicp.com/api/authors",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      const authors = response.data.data;
      setAuthors(authors);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedAuthor(id);
  };

  const handleMenuClose = (action) => {
    if (action === "Brisanje") {
      handleDeleteAuthor(selectedAuthor);
    } else if (action === "Pregled") {
      navigate(`/authors/author/${selectedAuthor}`);
    } else if (action === "Update") {
      navigate(`/authors/author/${selectedAuthor}/edit`);
    }
    setAnchorEl(null);
    setSelectedAuthor(null); // greska u prvom djelu (selectedAuthors(null))
  };

  const handleDeleteAuthor = async (authorId) => {
    const token = localStorage.getItem("jwt");
    setLoading(true); 
    
    try {
      await axios.delete(`https://biblioteka.simonovicp.com/api/authors/${authorId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        }
      });
  
      setAuthors(authors.filter((author) => author.id !== authorId));
      console.log(`Author with ID ${authorId} has been successfully deleted.`);
  
      handleMenuClose();
    } catch (err) {
      console.error("Error deleting author:", err);
      setError('Failed to delete author. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  const newAuthor = () => {
    navigate("/authors/add");
  };

  if (loading) {
    return <div className="spinner-container"><CircularProgress /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Sidebar />
      <Header />
      <div className="authori-content">
        <button className="new-author-btn" onClick={newAuthor}>
          <FontAwesomeIcon icon={faPlus} /> NOVI AUTOR
        </button>
        <table className="authori-table">
          <thead>
            <tr>
              <th>Ime </th>
              <th>Prezime</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={author.id}>
                <td>{author.name}</td>
                <td>{author.surname}</td>
                <td className="actions">
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    onClick={(event) => handleMenuOpen(event, author.id)}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedAuthor === author.id}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                      style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleMenuClose("Pregled")}>Pregled autora</MenuItem>
                    <MenuItem onClick={() => handleMenuClose("Update")}>Update autora</MenuItem>
                    <MenuItem onClick={() => handleMenuClose("Brisanje")}>Brisanje autora</MenuItem>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Authors;
