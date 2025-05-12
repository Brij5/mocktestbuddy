import React, { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resetPassword, clearAuthMessages } from '../store/slices/authSlice';
import {
  // Container, // Removed unused import
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Grid,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Validation Schema
const schema = yup.object().shape({
  password: yup.string()
    .required('New Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .required('Confirm New Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, resetSuccessMessage, resetError } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  // Redirect to login after successful reset (after a delay)
  useEffect(() => {
    if (resetSuccessMessage) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000); // 3 second delay
      return () => clearTimeout(timer);
    }
  }, [resetSuccessMessage, navigate]);

  const onSubmit = (data) => {
    dispatch(clearAuthMessages()); // Clear previous messages
    if (!token) {
      // This should ideally not happen if the route is correct, but as a safeguard
      dispatch(clearAuthMessages()); // Ensure error state is clean if we manually set one
      // Use Redux state for errors: dispatch(setErrorAction('Reset token is missing from URL.'));
      console.error('Reset token missing!');
      return;
    }
    dispatch(resetPassword({ token, password: data.password }));
    // Don't reset form here, wait for success message
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>

      {/* Display messages from Redux store */}
      {resetError && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{resetError}</Alert>
      )}
      {resetSuccessMessage && (
        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
          {resetSuccessMessage} Redirecting to login...
        </Alert>
      )}

      {/* Hide form after successful reset */}
      {!resetSuccessMessage && (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="New Password"
                type="password"
                id="password"
                autoComplete="new-password"
                autoFocus
                error={!!errors.password}
                helperText={errors.password?.message || 'Password must be at least 8 characters.'}
                disabled={loading}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={loading}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </Box>
      )}

      {/* Show link to login only after success */}
      {resetSuccessMessage && (
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              Proceed to Sign In Now
            </Link>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ResetPasswordPage; 