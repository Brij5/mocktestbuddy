import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamDetails } from '../store/slices/examSlice'; 
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const ExamInstructionsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select the current exam details from the Redux store
  const { data: examDetails, status, error } = useSelector((state) => state.exams.currentExamDetails);
  const loading = status === 'loading' || status === 'idle'; // Consider idle as loading initially

  useEffect(() => {
    if (examId) {
      // Fetch details only if they are not already loaded or loading for this examId
      // Basic check: Dispatch if status is 'idle'
      if (status === 'idle') { // More robust check might compare examId if needed
        dispatch(fetchExamDetails(examId));
      }
    }
  }, [dispatch, examId, status]); // Depend on status to trigger fetch if needed

  const handleStartExam = () => {
    // TODO: Navigate to the actual exam taking page
    console.log('Starting exam:', examId);
    // navigate(`/exam/${examId}/attempt`); // Example future navigation
    alert('Exam taking page not implemented yet.');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exam Instructions
      </Typography>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">Error loading exam details: {error}</Alert>}
      
      {!loading && !error && status === 'succeeded' && examDetails ? (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h5" gutterBottom>{examDetails.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Category: {examDetails.category?.name || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {examDetails.description}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Instructions:</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary={`Duration: ${examDetails.durationMinutes} minutes`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Total Marks: ${examDetails.totalMarks}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Passing Marks: ${examDetails.passingMarks}`} />
                </ListItem>
                {/* Add more specific instructions here */}
                 <ListItem>
                  <ListItemText primary={`Ensure you have a stable internet connection.`} />
                </ListItem>
                 <ListItem>
                  <ListItemText primary={`The test will submit automatically once the time is up.`} />
                </ListItem>
              </List>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleStartExam}
              >
                Start Exam Now
              </Button>
            </Box>
          </Paper>
        ) : (
         // Show placeholder only if not loading and no success/error yet
         !loading && status !== 'failed' && <Typography sx={{mt: 2}}>Loading exam details...</Typography> 
        )}

        {/* Button to go back (optional) */} 
        <Button onClick={() => navigate(-1)} sx={{mt: 2}}>Go Back</Button>
    </Container>
  );
};

export default ExamInstructionsPage;
