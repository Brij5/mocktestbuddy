import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
} from '@mui/material';

const AuthLayout = () => {
  return (
    <Container 
      component="main" 
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        py: 4,
      }}
    >
      <Paper 
        elevation={3}
        sx={{ 
          p: { xs: 2, sm: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Outlet renders the specific auth page (Login, Register, etc.) */}
        <Outlet />
      </Paper>
    </Container>
  );
};

export default AuthLayout; 