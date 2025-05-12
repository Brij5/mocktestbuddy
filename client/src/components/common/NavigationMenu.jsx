import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Button,
  Container, // For footer content alignment
  IconButton, // Added missing import
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon, // Consider changing for Admin/EM 'Manage Exams' for clarity
  Person as PersonIcon,
  Settings as SettingsIcon,
  Book as BookIcon, // For All Exams (Student)
  Assessment as AssessmentIcon, // For My Progress (Student)
  ExitToApp as LogoutIcon, // For Logout button
  // Admin specific icons (if any, current HomeIcon is generic)
  // Group as GroupIcon, // Example for Manage Users
  // Assignment as AssignmentIcon, // Example for Manage Exams (Admin/EM)
  Menu as MenuIcon, // Added missing import
} from '@mui/icons-material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice'; // Adjusted path

const drawerWidth = 240;

const NavigationMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = userInfo?.role === 'Admin';
  const isExamManager = userInfo?.role === 'ExamManager';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const studentMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'All Exams', icon: <BookIcon />, path: '/exams' },
    { text: 'My Progress', icon: <AssessmentIcon />, path: '/progress' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' }, // Ensure this route exists
    { text: 'Manage Exams', icon: <HomeIcon />, path: '/admin/exams' }, // Placeholder path, verify actual route
    { text: 'Manage Users', icon: <PersonIcon />, path: '/admin/users' }, // Placeholder path, verify actual route
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const examManagerMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/exam-manager/dashboard' }, // Ensure this route exists
    { text: 'Manage Exams', icon: <HomeIcon />, path: '/exam-manager/exams' }, // Placeholder path, verify actual route
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  let menuItems = studentMenuItems; // Default to student
  if (isAdmin) {
    menuItems = adminMenuItems;
  } else if (isExamManager) {
    menuItems = examManagerMenuItems;
  }

  const drawerContent = (
    <Box>
      <Toolbar sx={{ justifyContent: 'center', // Center content if needed, or match AppBar's Toolbar
        minHeight: { xs: 56, sm: 64 } // Match AppBar height
      }}>
        <Typography variant="h6" noWrap component="div">
          Exam Buddy
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined} // Close drawer on mobile click
              sx={{
                '&.Mui-selected': { // Active link styling
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.selected,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 'auto' }} />
      <List>
        <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* AppBar integrated from MainLayout */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1, // Ensure AppBar is above the permanent drawer
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }} // Hamburger icon for mobile
          >
            <MenuIcon /> 
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Title can be dynamic based on current page if needed */}
            {menuItems.find(item => window.location.pathname.startsWith(item.path))?.text || 'Exam Buddy'}
          </Typography>
          {/* Logout button moved to drawer for consistency, or keep here if preferred */}
          {/* <Button color="inherit" onClick={handleLogout}>Logout</Button> */}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, position: 'relative' }, // position relative to keep it in flow
          }}
          open // Permanent drawer is always open on desktop
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area using Outlet */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: '56px', sm: '64px' }, // Account for AppBar height
          // width: { sm: `calc(100% - ${drawerWidth}px)` }, // No longer needed if AppBar is part of this Box's sibling
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)', // AppBar height (adjust if footer is tall)
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */} 
        <Box sx={{ flexGrow: 1}}>
          <Outlet /> {/* Child routes will render here */}
        </Box>

        {/* Footer integrated from MainLayout */}
        <Box
          component="footer"
          sx={{
            py: 2, // Reduced padding
            px: 2,
            mt: 'auto', // Pushes footer to bottom
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
              {'© '}
              <RouterLink color="inherit" to="/">
                Exam Buddy
              </RouterLink>{' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default NavigationMenu;
