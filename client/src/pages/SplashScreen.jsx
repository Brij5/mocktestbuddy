import React, { useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      switch (userInfo.role) {
        case 'Admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'ExamManager':
          navigate('/exam-manager/dashboard', { replace: true });
          break;
        default: 
          navigate('/dashboard', { replace: true });
          break;
      }
    } 
  }, [userInfo, navigate]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  if (userInfo) {
    return null;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          p: 3,
        }}
      >
        <Typography component="h1" variant="h2" align="center" color="primary" gutterBottom>
          Exam Buddy
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Your Personalized Learning Companion
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Prepare for your exams with personalized study plans, mock tests, and progress tracking.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGetStarted}
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default SplashScreen;
