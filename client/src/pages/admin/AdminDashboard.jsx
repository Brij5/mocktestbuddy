import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
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
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from "@components/Navigation/AdminNavigation";
import { getStats, getRecentActivity } from "@store/slices/adminSlice";

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
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, recentActivity, loading, error } = useSelector((state) => state.admin) || { stats: null, recentActivity: [], loading: false, error: null };

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch data if user is logged in and has admin role
    if (userInfo && userInfo.role === 'Admin') {
      dispatch(getStats());
      dispatch(getRecentActivity());
    }
  }, [dispatch, userInfo]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" variant="h6">
          Error loading dashboard data
        </Typography>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }

  const handleCreateExam = () => {
    navigate('/admin/exams/new', {
      state: {
        type: 'full-length',
        exams: stats?.exams || []
      }
    });
  };

  const handleCreateUser = () => {
    navigate('/admin/users/new', { state: { fromDashboard: true } });
  };

  const handleManageUsers = () => {
    navigate('/admin/users', { state: { fromDashboard: true } });
  };

  return (
    <AdminNavigation>
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the admin dashboard. Here you can manage exams, users, and settings.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StatsCard>
              <CardHeader
                title="Total Exams"
                avatar={
                  <SchoolIcon sx={{ color: 'primary.main' }} />
                }
              />
              <CardContent>
                <Typography variant="h3" component="div">
                  {stats?.exams || 0}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  Total exams created
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleCreateExam}
                  fullWidth
                >
                  Create New Exam
                </Button>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StatsCard>
              <CardHeader
                title="Active Users"
                avatar={
                  <PeopleIcon sx={{ color: 'success.main' }} />
                }
              />
              <CardContent>
                <Typography variant="h3" component="div">
                  {stats?.activeUsers || 0}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  Currently active users
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleCreateUser}
                  fullWidth
                >
                  Create New User
                </Button>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StatsCard>
              <CardHeader
                title="Recent Activity"
                avatar={
                  <AssessmentIcon sx={{ color: 'info.main' }} />
                }
              />
              <CardContent>
                <Typography variant="h3" component="div">
                  {recentActivity?.length || 0}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  Recent activities logged
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={handleManageUsers}
                  fullWidth
                >
                  View All Users
                </Button>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StatsCard>
              <CardHeader
                title="System Settings"
                avatar={
                  <SettingsIcon sx={{ color: 'warning.main' }} />
                }
              />
              <CardContent>
                <Typography variant="h3" component="div">
                  <BarChartIcon sx={{ fontSize: 40 }} />
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  Configure system settings
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate('/admin/settings')}
                  sx={{ mt: 2 }}
                >
                  Settings
                </Button>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
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
                  Create a new full-length mock exam based on existing exam patterns.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Create New User"
                action={
                  <IconButton onClick={handleCreateUser}>
                    <AddIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body1">
                  Add a new user to the system with appropriate role and permissions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Manage Users"
                action={
                  <IconButton onClick={handleManageUsers}>
                    <PeopleIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body1">
                  View, edit, and manage all users in the system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Settings"
                action={
                  <IconButton onClick={() => navigate('/admin/settings')}>
                    <SettingsIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body1">
                  Configure system settings and preferences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </StyledPaper>
    </AdminNavigation>
  );
};

export default AdminDashboard;
