import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, AppBar, Toolbar, Button, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Navigation = ({ menuItems = [] }) => {
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch({ type: 'USER_LOGOUT' });
    window.location.href = '/login';
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
           <ListItemButton component={RouterLink} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
           </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
           <ListItemButton component={RouterLink} to="/profile">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
           </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: '#1976d2' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Exam Buddy
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle2" color="inherit">
              {userInfo?.name}
            </Typography>
            <Button
              color="inherit"
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: 240 },
          flexShrink: { sm: 0 },
          bgcolor: '#f4f5f7',
          borderRight: '1px solid #e0e0e0'
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              bgcolor: '#f4f5f7',
              borderRight: '1px solid #e0e0e0'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              bgcolor: '#f4f5f7',
              borderRight: '1px solid #e0e0e0'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Toolbar />
        {/* Main content will be rendered here */}
      </Box>
    </Box>
  );
};

export default Navigation;
