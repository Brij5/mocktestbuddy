import React, { useState } from 'react';
import { Box, Button, Typography, Paper, TextField, FormControlLabel, Checkbox, Link, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: 400,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const AuthScreen = () => {
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const { handleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Exam Buddy
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Sign in to your account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
          }
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <Box sx={{ mt: 2 }}>
          <Link href="/register" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default AuthScreen;
