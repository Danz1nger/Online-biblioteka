import React, { useState } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Menu, MenuItem, IconButton, Button, Checkbox, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const initialCategories = [
  'Hrana i pice',
  'Djecije knjige',
  'Istorija',
  'Skolske knjige',
  'Nauka, priroda i matematika',
  'Pravo'
];

const BookCategories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setNewCategoryName('');
    setIsDialogOpen(true);
  };

  const handleEditClick = () => {
    setIsEdit(true);
    setNewCategoryName(selectedCategory);
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setCategories(categories.filter(category => category !== selectedCategory));
    setSelectedCategories(selectedCategories.filter(category => category !== selectedCategory));
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogSave = () => {
    if (isEdit) {
      setCategories(categories.map(category => (category === selectedCategory ? newCategoryName : category)));
    } else {
      setCategories([...categories, newCategoryName]);
    }
    setIsDialogOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectClick = (event, category) => {
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== category));
    }
  };

  return (
    <div style={{ width: '100%', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" startIcon={<FaPlus />} onClick={handleAddClick}>
          New Category
        </Button>
      </div>
      <table className="category-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>
              <Checkbox
                checked={selectedCategories.length === categories.length}
                indeterminate={selectedCategories.length > 0 && selectedCategories.length < categories.length}
                onChange={handleSelectAllClick}
              />
            </th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Naziv Kategorije</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Opis</th>
            <th style={{ padding: '10px', textAlign: 'left' }}></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => handleSelectClick(e, category)}
                />
              </td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{category}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>Lorem ipsum</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <IconButton onClick={(e) => handleMenuClick(e, category)}>
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
        <DialogTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
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

export default BookCategories;
