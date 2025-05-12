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
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
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
  History,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <StyledPaper>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to the admin dashboard. Here you can manage exams, users, and settings.
          </Typography>

          {/* Stats Section using Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Total Exams Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ListItemIcon sx={{ fontSize: 40, color: 'primary.main' }}>
                  <SchoolIcon fontSize="inherit" />
                </ListItemIcon>
                <Typography variant="h6" component="h2">
                  Total Exams
                </Typography>
                <Typography component="p" variant="h4">
                  {stats?.totalExams ?? 0}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Total exams created
                </Typography>
                <Button 
                  startIcon={<AddIcon />}
                  onClick={() => handleNavigation('/admin/exams/create')}
                >
                  Create New Exam
                </Button>
              </Paper>
            </Grid>

            {/* Active Users Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ListItemIcon sx={{ fontSize: 40, color: 'success.main' }}>
                  <PeopleIcon fontSize="inherit" />
                </ListItemIcon>
                <Typography variant="h6" component="h2">
                  Active Users
                </Typography>
                <Typography component="p" variant="h4">
                  {stats?.activeUsers ?? 0}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  Currently active users
                </Typography>
                <Button 
                  startIcon={<AddIcon />}
                  onClick={() => handleNavigation('/admin/users/create')}
                >
                  Create New User
                </Button>
              </Paper>
            </Grid>

            {/* Recent Activity Section */}
            <Grid item xs={12} sx={{ mb: 4 }}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Recent Activity
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <LinearProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                ) : recentActivity && recentActivity.length > 0 ? (
                  <List dense>
                    {recentActivity.slice(0, 5).map((activity, index) => ( // Show top 5 activities
                      <React.Fragment key={activity._id || index}>
                        <ListItem>
                          <ListItemIcon>
                            <History />
                          </ListItemIcon>
                          <ListItemText 
                            primary={activity.description || 'Activity description missing'} 
                            secondary={`User: ${activity.userId?.name || 'Unknown'} | ${new Date(activity.timestamp).toLocaleString()}`}
                          />
                          {/* Add action button if needed, e.g., view details */}
                        </ListItem>
                        {index < recentActivity.slice(0, 5).length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                    {recentActivity.length > 5 && (
                       <ListItem sx={{ justifyContent: 'center' }}>
                         <Button onClick={() => handleNavigation('/admin/activity-log')}>View Full Log</Button> 
                       </ListItem>
                    )}
                  </List>
                ) : (
                  <Typography>No recent activity found.</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </StyledPaper>
      </Container>
    </>
  );
};

export default AdminDashboard;
