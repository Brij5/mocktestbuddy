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
import { fetchStudentProgressData, selectOverallProgress, selectRecentAttempts, selectProgressLoading, selectProgressError } from '../store/slices/progressSlice';
import { format } from 'date-fns';

const StudentProgressPage = () => {
  const dispatch = useDispatch();

  const overallProgress = useSelector(selectOverallProgress);
  const recentAttempts = useSelector(selectRecentAttempts);
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom component="h1">
        My Progress Overview
      </Typography>

      {/* Overall Progress Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={4}>
          <Card sx={{height: '100%'}}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Exams Completed</Typography>
              <Typography variant="h3">{overallProgress?.examsCompleted || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card sx={{height: '100%'}}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Average Accuracy</Typography>
              <Typography variant="h3">{(overallProgress?.averageAccuracy || 0).toFixed(1)}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card sx={{height: '100%'}}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Study Time</Typography>
              <Typography variant="h3">{overallProgress?.totalStudyTime || 0} Hours</Typography>
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
                      {attempt.exam?.name || attempt.examName || 'N/A'}
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
