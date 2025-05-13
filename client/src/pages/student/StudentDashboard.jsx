import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { availableExams } from '../../data/mocks/studentDashboardMocks';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleExamSelect = (examId) => {
    navigate(`/exams/${examId}/details`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Student Dashboard
      </Typography>

      {/* Available Exams Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available Exams
        </Typography>
        <Grid container spacing={3}>
          {availableExams.map((exam) => (
            <Grid key={exam.id}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardActionArea onClick={() => handleExamSelect(exam.id)}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {exam.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {exam.description}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {exam.mockTests} Mock Tests Available
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mock Tests Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          My Mock Tests
        </Typography>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Your subscribed mock test packages will appear here.
          </Typography>
          {/* TODO: List subscribed mock tests */}
        </Paper>
      </Box>

      {/* Recent Activity Section */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Activity
        </Typography>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Your recent test attempts and results will be shown here.
          </Typography>
          {/* TODO: List recent test activities */}
        </Paper>
      </Box>
    </Container>
  );
};

export default StudentDashboard;
