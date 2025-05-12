import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright '}
      <Link color="inherit" href="/"> {/* Link to homepage or leave non-linked */}
        Exam Buddy
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // padding top and bottom
        px: 2, // padding left and right
        mt: 'auto', // push footer to bottom
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" gutterBottom>
          Prepare Smarter, Score Higher.
        </Typography>
        <Copyright />
        {/* Add other links like About Us, Contact, Privacy Policy later */}
      </Container>
    </Box>
  );
};

export default Footer;
