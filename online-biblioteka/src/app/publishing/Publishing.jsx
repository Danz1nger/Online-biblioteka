import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // For 3 vertical dots
import "./Publishing.css";
import dayjs from "dayjs"; // Using dayjs to calculate retention
import { useNavigate } from "react-router-dom";

const Publishing = () => {
  const [booksData, setBooksData] = useState({
    izdate: [],
    prekoracene: [],
    vracene: [],
    otpisane: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("izdate"); // Default category
  const [selectedBooks, setSelectedBooks] = useState([]); // For managing selected checkboxes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [anchorEl, setAnchorEl] = useState(null); // Kebab menu anchor
  const [currentBook, setCurrentBook] = useState(null); // Book for the kebab menu actions

  const navigate = useNavigate(); // Add this hook

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwt"); // Get token from local storage
      setLoading(true);
      try {
        const response = await axios.get(
          "https://biblioteka.simonovicp.com/api/books/borrows",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token in the header
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        setBooksData(response.data.data); // Set the fetched data
        setLoading(false);
      } catch (err) {
        setError(err.message); // Handle and set error message
        setLoading(false);
      }
    };

    fetchData(); // Call the async function to fetch data
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedBooks(booksData[selectedCategory]);
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectClick = (event, book) => {
    if (event.target.checked) {
      setSelectedBooks([...selectedBooks, book]);
    } else {
      setSelectedBooks(
        selectedBooks.filter((selectedBook) => selectedBook !== book)
      );
    }
  };

  const calculateRetention = (borrowDate) => {
    const borrow = dayjs(borrowDate);
    const today = dayjs();
    return today.diff(borrow, "days") + " days";
  };

  const handleSearch = () => {
    // This filters books based on the search term
    return booksData[selectedCategory].filter((book) =>
      book.knjiga.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleMenuClick = (event, book) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
    setCurrentBook(book); // Set the book related to the kebab menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentBook(null); // Clear current book when menu closes
  };

  const handleAction = (action, book) => {
    if (action === "view") {
      navigate(`/publishing/${currentBook.id}`, { state: { book } });
    } else if (action === "writeOff") {
      alert(`Writing off the book: ${currentBook.knjiga.title}`);
    } else if (action === "return") {
      alert(`Returning the book: ${currentBook.knjiga.title}`);
    }
    handleMenuClose();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="publishing-container">
      <div className="publishing-sidebar">
        <Button
          variant={selectedCategory === "izdate" ? "contained" : "text"}
          onClick={() => setSelectedCategory("izdate")}
        >
          Borrowed Books
        </Button>
        <Button
          variant={selectedCategory === "vracene" ? "contained" : "text"}
          onClick={() => setSelectedCategory("vracene")}
        >
          Returned Books
        </Button>
        <Button
          variant={selectedCategory === "prekoracene" ? "contained" : "text"}
          onClick={() => setSelectedCategory("prekoracene")}
        >
          Overdue Books
        </Button>
        <Button
          variant={selectedCategory === "active" ? "contained" : "text"}
          onClick={() => setSelectedCategory("active")}
        >
          Active Reservations
        </Button>
        <Button
          variant={selectedCategory === "archive" ? "contained" : "text"}
          onClick={() => setSelectedCategory("archive")}
        >
          Archived Reservations
        </Button>
      </div>

      <div className="content">
        <h1>
          {selectedCategory.charAt(0).toUpperCase() +
            selectedCategory
              .slice(1)
              .replace("izdate", "Borrowed Books")
              .replace("vracene", "Returned Books")}
        </h1>

        {/* Search Bar */}
        <div className="search-container">
          <TextField
            label="Search by Title"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            style={{ marginLeft: "10px" }}
          >
            Search
          </Button>
        </div>

        {/* Table */}
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={
                      selectedBooks.length ===
                        booksData[selectedCategory].length &&
                      booksData[selectedCategory].length > 0
                    }
                    indeterminate={
                      selectedBooks.length > 0 &&
                      selectedBooks.length < booksData[selectedCategory].length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell className="TableCellHeader">
                  Name of the Book
                </TableCell>
                <TableCell className="TableCellHeader">Rented To</TableCell>
                <TableCell className="TableCellHeader">Date of Rent</TableCell>
                <TableCell className="TableCellHeader">
                  Date of Return
                </TableCell>
                <TableCell className="TableCellHeader">Retention</TableCell>
                <TableCell className="TableCellHeader">Rented By</TableCell>
                <TableCell className="TableCellHeader">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch().length > 0 ? (
                handleSearch().map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBooks.includes(book)}
                        onChange={(e) => handleSelectClick(e, book)}
                      />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={book.knjiga.photo || "placeholder.jpg"} // Placeholder za knjige koje nemaju sliku
                          alt={book.knjiga.title}
                          style={{
                            width: "50px",
                            height: "auto",
                            marginRight: "10px",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#333",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          {book.knjiga.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{`${book.student.name} ${book.student.surname}`}</TableCell>
                    <TableCell>{book.borrow_date}</TableCell>
                    <TableCell>{book.return_date || "Not returned"}</TableCell>
                    <TableCell>
                      {calculateRetention(book.borrow_date)}
                    </TableCell>
                    <TableCell>{`${book.bibliotekar0.name} ${book.bibliotekar0.surname}`}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, book)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleAction("view")}>
                          View Details
                        </MenuItem>
                        <MenuItem onClick={() => handleAction("writeOff")}>
                          Write off the book
                        </MenuItem>
                        <MenuItem onClick={() => handleAction("return")}>
                          Return the book
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Publishing;
