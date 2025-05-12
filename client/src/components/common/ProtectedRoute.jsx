import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  Box,
  Typography,
  Button,
  Alert,
} from '@mui/material';

const ProtectedRoute = ({ children, adminRequired = false, examManagerRequired = false }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle logout
  if (location.pathname === '/logout') {
    dispatch(logout());
    navigate('/login', { replace: true });
    return null;
  }

  if (adminRequired && userInfo.role !== 'Admin') {
    return (
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
        <Alert severity="error" sx={{ mb: 2 }}>
          Access denied. This page is only available to administrators.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  if (examManagerRequired && userInfo.role !== 'ExamManager') {
    return (
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
        <Alert severity="error" sx={{ mb: 2 }}>
          Access denied. This page is only available to exam managers.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
