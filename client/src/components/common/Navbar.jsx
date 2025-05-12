import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { logout } from '../../store/slices/authSlice';

const drawerWidth = 240;

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.role === 'Admin';
  const isExamManager = userInfo?.role === 'ExamManager';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    // Optionally navigate to home or login page after logout
    navigate('/login');
    setMobileOpen(false); // Close drawer if open
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {isAdmin ? 'Admin Dashboard' : 'Exam Buddy'}
      </Typography>
      <Divider />
      <List>
        {userInfo ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            {isAdmin && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to="/admin/exams"
                    sx={{ textAlign: 'center' }}
                  >
                    <ListItemText primary="Manage Exams" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to="/admin/users"
                    sx={{ textAlign: 'center' }}
                  >
                    <ListItemText primary="Manage Users" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {isExamManager && (
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/exam-manager/exams"
                  sx={{ textAlign: 'center' }}
                >
                  <ListItemText primary="Manage Exams" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/register"
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'left' }} component={RouterLink} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {userInfo ? (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'left' }} component={RouterLink} to="/dashboard">
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'left' }} component={RouterLink} to="/profile">
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'left' }} onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'left' }} component={RouterLink} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'left' }} component={RouterLink} to="/register">
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <> {/* Use Fragment instead of Box to avoid unnecessary div */} 
      <AppBar position="static" component="nav" sx={{ mb: 4 }}> {/* Add margin-bottom */} 
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            {isAdmin ? 'Admin Dashboard' : 'Exam Buddy'}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {userInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" component={RouterLink} to="/profile">
                <AccountCircle />
              </IconButton>
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          )}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}> {/* Add gap between buttons */} 
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/" 
                sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} // Subtle hover
              >
                Home
              </Button>
              {userInfo ? (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/dashboard" 
                    sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/profile" 
                    sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                  >
                    <AccountCircle sx={{ mr: 0.5 }} /> {/* Add icon */} 
                    Profile
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={handleLogout} 
                    sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/login" 
                    sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                  >
                    Login
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/register" 
                    sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <nav> {/* Changed Box to nav for semantics */} 
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}

export default Navbar;
