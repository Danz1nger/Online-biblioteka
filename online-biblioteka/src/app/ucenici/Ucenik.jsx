import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, CardContent, Typography, Avatar, List, ListItem, 
  ListItemText, Divider, CircularProgress, Button, TextField,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/system';
import './Ucenici.css';

const StyledCard = styled(Card)({
  maxWidth: 600,
  margin: '20px auto',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  position: 'relative',
});

const StyledAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  margin: '0 auto 20px',
});

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const Ucenik = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(location.pathname.endsWith('/edit'));
  const [editedStudent, setEditedStudent] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchStudentData = useCallback(async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.get(`https://biblioteka.simonovicp.com/api/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setStudent(response.data.data);
      setEditedStudent(response.data.data);
      setIssuedBooks(response.data.data.issuedBooks || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudentData();
    setEditMode(location.pathname.endsWith('/edit'));
  }, [fetchStudentData, location]);

  const handleEdit = useCallback(() => {
    navigate(`/ucenici/ucenik/${id}/edit`);
  }, [id, navigate]);

  const handleCancel = () => {
    setEditMode(false);
    setEditedStudent(student);
  };

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setEditedStudent({ ...editedStudent, photoPath: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.put(`https://biblioteka.simonovicp.com/api/users/${id}`, editedStudent, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setStudent(response.data.data);
      setEditMode(false);
      navigate('/ucenici');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('jwt');
    try {
      await axios.delete(`https://biblioteka.simonovicp.com/api/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/ucenici');
    } catch (err) {
      setError(err.message);
    }
    setOpenDeleteDialog(false);
  };

  if (loading) return (
    <div className="students-container">
      <div className="spinner-container">
        <CircularProgress />
      </div>
    </div>
  );

  if (error) return (
    <div className="students-container">
      <Typography color="error">Error: {error}</Typography>
    </div>
  );

  if (!student) return (
    <div className="students-container">
      <Typography>No student found</Typography>
    </div>
  );

  return (
    <div className="students-container">
      <StyledCard>
        <IconButton 
          aria-label="delete"
          onClick={handleDeleteClick}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: 'red'
          }}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton 
          aria-label="edit"
          onClick={handleEdit}
          style={{
            position: 'absolute',
            top: '10px',
            right: '50px',
            color: 'blue'
          }}
        >
          <EditIcon />
        </IconButton>
        <CardContent>
          <StyledAvatar 
            src={editMode ? editedStudent.photoPath : student.photoPath || 'https://biblioteka.simonovicp.com/img/profile.jpg'} 
            alt={`${student.name} ${student.surname}`} 
          />
          {!editMode ? (
            <>
              <Typography variant="h4" gutterBottom align="center">
                {student.name} {student.surname}
              </Typography>
              <Typography variant="subtitle1" gutterBottom align="center">
                {student.email}
              </Typography>
              <Divider style={{ margin: '20px 0' }} />
              <Typography variant="h6" gutterBottom>
                User Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="User ID" secondary={student.id} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Username" secondary={student.username} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="JMBG" secondary={student.jmbg} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Role" secondary={student.role} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Last Access" secondary={student.lastAccess || 'N/A'} />
                </ListItem>
              </List>
            </>
          ) : (
            <StyledForm onSubmit={handleSubmit}>
              <TextField
                name="photoPath"
                label="Photo URL"
                value={editedStudent.photoPath || ''}
                onChange={handlePhotoChange}
                fullWidth
              />
              <TextField
                name="name"
                label="Name"
                value={editedStudent.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="surname"
                label="Surname"
                value={editedStudent.surname}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="email"
                label="Email"
                value={editedStudent.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="username"
                label="Username"
                value={editedStudent.username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="jmbg"
                label="JMBG"
                value={editedStudent.jmbg}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="password"
                label="New Password"
                type="password"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="password_confirmation"
                label="Confirm New Password"
                type="password"
                onChange={handleChange}
                fullWidth
              />
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </StyledForm>
          )}
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6" gutterBottom>
            Issued Books
          </Typography>
          {issuedBooks.length > 0 ? (
            <List>
              {issuedBooks.map((book, index) => (
                <ListItem key={index}>
                  <ListItemText primary={book.title} secondary={`Issue Date: ${book.issueDate}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No books currently issued</Typography>
          )}
        </CardContent>
      </StyledCard>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(Ucenik);