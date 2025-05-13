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
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom'; 
import { testResults } from '../../data/mocks/testResultMocks'; 

const TestResultPage = () => { 
  const { testId } = useParams(); 

  const calculateAccuracy = () => {
    if (testResults.totalQuestions === 0) return 0;
    return ((testResults.correctAnswers / testResults.totalQuestions) * 100).toFixed(1);
  };

  const calculateTimeEfficiency = () => {
    if (testResults.maxTime === 0) return 0;
    return ((testResults.timeTaken / testResults.maxTime) * 100).toFixed(1);
  };

  // In a real app, you would fetch specific results based on testId
  // For now, we are using the generic mock data

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Results for: {testResults.testName} (ID: {testId})
      </Typography>

      {/* Summary Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {testResults.testName} {/* Could be dynamic if fetched */}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Date: {testResults.date}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Overall Score
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    {testResults.score}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    out of {testResults.totalMarks || 100} {/* Assuming total marks or default */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{mt:1}}>
                    {testResults.percentile}% Percentile
                  </Typography>
                </Paper>
              </Grid>
              <Grid>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Accuracy
                  </Typography>
                  <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                    {calculateAccuracy()}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {testResults.correctAnswers} / {testResults.totalQuestions} Correct
                  </Typography>
                </Paper>
              </Grid>
              <Grid>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Time Efficiency
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: testResults.timeTaken > testResults.maxTime * 0.8 ? 'error.main' : 'success.main' }}>
                    {calculateTimeEfficiency()}%
                  </Typography>
                   <Typography variant="body1" color="text.secondary">
                    {testResults.timeTaken} mins taken / {testResults.maxTime} mins max
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1">Comparison with Others:</Typography>
            <Typography variant="body2" color="text.secondary">
              National Average Score: {testResults.comparison.nationalAverage.score}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Top 10% Average Score: {testResults.comparison.top10Percent.score}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Subject-wise Analysis */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Subject-wise Performance
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(testResults.subjectWise).map(([subject, data]) => (
              <Grid key={subject}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {subject}
                  </Typography>
                  <Typography variant="body2">Score: {data.score} ({data.percentile}%)</Typography>
                  <Typography variant="body2">Correct: {data.correct}</Typography>
                  <Typography variant="body2">Incorrect: {data.incorrect}</Typography>
                  <Typography variant="body2">Accuracy: {data.totalQuestions > 0 ? ((data.correct / data.totalQuestions) * 100).toFixed(1) : 0}%</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Difficulty Analysis */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Difficulty Level Analysis
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(testResults.difficultyAnalysis).map(([level, data]) => (
              <Grid key={level}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{textTransform: 'capitalize'}}>
                    {level}
                  </Typography>
                  <Typography variant="body2">Attempted: {data.questions}</Typography>
                  <Typography variant="body2">Correct: {data.correct}</Typography>
                  <Typography variant="body2">Accuracy: {data.questions > 0 ? ((data.correct / data.questions) * 100).toFixed(1) : 0}%</Typography>
                  <Typography variant="body2">Avg. Percentile: {data.percentile}%</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Time Analysis */}
      <Card elevation={3} sx={{mb: 4}}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Time Management
          </Typography>
          <Grid container spacing={3}>
            <Grid>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Overall Time</Typography>
                <Typography variant="body2">Total Time Taken: {testResults.timeTaken} minutes</Typography>
                <Typography variant="body2">Average Time/Question: {testResults.timeAnalysis.averagePerQuestion.toFixed(1)} minutes</Typography>
              </Paper>
            </Grid>
            <Grid>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Time Spent Per Subject</Typography>
                <List dense>
                  {Object.entries(testResults.timeAnalysis.timePerSubject).map(([subject, time]) => (
                    <ListItem key={subject} disableGutters>
                      <ListItemText primary={subject} secondary={`${time} minutes`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', p:2 }}>
          <Button variant="contained" color="primary" component={RouterLink} to={`/tests/solutions/${testId}`}> 
            View Detailed Solutions
          </Button>
          {/* TODO: Implement re-attempt logic if applicable for the exam */}
          <Button variant="outlined" color="secondary" component={RouterLink} to={`/student/dashboard`}> 
            Back to Dashboard
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default TestResultPage;
