import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { 
  fetchStudentProgressData, 
  // selectProgressData, // Removed as it's not exported by progressSlice and not used
  selectProgressLoading, 
  selectProgressError 
} from '../../store/slices/progressSlice'; // Corrected path
import { format } from 'date-fns';

const StudentProgressPage = () => {
  const dispatch = useDispatch();

  // --- TEMPORARY PLACEHOLDER DATA --- Start
  // Remove this section once real data is flowing from the backend
  const placeholderRecentAttempts = [
    { _id: 'attempt1', examName: 'Sample Exam A', completedAt: new Date(Date.now() - 86400000).toISOString(), accuracy: 85.5, score: 171, totalQuestions: 200, passed: true, examId: 'examA' },
    { _id: 'attempt2', examName: 'Practice Test B', completedAt: new Date(Date.now() - 172800000).toISOString(), accuracy: 62.0, score: 62, totalQuestions: 100, passed: true, examId: 'examB' },
    { _id: 'attempt3', examName: 'Sample Exam A', completedAt: new Date(Date.now() - 259200000).toISOString(), accuracy: 78.3, score: 156, totalQuestions: 200, passed: true, examId: 'examA' },
    { _id: 'attempt4', examName: 'Mini Quiz C', completedAt: new Date(Date.now() - 345600000).toISOString(), accuracy: 90.0, score: 18, totalQuestions: 20, passed: true, examId: 'examC' },
    { _id: 'attempt5', examName: 'Practice Test B', completedAt: new Date(Date.now() - 432000000).toISOString(), accuracy: 55.0, score: 55, totalQuestions: 100, passed: false, examId: 'examB' },
  ];

  const placeholderOverallProgress = {
    averageAccuracy: 74.2,
    totalStudyTime: 285, // minutes
    examsCompleted: 5, // or calculate from unique exams in placeholderRecentAttempts
  };

  // Use placeholder data for rendering
  const recentAttempts = placeholderRecentAttempts;
  const overallProgress = placeholderOverallProgress;
  // --- TEMPORARY PLACEHOLDER DATA --- End

  const loading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);

  useEffect(() => {
    // Fetch data if not already loaded or if loading status is idle/failed
    // This prevents re-fetching if data is already fresh from dashboard
    if (loading === 'idle' || loading === 'failed') {
         dispatch(fetchStudentProgressData());
    } else if (!overallProgress.examsCompleted && !recentAttempts.length && loading !== 'pending') {
        // If data seems empty and not loading, try fetching
        dispatch(fetchStudentProgressData());
    }
  }, [dispatch, loading, overallProgress, recentAttempts]);

  if (loading === 'pending' && !overallProgress.examsCompleted && !recentAttempts.length) {
    return (
      <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && loading !== 'pending') {
    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="error">
          {typeof error === 'string' ? error : error.message || 'Failed to load student progress.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        My Progress Overview
      </Typography>

      {/* Overall Progress Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid>
          <Card sx={{height: '100%'}}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Exams Completed</Typography>
              <Typography variant="h3">{overallProgress.examsCompleted || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={{height: '100%'}}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Average Accuracy</Typography>
              <Typography variant="h3">{(overallProgress.averageAccuracy || 0).toFixed(1)}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={{height: '100%'}}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Study Time</Typography>
              <Typography variant="h3">{overallProgress.totalStudyTime || 0} Hours</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Test Attempts Table */}
      <Typography variant="h5" gutterBottom component="h2" sx={{ mt: 4 }}>
        Recent Test Attempts
      </Typography>
      {loading === 'pending' && recentAttempts.length === 0 ? (
         <Box sx={{ display: 'flex', justifyContent: 'center', my:3 }}><CircularProgress /></Box>
      ) : recentAttempts && recentAttempts.length > 0 ? (
        <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="recent test attempts table">
              <TableHead>
                <TableRow>
                  <TableCell>Exam Name</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell align="right">Accuracy</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentAttempts.map((attempt) => (
                  <TableRow hover key={attempt._id}>
                    <TableCell component="th" scope="row">
                      {attempt.examName || 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {attempt.completedAt ? format(new Date(attempt.completedAt), 'PP') : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {attempt.score !== undefined ? `${attempt.score}/${attempt.totalQuestions}` : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {attempt.accuracy !== undefined ? `${attempt.accuracy.toFixed(1)}%` : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        component={RouterLink} 
                        to={`/results/${attempt._id}`} 
                        variant="outlined" 
                        size="small"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Typography sx={{ my: 3 }}>No recent test attempts found.</Typography>
      )}
    </Container>
  );
};

export default StudentProgressPage;
