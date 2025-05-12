import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { register } from '../store/slices/authSlice';
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
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
// TODO: Import common Loader/Message components instead of defining inline
// import Loader from '../components/common/Loader'; 
// import Message from '../components/common/Message';

// Temporary Message component (replace with common one)
const Message = ({ severity = 'info', children }) => (
  <Alert severity={severity} sx={{ mb: 2, width: '100%' }}>{children}</Alert>
);

// TODO: Consider moving schema to a separate validation file if it grows
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'), // Check against password field
});

const RegisterPage = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const { loading, error: apiError, userInfo } = auth;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (userInfo) {
        const role = userInfo.role;
        const redirectPath = role === 'Admin'
          ? '/admin/dashboard'
          : role === 'ExamManager'
            ? '/exam-manager/dashboard'
            : '/dashboard';
        navigate(redirectPath, { replace: true });
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    setRegistrationSuccess(false);
  }, [reset]);

  const onSubmit = async (data) => {
    setRegistrationSuccess(false);
    try {
      // Dispatch register action with validated data (name, email, password)
      // 'confirmPassword' is validated but not typically sent to the backend
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registrationData } = data;
      await dispatch(register(registrationData)).unwrap();

      setRegistrationSuccess(true);
      reset();
    } catch (rejectedValue) {
      console.error('Registration failed:', rejectedValue);
      setRegistrationSuccess(false);
    }
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
        <PersonAddOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" gutterBottom>
        Create Student Account
      </Typography>

      {registrationSuccess && (
        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
          Registration successful! Please check your email to verify your account (if applicable).
        </Alert>
      )}

      {apiError && !registrationSuccess && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {apiError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              autoComplete="name"
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={loading}
            />
          )}
        />
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
              autoComplete="new-password"
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
              label="Confirm Password"
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
          disabled={loading || registrationSuccess}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RegisterPage;
