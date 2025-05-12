import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const mockTests = [
    {
      id: 1,
      title: 'Mathematics Mock Test',
      description: 'Practice your math skills with this comprehensive mock test',
      image: '/mock-test-math.jpg',
    },
    {
      id: 2,
      title: 'Science Mock Test',
      description: 'Test your science knowledge with this mock test',
      image: '/mock-test-science.jpg',
    },
    {
      id: 3,
      title: 'English Mock Test',
      description: 'Improve your English proficiency with this mock test',
      image: '/mock-test-english.jpg',
    },
  ];

  const handleStartTest = (testId) => {
    navigate(`/mock-test/${testId}`);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Typography variant="body1">
                Total Tests Taken: {user?.testsTaken || 0}
              </Typography>
              <Typography variant="body1">
                Average Score: {user?.averageScore || 0}%
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Tests
              </Typography>
              <Typography variant="body1">
                {mockTests.length} mock tests available
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body1">
                Last test taken: {user?.lastTestDate || 'Never'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Available Mock Tests
        </Typography>

        <Grid container spacing={3}>
          {mockTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={test.image}
                  alt={test.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {test.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleStartTest(test.id)}
                  >
                    Start Test
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
