import React, { useState } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Menu, MenuItem, IconButton, Button, Checkbox, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const initialLetters = ['Cirilica', 'Latinica', 'Cirilica 2', 'Latinica 2'];

const BookLetter = () => {
  const [letters, setLetters] = useState(initialLetters);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newLetterName, setNewLetterName] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);

  const handleMenuClick = (event, letter) => {
    setAnchorEl(event.currentTarget);
    setSelectedLetter(letter);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setNewLetterName('');
    setIsDialogOpen(true);
  };

  const handleEditClick = () => {
    setIsEdit(true);
    setNewLetterName(selectedLetter);
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setLetters(letters.filter(letter => letter !== selectedLetter));
    setSelectedLetters(selectedLetters.filter(letter => letter !== selectedLetter));
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogSave = () => {
    if (isEdit) {
      setLetters(letters.map(letter => (letter === selectedLetter ? newLetterName : letter)));
    } else {
      setLetters([...letters, newLetterName]);
    }
    setIsDialogOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedLetters(letters);
    } else {
      setSelectedLetters([]);
    }
  };

  const handleSelectClick = (event, letter) => {
    if (event.target.checked) {
      setSelectedLetters([...selectedLetters, letter]);
    } else {
      setSelectedLetters(selectedLetters.filter(selectedLetter => selectedLetter !== letter));
    }
  };

  return (
    <div style={{ width: '100%', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
      <Button variant="contained" color="primary" startIcon={<FaPlus />} onClick={handleAddClick}>
        New Letter
      </Button>
      </div>
      <table className="room-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>
              <Checkbox
                checked={selectedLetters.length === letters.length}
                indeterminate={selectedLetters.length > 0 && selectedLetters.length < letters.length}
                onChange={handleSelectAllClick}
              />
            </th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Naziv pisma</th>
            <th style={{ padding: '10px', textAlign: 'left' }}></th>
          </tr>
        </thead>
        <tbody>
          {letters.map((letter, index) => (
            <tr key={letter} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <Checkbox
                  checked={selectedLetters.includes(letter)}
                  onChange={(e) => handleSelectClick(e, letter)}
                />
              </td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{letter}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <IconButton onClick={(e) => handleMenuClick(e, letter)}>
                  <FaEllipsisV />
                </IconButton>
                <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                  <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isEdit ? 'Edit Letter' : 'Add New Letter'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Letter Name"
            fullWidth
            value={newLetterName}
            onChange={(e) => setNewLetterName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookLetter;
