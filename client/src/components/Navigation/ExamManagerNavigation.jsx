import React from 'react';
import { 
  Dashboard as DashboardIcon, 
  School as SchoolIcon, 
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import Navigation from './Navigation';

const ExamManagerNavigation = ({ children }) => {
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/exam-manager/dashboard'
    },
    {
      text: 'Exams',
      icon: <SchoolIcon />,
      path: '/exam-manager/exams'
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      path: '/exam-manager/reports'
    }
  ];

  return (
    <Navigation menuItems={menuItems}>
      {children}
    </Navigation>
  );
};

export default ExamManagerNavigation;
