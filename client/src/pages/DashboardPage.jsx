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
import StudentDashboard from './student/StudentDashboard'; // Added import for the main StudentDashboard

const DashboardPage = () => {
  // Correctly destructure userInfo and alias it to user
  const { userInfo: user, loading, error: authError } = useSelector((state) => state.auth);

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
      case 'Admin':
        // Ensure AdminDashboard is imported correctly
        return <AdminDashboard />;
      case 'ExamManager':
         // Ensure ExamManagerDashboard is imported correctly
        return <ExamManagerDashboard />;
      case 'Student':
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
