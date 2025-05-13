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
  useMediaQuery,
  Toolbar,
  Button,
  Container,
  IconButton,
  AppBar,
  CssBaseline,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Book as BookIcon,
  Assessment as AssessmentIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { styled, useTheme } from '@mui/material/styles';

// Define drawerWidth outside the component for styled component access
const drawerWidth = 240;

// Styled component for the main content area to handle sidebar offset
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0, // Start with no margin
    marginTop: theme.mixins.toolbar.minHeight, // Apply base margin top for mobile AppBar
    [theme.breakpoints.up('sm')]: {
      marginTop: 0, // No margin top on larger screens as AppBar isn't fixed
      width: `calc(100% - ${drawerWidth}px)`, // Default width assuming drawer is closed
      marginLeft: `${drawerWidth}px`, // Default margin assuming drawer is open
      ...(open && { // When permanent drawer is 'open' (i.e., !isMobile)
        width: `calc(100% - ${drawerWidth}px)`, // Explicitly set width when open
        marginLeft: `${drawerWidth}px`, // Keep margin when open
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
      ...(!open && { // Styles when permanent drawer is hypothetically closed (not applicable here but good practice)
        width: '100%',
        marginLeft: 0,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }),
    },
  }),
);

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
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Manage Exams', icon: <BookIcon />, path: '/admin/exams' },
    { text: 'Manage Users', icon: <PersonIcon />, path: '/admin/users' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const examManagerMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/exam-manager/dashboard' },
    { text: 'Manage Exams', icon: <HomeIcon />, path: '/exam-manager/exams' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  let menuItems = studentMenuItems;
  if (isAdmin) {
    menuItems = adminMenuItems;
  } else if (isExamManager) {
    menuItems = examManagerMenuItems;
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap component="div">
            Exam Buddy
          </Typography>
          {userInfo?.role && (
            <Typography variant="caption" color="text.secondary" noWrap component="div">{userInfo.role}</Typography>
          )}
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.selected,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
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
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      {/* AppBar replacement for Mobile - Only burger icon */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', sm: 'none' }, // Only show on mobile
          width: '100%',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Exam Buddy
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: isMobile ? 'block' : 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content Area using styled component */}
      <Main open={!isMobile}> {/* Pass 'open' based on permanent drawer visibility */}
        <Outlet />

        {/* Footer - Ensure it's inside Main */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
              {' '}
              Exam Buddy{' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Container>
        </Box>
      </Main>
    </Box>
  );
};

export default NavigationMenu;
