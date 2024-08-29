import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Genres.css";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Settings from "../components/Settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  Checkbox,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newGenreName, setNewGenreName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const token = localStorage.getItem("jwt");
      try {
        const response = await axios.get(
          "https://biblioteka.simonovicp.com/api/books",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const books = response.data.data;
        const genresSet = new Set();

        books.forEach((book) => {
          book.genres.forEach((genre) => {
            genresSet.add(JSON.stringify(genre));
          });
        });

        const uniqueGenres = Array.from(genresSet).map((item) =>
          JSON.parse(item)
        );

        setGenres(uniqueGenres);
        setSuccessMessage("Genres fetched successfully!");
      } catch (err) {
        setError(err.message);
        setSuccessMessage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);



  const handleMenuOpen = (event, genre) => {
    setAnchorEl(event.currentTarget);
    setSelectedGenre(genre);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGenre(null);
  };

  const handleAction = (action) => {
    alert(`${action} genre with ID: ${selectedGenre.id}`);
    handleMenuClose();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const addGenre = async (newGenre) => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await axios.post(
        "https://biblioteka.simonovicp.com/api/genres",
        { name: newGenre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Failed to add genre:", err);
      throw err;
    }
  };

  const handleAddGenre = async () => {
    try {
      const result = await addGenre(newGenreName);
      setGenres([...genres, result.data]);
      setNewGenreName("");
      handleCloseModal();
      setSuccessMessage("Genre added successfully!");
    } catch (err) {
      setError("Failed to add genre.");
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedGenres(genres.map((genre) => genre.id));
    } else {
      setSelectedGenres([]);
    }
  };

  const handleSelectClick = (event, genreId) => {
    if (event.target.checked) {
      setSelectedGenres([...selectedGenres, genreId]);
    } else {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <Settings />

      <div className="container">
        <div className="content">
          <div className="content-header">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
            >
              <FontAwesomeIcon icon={faPlus} /> Novi žanr
            </Button>
          </div>
          <div className="table-container">
            {loading ? (
              <CircularProgress />
            ) : genres.length ? (
              <table className="genres-table">
                <thead>
                  <tr>
                    <th>
                      <Checkbox
                        checked={selectedGenres.length === genres.length}
                        indeterminate={
                          selectedGenres.length > 0 &&
                          selectedGenres.length < genres.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </th>
                    <th>Naziv žanra</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {genres.map((genre) => (
                    <tr key={genre.id}>
                      <td>
                        <Checkbox
                          checked={selectedGenres.includes(genre.id)}
                          onChange={(e) => handleSelectClick(e, genre.id)}
                        />
                      </td>
                      <td>{genre.name}</td>
                      <td className="actions">
                        <div className="actions-container">
                          <IconButton
                            onClick={(event) => handleMenuOpen(event, genre)}
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && selectedGenre === genre}
                            onClose={handleMenuClose}
                          >
                            <MenuItem onClick={() => handleAction("Pogledaj")}>
                              Pogledaj
                            </MenuItem>
                            <MenuItem onClick={() => handleAction("Izmijeni")}>
                              Izmijeni
                            </MenuItem>
                            <MenuItem onClick={() => handleAction("Obriši")}>
                              Obriši
                            </MenuItem>
                          </Menu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No genres available.</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            width: 400,
            padding: 4,
            margin: "auto",
            marginTop: "20vh",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Genre
          </Typography>
          <TextField
            id="modal-description"
            label="Genre Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleCloseModal}
              color="secondary"
              sx={{ marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGenre}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Genres;
