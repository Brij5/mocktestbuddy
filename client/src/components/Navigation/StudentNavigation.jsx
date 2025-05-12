import React from 'react';
import { 
  Dashboard as DashboardIcon, 
  School as SchoolIcon, 
  Assessment as AssessmentIcon,
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  ExitToApp as ExitToAppIcon 
} from '@mui/icons-material';
import Navigation from './Navigation';

const StudentNavigation = ({ children }) => {
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard' 
    },
    {
      text: 'Exams',
      icon: <SchoolIcon />,
      path: '/exams' 
    },
    {
      text: 'My Progress',
      icon: <AssessmentIcon />,
      path: '/progress' 
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/profile' 
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings'
    },
    {
      text: 'Logout',
      icon: <ExitToAppIcon />,
      path: '/logout' 
    }
  ];

  return (
    <Navigation menuItems={menuItems}>
      {children}
    </Navigation>
  );
};

export default StudentNavigation;
