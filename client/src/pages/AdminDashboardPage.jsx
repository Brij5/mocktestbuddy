import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings'; // Added for consistency
import DashboardIcon from '@mui/icons-material/Dashboard'; // Added for consistency
import { Link as RouterLink } from 'react-router-dom';
// import NavigationMenu from '../components/common/NavigationMenu'; // Assuming a common nav component exists and might be used later

const AdminDashboardPage = () => {
  // const adminMenuItems = [
  //   { text: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
  //   { text: 'User Management', icon: <GroupIcon />, path: '/admin/users' },
  //   { text: 'Exam Management', icon: <SchoolIcon />, path: '/admin/exams' },
  //   { text: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  // ];

  // Placeholder data - replace with actual data from Redux store or API calls
  const stats = {
    totalUsers: 150,
    totalExams: 75,
    activeSessions: 23,
    systemHealth: "Nominal",
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* <NavigationMenu menuItems={adminMenuItems} /> */}
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: '2rem' }} /> Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Oversee and manage the entire Exam Buddy application.
      </Typography>

      {/* Key Stats Section */}
      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <GroupIcon sx={{ mr: 1 }} /> Total Users
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students, Managers, Admins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: 'secondary.main' }}>
                <SchoolIcon sx={{ mr: 1 }} /> Total Exams
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>
                {stats.totalExams}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published and drafts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                <BarChartIcon sx={{ mr: 1 }} /> Active Sessions
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>
                {stats.activeSessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Users currently online
              </Typography>
            </CardContent>
          </Card>
        </Grid>
         <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: stats.systemHealth === "Nominal" ? 'success.main' : 'error.main' } }>
                <AdminPanelSettingsIcon sx={{ mr: 1 }} /> System Health
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                {stats.systemHealth}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All services operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & Management Links */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Management Sections
        </Typography>
        <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12} md={4}>
                <Button fullWidth variant="contained" component={RouterLink} to="/admin/users" startIcon={<GroupIcon />} sx={{p:1.5, justifyContent: 'flex-start'}}>
                    Manage Users
                </Button>
            </Grid>
            <Grid item xs={12} md={4}>
                <Button fullWidth variant="contained" component={RouterLink} to="/admin/exams" startIcon={<SchoolIcon />} sx={{p:1.5, justifyContent: 'flex-start'}}>
                    Manage Exams & Questions
                </Button>
            </Grid>
            <Grid item xs={12} md={4}>
                <Button fullWidth variant="contained" component={RouterLink} to="/admin/settings" startIcon={<SettingsIcon />} sx={{p:1.5, justifyContent: 'flex-start'}}>
                    System Settings
                </Button>
            </Grid>
             <Grid item xs={12} md={4}>
                <Button fullWidth variant="outlined" component={RouterLink} to="/admin/analytics" startIcon={<BarChartIcon />} sx={{p:1.5, justifyContent: 'flex-start'}}>
                    View Analytics
                </Button>
            </Grid>
            <Grid item xs={12} md={4}>
                <Button fullWidth variant="outlined" component={RouterLink} to="/admin/logs" sx={{p:1.5, justifyContent: 'flex-start'}}>
                    System Logs
                </Button>
            </Grid>
            <Grid item xs={12} md={4}>
                <Button fullWidth variant="outlined" component={RouterLink} to="/admin/reports" sx={{p:1.5, justifyContent: 'flex-start'}}>
                    Generate Reports
                </Button>
            </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboardPage;
