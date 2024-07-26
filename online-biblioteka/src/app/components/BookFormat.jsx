import React, { useState } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Menu, MenuItem, IconButton, Button, Checkbox, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const initialFormats = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'];

const BookFormats = () => {
  const [formats, setFormats] = useState(initialFormats);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newFormatName, setNewFormatName] = useState('');
  const [selectedFormats, setSelectedFormats] = useState([]);

  const handleMenuClick = (event, format) => {
    setAnchorEl(event.currentTarget);
    setSelectedFormat(format);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setNewFormatName('');
    setIsDialogOpen(true);
  };

  const handleEditClick = () => {
    setIsEdit(true);
    setNewFormatName(selectedFormat);
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setFormats(formats.filter(format => format !== selectedFormat));
    setSelectedFormats(selectedFormats.filter(format => format !== selectedFormat));
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogSave = () => {
    if (isEdit) {
      setFormats(formats.map(format => (format === selectedFormat ? newFormatName : format)));
    } else {
      setFormats([...formats, newFormatName]);
    }
    setIsDialogOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedFormats(formats);
    } else {
      setSelectedFormats([]);
    }
  };

  const handleSelectClick = (event, format) => {
    if (event.target.checked) {
      setSelectedFormats([...selectedFormats, format]);
    } else {
      setSelectedFormats(selectedFormats.filter(selectedFormat => selectedFormat !== format));
    }
  };

  return (
    <div style={{ width: '100%', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
      <Button variant="contained" color="primary" startIcon={<FaPlus />} onClick={handleAddClick}>
        New Format
      </Button>
      </div>
      <table className="room-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>
              <Checkbox
                checked={selectedFormats.length === formats.length}
                indeterminate={selectedFormats.length > 0 && selectedFormats.length < formats.length}
                onChange={handleSelectAllClick}
              />
            </th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Naziv formata</th>
            <th style={{ padding: '10px', textAlign: 'left' }}></th>
          </tr>
        </thead>
        <tbody>
          {formats.map((format, index) => (
            <tr key={format} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <Checkbox
                  checked={selectedFormats.includes(format)}
                  onChange={(e) => handleSelectClick(e, format)}
                />
              </td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{format}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <IconButton onClick={(e) => handleMenuClick(e, format)}>
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
        <DialogTitle>{isEdit ? 'Edit Format' : 'Add New Format'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Format Name"
            fullWidth
            value={newFormatName}
            onChange={(e) => setNewFormatName(e.target.value)}
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

export default BookFormats;
