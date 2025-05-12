import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login } from '../store/slices/authSlice';
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Box,
  TextField,
  Button,
  Link,
  Grid,
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const { loading, error, userInfo } = auth;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (userInfo) {
      // Redirect based on role after login
      const role = userInfo.role;
      // TODO: Ensure these routes exist and are protected appropriately
      const redirectPath = role === 'Admin' 
        ? '/admin/dashboard'
        : role === 'ExamManager' // Assuming this role exists
          ? '/exam-manager/dashboard'
          : '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, userInfo]);

  const onSubmit = (data) => {
    // Data contains validated { email, password }
    dispatch(login(data));
  };

  return (
    // AuthLayout provides the centering Container
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%', // Ensure Box takes width within the Container
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>

      {/* Display API error from Redux store */} 
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error} 
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
            />
          )}
        />
        {/* Add Remember me checkbox if needed */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        <Grid container spacing={2}>
          <Grid>
            {/* Point to the correct route */}
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginPage;
