import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Link
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// TODO: Import the actual verification service/thunk
// import { verifyEmail } from '../store/slices/authSlice';
// import { useDispatch } from 'react-redux';

const VerifyEmailPage = () => {
  const { token } = useParams(); // Get verification token from URL
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const attemptVerification = async () => {
      if (!token) {
        setError('Verification token is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        // Placeholder for API call
        console.log('Attempting email verification with token:', token);
        // Replace with actual API call:
        // await dispatch(verifyEmail(token)).unwrap();
        
        // Simulate API call delay and success
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        // throw new Error('Simulated API Error: Invalid or expired token.'); // Uncomment to test error
        
        setSuccess(true);
        setLoading(false);
        
        // Redirect to login after a short delay
        setTimeout(() => {
            navigate('/login?verified=true'); // Add query param for potential feedback on login page
        }, 3000);

      } catch (apiError) {
        setError(apiError.message || 'Failed to verify email. The link may be invalid or expired.');
        setLoading(false);
        setSuccess(false);
      }
    };

    attemptVerification();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]); // Add dispatch if using Redux thunk

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh', // Adjust as needed
        textAlign: 'center',
        width: '100%',
        p: 3,
      }}
    >
      <Typography component="h1" variant="h4" gutterBottom>
        Email Verification
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1">Verifying your email address...</Typography>
        </Box>
      )}

      {error && !loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
           <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
           <Alert severity="error" sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
             {error}
           </Alert>
           <Button component={RouterLink} to="/register" variant="outlined">
             Go back to Registration
           </Button>
        </Box>
      )}

      {success && !loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Alert severity="success" sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
            Email verified successfully!
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You will be redirected to the login page shortly.
          </Typography>
          <Link component={RouterLink} to="/login" variant="body2">
            Click here if you are not redirected automatically.
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default VerifyEmailPage; 