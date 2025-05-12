import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ExamManagerNavigation from '../../components/Navigation/ExamManagerNavigation';

import {
  fetchExamManagerStats,
  fetchRecentActivity,
  fetchManagedExams,
  selectExamManagerStats,
  selectRecentActivity,
  selectManagedExams,
  selectExamManagerLoading,
  selectExamManagerError,
} from '../../store/slices/examManagerSlice';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StatsCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  cursor: 'pointer',
});

const ExamManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stats = useSelector(selectExamManagerStats);
  const recentActivity = useSelector(selectRecentActivity);
  const managedExams = useSelector(selectManagedExams);
  const isLoading = useSelector(selectExamManagerLoading);
  const error = useSelector(selectExamManagerError);

  useEffect(() => {
    dispatch(fetchExamManagerStats());
    dispatch(fetchRecentActivity());
    dispatch(fetchManagedExams());
  }, [dispatch]);

  const handleCreateExam = () => {
    navigate('/exam-manager/exams/new');
  };

  const handleViewDetails = (type, id) => {
    switch (type) {
      case 'exam':
        navigate(`/exam-manager/exams/${id}`);
        break;
      default:
        break;
    }
  };

  const handleEdit = (type, id) => {
    switch (type) {
      case 'exam':
        navigate(`/exam-manager/exams/${id}/edit`);
        break;
      default:
        break;
    }
  };

  if (isLoading && (!stats && !recentActivity.length && !managedExams.length)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <LinearProgress />
        <Typography sx={{ ml: 2 }}>Loading Exam Manager Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <ExamManagerNavigation>
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          Exam Manager Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the exam manager dashboard. Here you can manage exams and view reports.
        </Typography>

        {error && (
          <Typography variant="body1" color="error.main" gutterBottom>
            {typeof error === 'object' ? JSON.stringify(error) : error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="h6">Total Managed Exams</Typography>
              </Box>
              <Typography variant="h3" align="center">
                {stats?.totalExams ?? 'N/A'}
              </Typography>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssessmentIcon sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="h6">Active/Published Exams</Typography>
              </Box>
              <Typography variant="h3" align="center">
                {stats?.activeExams ?? 'N/A'}
              </Typography>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BarChartIcon sx={{ color: '#f57c00', mr: 1 }} />
                <Typography variant="h6">Average Score (Placeholder)</Typography>
              </Box>
              <Typography variant="h3" align="center">
                {'75%'}
              </Typography>
            </StatsCard>
          </Grid>
          {/* Create New Exam Button */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard onClick={handleCreateExam} sx={{ justifyContent: 'center', backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark'} }}>
              <AddIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" align="center">Create New Exam</Typography>
            </StatsCard>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Recent Activity"
                action={
                  <IconButton onClick={handleViewDetails}>
                    <VisibilityIcon />
                  </IconButton>
                }
              />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Exam</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivity?.map((activity) => (
                      <TableRow key={activity._id}>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {activity.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {activity.exam.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(activity.timestamp).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={() =>
                                handleViewDetails(activity.type, activity.id)
                              }
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEdit(activity.type, activity.id)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              disabled // Disabled until handleDelete is implemented
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentActivity.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2">No recent activity.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Create New Exam"
                action={
                  <IconButton onClick={handleCreateExam}>
                    <AddIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body1">
                  Create a new exam with questions and settings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </StyledPaper>
    </ExamManagerNavigation>
  );
};

export default ExamManagerDashboard;
