import React, { useState } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Menu, MenuItem, IconButton, Button, Checkbox, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const initialCovers = [
  'Tvrdi povez',
  'Meki povez',
  'Koricenje spiralom',
  'Klamovanje',
  'Kozni povez',
  'Umjetnicki povez',
  'Francuski povez'
];

const BookCover = () => {
  const [covers, setCovers] = useState(initialCovers);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newCoverName, setNewCoverName] = useState('');
  const [selectedCovers, setSelectedCovers] = useState([]);

  const handleMenuClick = (event, cover) => {
    setAnchorEl(event.currentTarget);
    setSelectedCover(cover);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setNewCoverName('');
    setIsDialogOpen(true);
  };

  const handleEditClick = () => {
    setIsEdit(true);
    setNewCoverName(selectedCover);
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setCovers(covers.filter(cover => cover !== selectedCover));
    setSelectedCovers(selectedCovers.filter(cover => cover !== selectedCover));
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogSave = () => {
    if (isEdit) {
      setCovers(covers.map(cover => (cover === selectedCover ? newCoverName : cover)));
    } else {
      setCovers([...covers, newCoverName]);
    }
    setIsDialogOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedCovers(covers);
    } else {
      setSelectedCovers([]);
    }
  };

  const handleSelectClick = (event, cover) => {
    if (event.target.checked) {
      setSelectedCovers([...selectedCovers, cover]);
    } else {
      setSelectedCovers(selectedCovers.filter(selectedCover => selectedCover !== cover));
    }
  };

  return (
    <div style={{ width: '100%', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" startIcon={<FaPlus />} onClick={handleAddClick}>
          New Cover
        </Button>
      </div>
      <table className="room-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>
              <Checkbox
                checked={selectedCovers.length === covers.length}
                indeterminate={selectedCovers.length > 0 && selectedCovers.length < covers.length}
                onChange={handleSelectAllClick}
              />
            </th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Naziv Poveza</th>
            <th style={{ padding: '10px', textAlign: 'left' }}></th>
          </tr>
        </thead>
        <tbody>
          {covers.map((cover, index) => (
            <tr key={cover} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <Checkbox
                  checked={selectedCovers.includes(cover)}
                  onChange={(e) => handleSelectClick(e, cover)}
                />
              </td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{cover}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <IconButton onClick={(e) => handleMenuClick(e, cover)}>
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
        <DialogTitle>{isEdit ? 'Edit Cover' : 'Add New Cover'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cover Name"
            fullWidth
            value={newCoverName}
            onChange={(e) => setNewCoverName(e.target.value)}
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

export default BookCover;
