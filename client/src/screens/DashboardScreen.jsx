import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import StudentNavigation from '../components/Navigation/StudentNavigation';
import { styled } from '@mui/material/styles';
import StudentDashboardPage from '../pages/StudentDashboardPage';
import AdminDashboardScreen from './AdminDashboardScreen'; // Assuming this component exists
// import ExamManagerDashboardScreen from './ExamManagerDashboardScreen'; // Placeholder for Exam Manager

const StyledScreenContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  margin: theme.spacing(0),
}));

const DashboardScreen = () => {
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) { // Handle potential auth errors during loading
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography color="error">Error loading user data: {typeof error === 'object' ? JSON.stringify(error) : error}</Typography>
            <Typography>Please try logging in again.</Typography>
            {/* Optionally provide a button to go to login */}
        </Box>
    );
  }

  if (!userInfo) {
    // If no userInfo and not loading, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Render dashboard based on user role
  switch (userInfo.role) {
    case 'Admin':
      return <AdminDashboardScreen />;
    case 'Student': // Assuming 'Student' is the role name
      return (
        <StudentNavigation>
          <StyledScreenContainer>
            <StudentDashboardPage />
          </StyledScreenContainer>
        </StudentNavigation>
      );
    // case 'ExamManager':
    //   return <ExamManagerDashboardScreen />;
    default:
      // Fallback for unknown roles or if role is not defined
      // You might want to log this situation or show a generic dashboard/error
      console.warn(`Unknown or undefined user role: ${userInfo.role}`);
      // For now, redirecting to login or showing a generic student dashboard as a fallback
      return <Navigate to="/login" replace />; // Or <StudentDashboardPage /> if that's a safer default
  }
};

export default DashboardScreen;
