import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Dummy data for mock tests
const mockTests = [
  {
    id: 'upsc-01',
    examId: 'upsc',
    title: 'UPSC Prelims Mock Test 1',
    description: 'Full-length mock test covering all subjects',
    totalQuestions: 100,
    duration: 180, // minutes
    status: 'available', // available, in-progress, completed
    attempts: 0,
  },
  {
    id: 'cuet-01',
    examId: 'cuet',
    title: 'CUET Mock Test 1',
    description: 'Sectional test - Mathematics',
    totalQuestions: 40,
    duration: 60,
    status: 'completed',
    attempts: 1,
  },
];

const MockTestList = ({ examId }) => {
  const navigate = useNavigate();

  const getTestStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'primary';
      default:
        return 'text.secondary';
    }
  };

  const handleTestStart = (testId) => {
    navigate(`/student/mock-test/${testId}/attempt`);
  };

  const handleTestReview = (testId) => {
    navigate(`/student/test-result/${testId}`);
  };

  // Filter mock tests for the selected exam
  const filteredTests = mockTests.filter((test) => test.examId === examId);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Mock Tests
      </Typography>

      <Grid container spacing={3}>
        {filteredTests.map((test) => (
          <Grid key={test.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {test.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {test.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {test.totalQuestions} Questions | {test.duration} minutes
                </Typography>
                <Typography
                  variant="body2"
                  color={getTestStatusColor(test.status)}
                  sx={{ mt: 1 }}
                >
                  Status: {test.status.toUpperCase()}
                </Typography>
                {test.attempts > 0 && (
                  <Typography variant="body2" color="primary">
                    Attempts: {test.attempts}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                {test.status === 'available' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTestStart(test.id)}
                    fullWidth
                  >
                    Start Test
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleTestReview(test.id)}
                    fullWidth
                  >
                    Review Test
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MockTestList;
