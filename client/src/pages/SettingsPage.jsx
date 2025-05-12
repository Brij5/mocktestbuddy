import React from 'react';
import { 
  Container, 
  Typography, 
  Box 
} from '@mui/material';

const SettingsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Settings Page</Typography>
        <Typography>User account settings and preferences.</Typography>
        {/* TODO: Implement settings options */}
      </Box>
    </Container>
  );
};

export default SettingsPage;
