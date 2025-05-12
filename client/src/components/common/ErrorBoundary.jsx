import React, { Component } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: 'background.paper',
            p: 4,
          }}
        >
          <Alert severity="error" sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
            Something went wrong! Please try again later.
          </Alert>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            If the problem persists, please contact support.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = '/'}
            sx={{ mb: 2 }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
