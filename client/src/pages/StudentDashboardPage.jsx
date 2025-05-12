import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Paper,
  Snackbar,
} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { fetchCategories } from '../store/slices/examSlice';
import {
  fetchStudentProgressData,
  selectRecentAttempts,
  selectOverallProgress,
  selectProgressLoading,
  selectProgressError,
} from '../store/slices/progressSlice';

const StudentDashboardPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { categories, loading: EXAMS_LOADING, error: EXAMS_ERROR } = useSelector((state) => state.exams);
  
  const recentAttempts = useSelector(selectRecentAttempts);
  const overallProgress = useSelector(selectOverallProgress);
  const PROGRESS_LOADING = useSelector(selectProgressLoading) === 'pending';
  const PROGRESS_ERROR = useSelector(selectProgressError);

  useEffect(() => {
    if (userInfo) { 
        dispatch(fetchCategories());
        dispatch(fetchStudentProgressData()); 
    }
  }, [dispatch, userInfo]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo ? userInfo.name : 'User'}!
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Track your progress, manage your studies, and explore available exams.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Overall Progress
            </Typography>
            {PROGRESS_LOADING ? <CircularProgress size={24} /> : PROGRESS_ERROR ? <Typography color="error">Error</Typography> : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h4">
                {overallProgress?.averageAccuracy || 0}%
              </Typography>
            </Box>
            )}
            <LinearProgress
              variant="determinate"
              value={overallProgress?.averageAccuracy || 0}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Performance
            </Typography>
            {PROGRESS_LOADING ? <CircularProgress size={24} /> : PROGRESS_ERROR ? <Typography color="error">Error</Typography> : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} /> 
              <Typography variant="h4">
                {recentAttempts?.length || 0} Recent Attempts
              </Typography>
            </Box>
            )}
            <LinearProgress
              variant="determinate"
              value={recentAttempts?.length > 0 ? (recentAttempts[0].accuracy || 0) : 0}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Study Time
            </Typography>
            {PROGRESS_LOADING ? <CircularProgress size={24} /> : PROGRESS_ERROR ? <Typography color="error">Error</Typography> : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h4">
                {overallProgress?.totalStudyTime || 0} Hours
              </Typography>
            </Box>
            )}
            { !PROGRESS_LOADING && !PROGRESS_ERROR && (
              <LinearProgress
                variant="determinate"
                value={overallProgress?.totalStudyTime ? Math.min((overallProgress.totalStudyTime / 20) * 100, 100) : 0} 
                sx={{ mt: 1 }} 
              />
            )}
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Test Attempts
        </Typography>
        {PROGRESS_LOADING ? (
          <CircularProgress />
        ) : PROGRESS_ERROR ? (
          <Alert severity="error">Could not load recent attempts: {typeof PROGRESS_ERROR === 'string' ? PROGRESS_ERROR : 'Unknown error'}</Alert>
        ) : !recentAttempts || recentAttempts.length === 0 ? (
            <Typography>No recent attempts found. Time to take a test!</Typography>
        ) : (
          <List>
            {recentAttempts.map((attempt, index) => (
              <React.Fragment key={attempt._id || index}> 
                <ListItem
                  secondaryAction={
                    <Button component={RouterLink} to={`/results/${attempt._id}`} size="small">
                      View Details
                    </Button>
                  }
                >
                  <ListItemIcon>
                    {attempt.accuracy >= 85 ? (
                      <CheckCircleIcon sx={{ color: 'success.main' }} />
                    ) : attempt.accuracy >= 70 ? (
                      <CheckCircleIcon sx={{ color: 'warning.main' }} />
                    ) : (
                      <ErrorOutlineIcon sx={{ color: 'error.main' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={attempt.examName || attempt.exam?.name || 'Unnamed Exam'}
                    secondary={`Completed on ${attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : 'N/A'} - Score: ${attempt.score !== undefined ? attempt.score : 'N/A'}/${attempt.totalQuestions || 'N/A'}`}
                  />
                  <Typography variant="body2" color={attempt.accuracy >= 85 ? 'success.main' : attempt.accuracy >= 70 ? 'warning.main' : 'error.main'} sx={{ ml: 2 }}>
                    {attempt.accuracy || 0}%
                  </Typography>
                </ListItem>
                {index < recentAttempts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Explore Exams
        </Typography>
        {EXAMS_LOADING ? (
          <CircularProgress />
        ) : EXAMS_ERROR ? (
          <Alert severity="error">{EXAMS_ERROR.message || 'Could not load exam categories.'}</Alert>
        ) : categories && categories.length > 0 ? (
          <Grid container spacing={2}>
            {categories.slice(0, 4).map((category) => ( 
              <Grid item xs={12} sm={6} md={3} key={category._id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" component="div">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description || 'No description available.'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to={`/exams/category/${category._id}`} size="small">
                      View Exams
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No exam categories available at the moment.</Typography>
        )}
        {categories && categories.length > 0 && (
            <Box sx={{mt: 2, textAlign: 'right'}}>
                 <Button component={RouterLink} to="/exams" variant="outlined">
                    View All Exams
                </Button>
            </Box>
        )}
      </Paper>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Study Recommendations
        </Typography>
        {overallProgress.weakAreas && overallProgress.weakAreas.length > 0 ? (
             <List>
                {overallProgress.weakAreas.map((area, index) => (
                    <ListItem key={index}>
                        <ListItemIcon><AssignmentIcon color="warning" /></ListItemIcon>
                        <ListItemText primary={`Focus on: ${area.topic}`} secondary={`Suggestion: ${area.suggestion}`} />
                    </ListItem>
                ))}
            </List>
        ) : (
            <Typography>Keep up the good work! No specific weak areas identified based on recent activity.</Typography>
        )}
      </Paper>

      <Snackbar
        open={false}
        autoHideDuration={6000}
        onClose={() => {}}
        message="Feature coming soon!"
      />
    </Box>
  );
};

export default StudentDashboardPage;
