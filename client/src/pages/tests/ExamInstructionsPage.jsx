import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamDetails } from '../../store/slices/examSlice'; // Corrected import path
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
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';

const ExamInstructionsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: examDetails, status, error } = useSelector((state) => state.exams.currentExamDetails);
  const loading = status === 'loading' || status === 'idle';

  useEffect(() => {
    if (examId) {
      // Fetch details only if they are not already loaded for this examId, or if status indicates a retry is needed.
      if (!examDetails || examDetails._id !== examId || status === 'failed') {
        dispatch(fetchExamDetails(examId));
      }
    }
  }, [dispatch, examId, examDetails, status]);

  const handleStartExam = () => {
    // Navigate to the actual exam taking page (MockTestScreenPage or TestAttemptPage)
    navigate(`/tests/${examId}/attempt`); // Updated navigation path
  };

  if (loading && (!examDetails || examDetails._id !== examId)) { // Show loader if loading new exam details
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{mt: 2}}>Loading exam instructions...</Typography>
        </Container>
    );
  }

  if (error) {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Alert severity="error">Error loading exam details: {error}</Alert>
            <Button onClick={() => navigate(-1)} sx={{mt: 2}}>Go Back</Button>
        </Container>
    );
  }

  if (!examDetails || examDetails._id !== examId) { // If details are still not loaded for the correct exam
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
            <Typography>Exam details not found or do not match the requested ID.</Typography>
            <Button onClick={() => navigate(-1)} sx={{mt: 2}}>Go Back</Button>
        </Container>
    );
  }

  // Assuming examDetails are loaded successfully and match examId
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: {xs: 2, sm: 3, md: 4} , mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Exam Instructions
        </Typography>
        <Typography variant="h5" gutterBottom align="center" color="primary.main">
          {examDetails.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
          Category: {examDetails.category?.name || 'N/A'}
        </Typography>

        <Box sx={{ my: 3, p:2, border: '1px dashed grey', borderRadius: 1}}>
            <Typography variant="body1" paragraph>
                {examDetails.description || 'No specific description provided for this exam.'}
            </Typography>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Please read the following instructions carefully:</Typography>
          <List>
            <ListItem>
              <ListItemIcon><TimerIcon color="action"/></ListItemIcon>
              <ListItemText primary={`Duration: ${examDetails.durationMinutes} minutes`} />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleOutlineIcon color="action"/></ListItemIcon>
              <ListItemText primary={`Total Marks: ${examDetails.totalMarks}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon><InfoIcon color="action"/></ListItemIcon>
              <ListItemText primary={`Passing Marks: ${examDetails.passingMarks}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon><WarningIcon color="action"/></ListItemIcon>
              <ListItemText primary={`Ensure you have a stable internet connection throughout the exam.`} />
            </ListItem>
            <ListItem>
              <ListItemIcon><WarningIcon color="action"/></ListItemIcon>
              <ListItemText primary={`The test will submit automatically when the timer runs out.`} />
            </ListItem>
            <ListItem>
              <ListItemIcon><InfoIcon color="action"/></ListItemIcon>
              <ListItemText primary={`Do not refresh the page or use the browser's back/forward buttons during the exam.`} />
            </ListItem>
            {/* Add more specific instructions as needed from examDetails.instructions if available */}
            {examDetails.instructions && examDetails.instructions.map((inst, index) => (
                 <ListItem key={index}>
                    <ListItemIcon><InfoIcon color="action"/></ListItemIcon>
                    <ListItemText primary={inst} />
                 </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="large"
            onClick={() => navigate(-1)} // Or navigate to a specific dashboard page
          >
            Go Back
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleStartExam}
          >
            Proceed to Exam
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ExamInstructionsPage;
