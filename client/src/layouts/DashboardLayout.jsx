import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  useTheme 
} from '@mui/material';
import NavigationMenu from '../components/common/NavigationMenu';

const DashboardLayout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        overflow: 'hidden' 
      }}>
        {/* Sidebar Navigation */}
        <Box 
          sx={{ 
            width: 240, 
            flexShrink: 0, 
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`
          }}
        >
          <NavigationMenu />
        </Box>

        {/* Main Content Area */}
        <Container 
          component="main" 
          sx={{ 
            mt: 4, 
            mb: 4, 
            flexGrow: 1, 
            overflow: 'auto',
            padding: theme.spacing(3)
          }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            Exam Buddy {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;