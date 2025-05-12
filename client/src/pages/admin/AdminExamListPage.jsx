import React, { useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAllExamsAdmin } from '../../store/slices/examSlice';

const AdminExamListPage = () => {
  const dispatch = useDispatch();

  // --- Select state from Redux ---
  const { allExams, allExamsStatus, allExamsError } = useSelector((state) => state.exams);

  useEffect(() => {
    // Fetch exams if the status is 'idle'
    if (allExamsStatus === 'idle') {
      dispatch(fetchAllExamsAdmin());
    }
  }, [dispatch, allExamsStatus]);

  const handleAddExam = () => {
    // TODO: Navigate to Add Exam page or open modal
    alert('Add exam functionality not implemented yet.');
  };

  const handleEditExam = (examId) => {
    // TODO: Navigate to Edit Exam page or open modal
    alert(`Edit exam ${examId} functionality not implemented yet.`);
  };

  const handleDeleteExam = (examId) => {
    // TODO: Implement delete confirmation and action
    alert(`Delete exam ${examId} functionality not implemented yet.`);
  };

  let content;

  if (allExamsStatus === 'loading') {
    content = <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  } else if (allExamsStatus === 'failed') {
    content = <Alert severity="error" sx={{ mt: 2 }}>Error loading exams: {allExamsError}</Alert>;
  } else if (allExamsStatus === 'succeeded' && allExams.length === 0) {
    content = <Typography sx={{ mt: 2 }}>No exams found. Add one!</Typography>;
  } else if (allExamsStatus === 'succeeded' && allExams.length > 0) {
    content = (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Duration (Mins)</TableCell>
              <TableCell>Total Marks</TableCell>
              <TableCell>Is Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allExams.map((exam) => (
              <TableRow key={exam._id}>
                <TableCell>{exam.name}</TableCell>
                <TableCell>{exam.category?.name || 'N/A'}</TableCell> {/* Display category name */}
                <TableCell>{exam.durationMinutes}</TableCell>
                <TableCell>{exam.totalMarks}</TableCell>
                <TableCell>{exam.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={() => handleEditExam(exam._id)} // Use handler
                    sx={{ mr: 1 }}
                  >
                    <EditIcon fontSize="small"/>
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDeleteExam(exam._id)} // Use handler
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
  } else { // Default to idle state before fetch starts
    content = <Typography sx={{ mt: 2 }}>Loading exams...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Manage Exams
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddExam}
        >
          Add Exam
        </Button>
      </Box>
      {content}
    </Container>
  );
};

export default AdminExamListPage;
