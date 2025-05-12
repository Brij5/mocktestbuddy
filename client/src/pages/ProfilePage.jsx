import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress, // For loading state if needed
  Alert // For messages
} from '@mui/material';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth); // Assuming loading/error states for auth

  useEffect(() => {
    if (!loading && !userInfo) { // Check loading state before redirecting
      navigate('/login');
    }
  }, [navigate, userInfo, loading]);

  const submitHandler = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    // For now, this button might be disabled or show a message
  };

  if (loading === 'pending' || (loading === 'idle' && !userInfo)) {
    return (
      <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="error">{typeof error === 'string' ? error : error.message || 'Error loading profile.'}</Alert>
      </Container>
    );
  }

  if (!userInfo) { // Should be caught by useEffect redirect, but as a fallback
    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="info">Redirecting to login...</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 3 }}>
        User Profile
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={submitHandler} noValidate>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <TextField
                fullWidth
                id="name"
                label="Name"
                value={userInfo.name || ''}
                InputProps={{
                  readOnly: true,
                }}
                variant="filled" // Or 'outlined'
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                value={userInfo.email || ''}
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                id="role"
                label="Role"
                value={userInfo.role || ''}
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
              />
            </Grid>
            <Grid xs={12} sx={{ mt: 2, textAlign: 'right' }}>
              <Button type="submit" variant="contained" disabled>
                Update Profile (Coming Soon)
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
