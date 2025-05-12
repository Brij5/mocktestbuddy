import React from 'react';
import { 
  Dashboard as DashboardIcon, 
  School as SchoolIcon, 
  People as PeopleIcon, 
  Settings as SettingsIcon
} from '@mui/icons-material';
import Navigation from './Navigation';

const AdminNavigation = ({ children }) => {
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard'
    },
    {
      text: 'Exams',
      icon: <SchoolIcon />,
      path: '/admin/exams'
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users'
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings'
    }
  ];

  return (
    <Navigation menuItems={menuItems}>
      {children}
    </Navigation>
  );
};

export default AdminNavigation;
