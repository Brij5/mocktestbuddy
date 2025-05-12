import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';

const LoadingScreen = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default LoadingScreen;
