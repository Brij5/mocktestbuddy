import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const TestResultsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const testAttempt = useSelector((state) => state.testAttempts.current);

  // Format time in minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    if (!testAttempt) return null;

    const totalQuestions = testAttempt.totalQuestions;
    const answeredQuestions = testAttempt.answeredQuestions;
    const correctAnswers = testAttempt.correctAnswers;

    return {
      accuracy: Math.round((correctAnswers / answeredQuestions) * 100),
      completion: Math.round((answeredQuestions / totalQuestions) * 100),
      marksObtained: testAttempt.marksObtained,
      totalMarks: testAttempt.totalMarks,
      timeTaken: formatTime(testAttempt.timeTaken),
    };
  };

  // Get topic performance color
  const getTopicColor = (accuracy) => {
    if (accuracy >= 85) return 'success';
    if (accuracy >= 70) return 'warning';
    return 'error';
  };

  const performanceMetrics = getPerformanceMetrics();

  if (!testAttempt) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Main Results Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {testAttempt.examName}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Completed on {formatDate(testAttempt.completedAt)}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  {/* Marks Card */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary">
                          Marks Obtained
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                          {performanceMetrics.marksObtained}/{performanceMetrics.totalMarks}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(performanceMetrics.marksObtained / performanceMetrics.totalMarks) * 100}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            mt: 2,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Accuracy Card */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary">
                          Accuracy
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                          {performanceMetrics.accuracy}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={performanceMetrics.accuracy}
                          color={getTopicColor(performanceMetrics.accuracy)}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            mt: 2,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Completion Card */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary">
                          Completion
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                          {performanceMetrics.completion}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={performanceMetrics.completion}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            mt: 2,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Time Card */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary">
                          Time Taken
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                          {performanceMetrics.timeTaken}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Share />}
                onClick={() => setShowShareDialog(true)}
                variant="outlined"
              >
                Share Results
              </Button>
              <Button
                startIcon={<Refresh />}
                onClick={() => navigate('/exams')}
                variant="outlined"
              >
                Try Again
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Analysis Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Performance Analysis
              </Typography>

              <Grid container spacing={3}>
                {/* Strengths */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Strengths
                  </Typography>
                  <List>
                    {testAttempt.strengths?.map((strength, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: theme.palette[getTopicColor(strength.accuracy)].main,
                              }}
                            >
                              {strength.topic.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={strength.topic}
                            secondary={`${strength.accuracy}% accuracy - Last improved: ${formatDate(strength.lastImprovedAt)}`}
                          />
                        </ListItem>
                        {index < testAttempt.strengths.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>

                {/* Weaknesses */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Areas for Improvement
                  </Typography>
                  <List>
                    {testAttempt.weaknesses?.map((weakness, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: theme.palette[getTopicColor(weakness.accuracy)].main,
                              }}
                            >
                              {weakness.topic.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={weakness.topic}
                            secondary={`${weakness.accuracy}% accuracy - Last attempted: ${formatDate(weakness.lastAttemptedAt)}`}
                          />
                        </ListItem>
                        {index < testAttempt.weaknesses.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)}>
        <DialogTitle>Share Your Results</DialogTitle>
        <DialogContent>
          <Typography>
            Share your test results with your friends or save them for future reference.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            // Implement sharing logic here
            setShowShareDialog(false);
            setOpenSnackbar(true);
          }}>
            Share
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Results shared successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TestResultsPage;