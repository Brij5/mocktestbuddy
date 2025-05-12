import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Breadcrumbs,
  Link,
  Chip // For displaying correct/incorrect tags
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { fetchAttemptDetails, selectCurrentAttemptDetails, selectProgressLoading, selectProgressError } from '../store/slices/progressSlice';
import { format } from 'date-fns'; // For formatting dates

const TestResultPage = () => {
  const { attemptId } = useParams();
  const dispatch = useDispatch();

  const attemptDetails = useSelector(selectCurrentAttemptDetails);
  const loading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);

  useEffect(() => {
    if (attemptId) {
      dispatch(fetchAttemptDetails(attemptId));
    }
    // Optional: Clear details when component unmounts or attemptId changes
    // return () => { dispatch(clearCurrentAttemptDetailsAction()); };
  }, [dispatch, attemptId]);

  if (loading === 'pending') {
    return (
      <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="error">
          {typeof error === 'string' ? error : error.message || 'Failed to load test result details.'}
        </Alert>
      </Container>
    );
  }

  if (!attemptDetails) {
    return (
      <Container sx={{ py: 3 }}>
        <Typography>No attempt details found for this ID, or still loading.</Typography>
      </Container>
    );
  }

  // Assuming structure for attemptDetails, e.g.:
  // { exam: { name: 'Exam Name' }, completedAt, score, totalQuestions, correctAnswers, timeTaken, questions: [...] }
  const examName = attemptDetails.exam?.name || attemptDetails.examName || 'N/A';
  const completedDate = attemptDetails.completedAt ? format(new Date(attemptDetails.completedAt), 'PPPpp') : 'N/A';
  const accuracy = attemptDetails.accuracy ?? (attemptDetails.score / attemptDetails.totalQuestions * 100);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        {/* Assuming a link to a general results/history page might be good */}
        <Link component={RouterLink} to="/progress" color="inherit" underline="hover">
          My Progress
        </Link>
        <Typography color="text.primary">Test Result</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom component="h1">
        Test Result: {examName}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Typography><strong>Exam:</strong> {examName}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Completed:</strong> {completedDate}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Score:</strong> {attemptDetails.score || 0} / {attemptDetails.totalQuestions || 0}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Accuracy:</strong> {accuracy ? accuracy.toFixed(2) : 'N/A'}%</Typography></Grid>
          {attemptDetails.timeTaken && <Grid item xs={12} sm={6}><Typography><strong>Time Taken:</strong> {attemptDetails.timeTaken}</Typography></Grid>}
        </Grid>
      </Paper>

      {attemptDetails.questions && attemptDetails.questions.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Question Breakdown</Typography>
          <List>
            {attemptDetails.questions.map((q, index) => (
              <React.Fragment key={q._id || index}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon sx={{ mt: 1, minWidth: 'auto', mr: 1.5}}>
                    {q.isCorrect ? 
                      <CheckCircleIcon color="success" /> : 
                      <CancelIcon color="error" />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Q${index + 1}: ${q.questionText || 'Question text not available'}`}
                    secondaryTypographyProps={{ component: 'div' }}                    
                    secondary={
                      <Box component="div">
                        <Typography variant="body2" color="text.secondary">Your answer: {q.selectedAnswer || 'Not answered'}</Typography>
                        {!q.isCorrect && <Typography variant="body2" sx={{color: 'success.main'}}>Correct answer: {q.correctAnswer}</Typography>}
                        {q.explanation && <Typography variant="body2" sx={{mt: 0.5, fontStyle: 'italic'}}>Explanation: {q.explanation}</Typography>}
                      </Box>
                    }
                  />
                  <Chip 
                    label={q.isCorrect ? 'Correct' : 'Incorrect'}
                    color={q.isCorrect ? 'success' : 'error'}
                    size="small"
                    sx={{ ml: 2, alignSelf: 'center' }}
                  />
                </ListItem>
                {index < attemptDetails.questions.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default TestResultPage;
