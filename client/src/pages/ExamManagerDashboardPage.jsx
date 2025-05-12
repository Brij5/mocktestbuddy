import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getExams, getExamStats } from '../store/slices/examManagerSlice';
import examService from '../services/examService'; // Assuming examService is defined in this file

const ExamManagerDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, stats, loading } = useSelector((state) => state.examManager);
  const theme = useTheme();

  useEffect(() => {
    dispatch(getExams());
    dispatch(getExamStats());
  }, [dispatch]);

  const handleCreateExam = () => {
    navigate('/exam-manager/exams/create');
  };

  const handleEditExam = (examId) => {
    navigate(`/exam-manager/exams/${examId}/edit`);
  };

  const handleDeleteExam = async (examId) => {
    try {
      await examService.deleteExam(examId);
      dispatch(getExams()); // Assuming getExams is the correct action to fetch exams
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Exam Manager Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6">Total Exams</Typography>
            </Box>
            <Typography variant="h3" align="center">
              {stats?.totalExams || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="h6">Active Exams</Typography>
            </Box>
            <Typography variant="h3" align="center">
              {stats?.activeExams || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BarChartIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
              <Typography variant="h6">Average Score</Typography>
            </Box>
            <Typography variant="h3" align="center">
              {stats?.averageScore || 0}%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateExam}
              fullWidth
            >
              Create New Exam
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Exams List */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Exams
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exam Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exams?.map((exam) => (
                    <TableRow key={exam._id}>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {exam.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {exam.category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {exam.durationMinutes} minutes
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={
                            exam.isActive
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {exam.isActive ? 'Active' : 'Inactive'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEditExam(exam._id)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteExam(exam._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExamManagerDashboardPage;
