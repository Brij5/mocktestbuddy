import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

// Layout for authentication pages (Login, Register, etc.) that centers content.
const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Although centering, keep column flow if needed for headers/footers later
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        minHeight: '100vh', // Ensure the box takes full viewport height
        // Example background color
        // backgroundColor: (theme) => theme.palette.grey[50],
      }}
    >
      {/* Container limits the width of the centered authentication form */}
      <Container component="main" maxWidth="xs">
          {/* Outlet renders the specific auth page like LoginPage, RegisterPage */}
          <Outlet /> 
      </Container>
    </Box>
  );
};

export default AuthLayout;