import React from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { logout } from '../store/slices/authSlice'; // Import logout action

const MainLayout = (/*{ children }*/) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Exam Buddy
          </Typography>
          {/* Add other nav items here? Profile link? */}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {/* Outlet renders the matched nested route component */}
        <Outlet /> 
      </Container>

      {/* Footer (Optional) */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            Exam Buddy {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 