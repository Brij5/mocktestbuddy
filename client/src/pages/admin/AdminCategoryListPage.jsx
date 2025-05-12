import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../store/slices/examSlice'; 

const AdminCategoryListPage = () => {
  const dispatch = useDispatch();
  const { 
    categories, 
    categoryStatus: status, 
    categoryError: error 
  } = useSelector((state) => state.exams);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

  const handleOpenDialog = () => {
    setCategoryName('');
    setCategoryDescription('');
    setDialogOpen(true);
    setIsSubmitting(false); 
    setSubmitError(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategoryId(null);
  };

  const handleDialogSubmit = async () => { 
    if (!categoryName.trim()) {
      setSubmitError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const categoryData = { name: categoryName, description: categoryDescription };

      if (editingCategoryId) {
        await dispatch(updateCategory({ categoryId: editingCategoryId, categoryData })).unwrap();
      } else {
        await dispatch(createCategory(categoryData)).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      setSubmitError(err || 'Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAddDialog = () => {
    handleOpenDialog();
  };

  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find(cat => cat._id === categoryId);
    if (categoryToEdit) {
      setEditingCategoryId(categoryId);
      setCategoryName(categoryToEdit.name);
      setCategoryDescription(categoryToEdit.description || '');
      setDialogOpen(true);
      setIsSubmitting(false);
      setSubmitError(null);
    }
  };

  const handleOpenConfirmDelete = (categoryId) => {
    setCategoryToDeleteId(categoryId);
    setConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setCategoryToDeleteId(null);
    setConfirmDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDeleteId) {
      try {
        await dispatch(deleteCategory(categoryToDeleteId)).unwrap();
      } catch (err) {
        console.error('Failed to delete category:', err);
        alert(`Failed to delete category: ${err}`);
      } finally {
        handleCloseConfirmDelete();
      }
    }
  };

  const handleDeleteCategoryClick = (categoryId) => {
    handleOpenConfirmDelete(categoryId);
  };

  let content;

  if (status === 'loading') {
    content = <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  } else if (status === 'failed') {
    content = <Alert severity="error" sx={{ mt: 2 }}>Error loading categories: {error}</Alert>;
  } else if (status === 'succeeded' && categories.length === 0) {
    content = <Typography sx={{ mt: 2 }}>No categories found. Add one!</Typography>;
  } else if (status === 'succeeded') {
    content = (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    aria-label="edit" 
                    size="small" 
                    onClick={() => handleEditCategory(category._id)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon fontSize="small"/>
                  </IconButton>
                  <IconButton 
                    aria-label="delete" 
                    size="small" 
                    onClick={() => handleDeleteCategoryClick(category._id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small"/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Manage Exam Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Category
        </Button>
      </Box>
      {content}

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editingCategoryId ? 'Edit Exam Category' : 'Add New Exam Category'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {editingCategoryId
              ? 'Please update the details for this exam category.'
              : 'Please enter the details for the new exam category.'}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            error={!!submitError}
            helperText={submitError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleDialogSubmit} 
            disabled={isSubmitting || !categoryName.trim()}
          >
            {isSubmitting ? (editingCategoryId ? 'Saving...' : 'Adding...') : (editingCategoryId ? 'Save Changes' : 'Add Category')}
          </Button> 
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCategoryListPage;
