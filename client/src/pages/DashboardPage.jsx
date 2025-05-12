import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  // Grid, 
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Paper,
  IconButton,
} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2'; 
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { fetchCategories } from '../store/slices/examSlice'; 
import { fetchStudentProgressData } from '../store/slices/progressSlice'; 

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { categories, loading: examsLoading, error: examsError } = useSelector((state) => state.exams);
  const { 
    recentAttempts, 
    overallProgress, 
    loading: progressLoading,
    error: progressError 
  } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchStudentProgressData()); 
  }, [dispatch]);

  if (examsLoading === 'pending' || progressLoading === 'pending') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (examsError || progressError) {
    return (
      <Alert severity="error">
        {examsError ? `Error loading exam data: ${examsError.message || examsError}` : ''}
        {progressError ? `Error loading progress data: ${progressError.message || progressError}` : ''}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo ? userInfo.name : 'User'}!
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Track your progress, manage your studies, and explore available exams.
      </Typography>

      {/* Quick Stats Section */}
      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        <Grid2 xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Overall Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h4">
                {overallProgress?.accuracy || 0}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={overallProgress?.accuracy || 0}
              sx={{ height: 10, borderRadius: 5, mt: 2 }}
            />
          </Card>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Performance
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingDownIcon sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h4">
                {recentAttempts?.length || 0} Attempts
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={recentAttempts?.length ? (recentAttempts[0].accuracy || 0) : 0}
              sx={{ height: 10, borderRadius: 5, mt: 2 }}
            />
          </Card>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Study Time
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h4">
                {overallProgress?.studyTime || 0} Hours
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={overallProgress?.studyTime ? (overallProgress.studyTime / 100 * 100) : 0}
              sx={{ height: 10, borderRadius: 5, mt: 2 }}
            />
          </Card>
        </Grid2>
      </Grid2>

      {/* Recent Test Attempts */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Test Attempts
        </Typography>
        <List>
          {recentAttempts?.map((attempt, index) => (
            <React.Fragment key={attempt._id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <NotificationsIcon />
                  </IconButton>
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
                  primary={attempt.examName}
                  secondary={`Completed on ${new Date(attempt.completedAt).toLocaleDateString()}`}
                />
                <Typography variant="body2" color={attempt.accuracy >= 85 ? 'success.main' : attempt.accuracy >= 70 ? 'warning.main' : 'error.main'}>
                  {attempt.accuracy}%
                </Typography>
              </ListItem>
              {index < recentAttempts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Study Recommendations */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Study Recommendations
        </Typography>
        <List>
          {overallProgress?.weakAreas?.map((area, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <SchoolIcon sx={{ color: 'warning.main' }} />
              </ListItemIcon>
              <ListItemText
                primary={area.topic}
                secondary={`Improve ${area.accuracy}% accuracy`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Available Exam Categories */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6">Available Exam Categories</Typography>
        {examsLoading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
        {examsError && <Alert severity="error" sx={{ mt: 2 }}>{`Failed to load categories: ${examsError}`}</Alert>}
        {!examsLoading && !examsError && categories && categories.length > 0 && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {categories.map((category) => (
              <Grid xs={12} sm={6} md={4} key={category._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {!examsLoading && !examsError && (!categories || categories.length === 0) && (
          <Typography sx={{ mt: 2 }}>No exam categories available at the moment.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardPage;
