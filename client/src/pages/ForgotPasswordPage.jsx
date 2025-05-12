import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { requestPasswordReset, clearAuthMessages } from '../store/slices/authSlice';
import {
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
import LockResetIcon from '@mui/icons-material/LockReset';

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { loading, resetRequestSuccessMessage, resetRequestError } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

  // Clear messages when component unmounts or form is interacted with
  useEffect(() => {
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(clearAuthMessages()); // Clear previous messages on new submit
    dispatch(requestPasswordReset(data.email));
    reset(); // Clear form field after submission
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
        <LockResetIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Forgot Password
      </Typography>
      <Typography component="p" variant="body1" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
        Enter your email address below. If an account exists, we'll send instructions to reset your password.
      </Typography>

      {/* Display messages from Redux store */} 
      {resetRequestError && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{resetRequestError}</Alert>
      )}
      {resetRequestSuccessMessage && (
        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{resetRequestSuccessMessage}</Alert>
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
              disabled={loading} // Disable field while loading
            />
          )}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading} // Disable button while loading
        >
          {loading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              Back to Sign In
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage; 