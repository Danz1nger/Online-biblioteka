import React, { useState, useEffect } from "react";
import "./Bibliotekari.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, MenuItem, CircularProgress } from "@mui/material";

const Bibliotekari = () => {
  const [bibliotekari, setBibliotekari] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBibliotekar, setSelectedBibliotekar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchLibrarians = async () => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await axios.get(
        "https://biblioteka.simonovicp.com/api/users",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      const filteredLibrarians = response.data.data.filter(
        (user) => user.role === "Bibliotekar"
      );
      setBibliotekari(filteredLibrarians);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrarians();
  }, []);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedBibliotekar(id);
  };

  const handleMenuClose = (action) => {
    if (action === "Brisanje") {
      handleDeleteBibliotekar(selectedBibliotekar);
    } else if (action === "Pregled") {
      navigate(`/bibliotekari/bibliotekar/${selectedBibliotekar}`);
    } else if (action === "Update") {
      navigate(`/bibliotekari/bibliotekar/${selectedBibliotekar}/edit`);
    }
    setAnchorEl(null);
    setSelectedBibliotekar(null);
  };

  const handleDeleteBibliotekar = async (userId) => {
    const token = localStorage.getItem("jwt");
    setLoading(true);

    try {
      await axios.delete(`https://biblioteka.simonovicp.com/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        }
      });

      setBibliotekari(bibliotekari.filter((bibliotekar) => bibliotekar.id !== userId));
      console.log(`Bibliotekar sa ID-jem ${userId} je uspešno obrisan.`);
      
      handleMenuClose();
    } catch (err) {
      console.error("Error deleting librarian:", err);
      // Error handling removed, React Toastify will handle it
    } finally {
      setLoading(false);
    }
  };
  

  const newBibliotekar = () => {
    navigate("/bibliotekari/add");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div className="spinner-container"><CircularProgress /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bibliotekari-content">
      <h1>Bibliotekari</h1>
      <div className="actions-container">
        <button className="new-bibliotekar-btn" onClick={newBibliotekar}>
          <FontAwesomeIcon icon={faPlus} /> NOVI BIBLIOTEKAR
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Pretraži bibliotekare..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
      <table className="bibliotekari-table">
        <thead>
          <tr>
            <th>Ime i prezime</th>
            <th>Email</th>
            <th>Tip korisnika</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bibliotekari.map((user) => (
            <tr key={user.id}>
              <td>
                <input type="checkbox" />
                <img src={user.photoPath} alt="img" className="profile-pic" />
                {user.name} {user.surname}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="actions">
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  onClick={(event) => handleMenuOpen(event, user.id)}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedBibliotekar === user.id}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: '20ch',
                    },
                  }}
                >
                  <MenuItem onClick={() => handleMenuClose("Pregled")}>Pregled korisnika</MenuItem>
                  <MenuItem onClick={() => handleMenuClose("Update")}>Update korisnika</MenuItem>
                  <MenuItem onClick={() => handleMenuClose("Brisanje")}>Brisanje korisnika</MenuItem>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bibliotekari;