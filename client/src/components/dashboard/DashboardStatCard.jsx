import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  ListItemIcon,
  Button,
} from '@mui/material';

const DashboardStatCard = ({
  icon, // The icon component itself, e.g., <SchoolIcon fontSize="inherit" />
  iconColor = 'primary.main',
  title,
  value,
  description,
  buttonText,
  buttonStartIcon, // Optional: Icon for the button
  onButtonClick,
}) => {
  return (
    <Grid>
      <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
        {icon && (
          <ListItemIcon sx={{ fontSize: 40, color: iconColor, mb: 1, justifyContent: 'center', width: '100%' }}>
            {icon}
          </ListItemIcon>
        )}
        <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
        <Typography component="p" variant="h4" sx={{ textAlign: 'center' }}>
          {value}
        </Typography>
        <Typography color="text.secondary" sx={{ flexGrow: 1, textAlign: 'center', mt: 1, mb: 2 }}>
          {description}
        </Typography>
        {buttonText && onButtonClick && (
          <Button
            startIcon={buttonStartIcon}
            onClick={onButtonClick}
            variant="contained"
            size="small"
            sx={{ mt: 'auto' }} // Pushes button to the bottom
          >
            {buttonText}
          </Button>
        )}
      </Paper>
    </Grid>
  );
};

export default DashboardStatCard;
