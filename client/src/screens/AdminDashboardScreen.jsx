import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  People as PeopleIcon, 
  Settings as SettingsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../components/Navigation/AdminNavigation';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const AdminDashboardScreen = () => {
  const navigate = useNavigate();

  const handleCreateExam = () => {
    navigate('/admin/exams/new');
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleSettings = () => {
    navigate('/admin/settings');
  };

  return (
    <AdminNavigation>
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the admin dashboard. Here you can manage exams, users, and settings.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Create New Exam"
                action={
                  <IconButton onClick={handleCreateExam}>
                    <AddIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body2">
                  Create new exams with questions and configure exam settings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Manage Users"
                action={
                  <IconButton onClick={handleManageUsers}>
                    <PeopleIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body2">
                  View and manage all student accounts and their progress.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Settings"
                action={
                  <IconButton onClick={handleSettings}>
                    <SettingsIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body2">
                  Configure system settings and preferences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </StyledPaper>
    </AdminNavigation>
  );
};

export default AdminDashboardScreen;
