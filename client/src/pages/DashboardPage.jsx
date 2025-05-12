import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Import Role-Specific Dashboards
import AdminDashboard from './admin/AdminDashboard'; // Assuming path is correct
import ExamManagerDashboard from './exam-manager/ExamManagerDashboard'; // Assuming path is correct

// Placeholder Student Dashboard Component (can be extracted later)
const StudentDashboard = () => {
  // TODO: Fetch student-specific data (e.g., recent attempts, upcoming exams)
  return (
    <Grid container spacing={3}>
      {/* Example Student Cards */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" component={RouterLink} to="/exams">
                Browse All Exams
              </Button>
              <Button variant="outlined" component={RouterLink} to="/progress">
                View My Progress
              </Button>
               {/* Add more relevant links */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {/* TODO: Display recent exam attempts or results */}
            <Typography color="text.secondary">
              Your recent exam activity will appear here.
            </Typography>
            {/* Example: <RecentAttemptsList /> */}
          </CardContent>
        </Card>
      </Grid>
       <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Upcoming Deadlines</Typography>
             {/* TODO: Display upcoming exam deadlines or schedules */}
             <Typography color="text.secondary">
              Any upcoming deadlines or scheduled exams will be shown here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const DashboardPage = () => {
  const { user, loading, error: authError } = useSelector((state) => state.auth);

  // Determine which dashboard component to render based on user role
  const renderDashboardContent = () => {
    if (loading) {
      return <CircularProgress />;
    }
    if (authError) {
        return <Alert severity="error">Error loading user data: {authError}</Alert>;
    }
    if (!user) {
        return <Alert severity="warning">User not logged in or data unavailable.</Alert>;
    }

    switch (user.role) {
      case 'admin':
        // Ensure AdminDashboard is imported correctly
        return <AdminDashboard />;
      case 'exam-manager':
         // Ensure ExamManagerDashboard is imported correctly
        return <ExamManagerDashboard />;
      case 'student':
      default:
        // Render student-specific dashboard components
        return <StudentDashboard />;
    }
  };

  return (
    <>
      {/* The Container wrapper remains to provide consistent layout */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Render the role-specific content */}
        {renderDashboardContent()}
      </Container>
    </>
  );
};

export default DashboardPage;
