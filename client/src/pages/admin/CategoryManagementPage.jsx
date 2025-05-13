import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Container,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@store/slices/categorySlice';

const CategoryManagementPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [formCategoryData, setFormCategoryData] = useState({ _id: null, name: '', description: '' });
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenDialog = (mode = 'add', category = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && category) {
      setFormCategoryData({ _id: category._id, name: category.name, description: category.description });
    } else {
      setFormCategoryData({ _id: null, name: '', description: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormCategoryData({ _id: null, name: '', description: '' });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormCategoryData({ ...formCategoryData, [name]: value });
  };

  const handleSubmit = () => {
    if (dialogMode === 'add') {
      const { name, description } = formCategoryData;
      dispatch(createCategory({ name, description }));
    } else if (formCategoryData._id) {
      const { _id, name, description } = formCategoryData;
      dispatch(updateCategory({ id: _id, categoryData: { name, description } }));
    }
    handleCloseDialog();
  };

  const handleOpenConfirmDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setOpenConfirmDeleteDialog(true);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setCategoryToDelete(null);
    setOpenConfirmDeleteDialog(false);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete && categoryToDelete._id) {
      dispatch(deleteCategory(categoryToDelete._id));
    }
    handleCloseConfirmDeleteDialog();
  };

  if (loading === 'pending') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Manage Exam Categories
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
            disabled={loading === 'pending'}
          >
            Add New Category
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </Alert>
        )}

        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  category.isActive !== false && (
                    <TableRow key={category._id} hover>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Category">
                          <span>
                            <IconButton
                              onClick={() => handleOpenDialog('edit', category)}
                              color="primary"
                              disabled={loading === 'pending'}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete Category (Deactivate)">
                          <span>
                            <IconButton
                              onClick={() => handleOpenConfirmDeleteDialog(category)}
                              color="error"
                              disabled={loading === 'pending'}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No active categories found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{dialogMode === 'add' ? 'Add New Category' : 'Edit Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formCategoryData.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formCategoryData.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading === 'pending' || !formCategoryData.name.trim()}>
            {dialogMode === 'add' ? 'Add Category' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmDeleteDialog}
        onClose={handleCloseConfirmDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete the category "<strong>{categoryToDelete?.name}</strong>"?
            This action will mark the category as inactive but will not permanently remove it.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseConfirmDeleteDialog} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained" autoFocus disabled={loading === 'pending'}>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryManagementPage;
