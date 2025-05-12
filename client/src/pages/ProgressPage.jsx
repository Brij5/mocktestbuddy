import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  CircularProgress,
  Tooltip,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Cancel,
  Timer,
  Book,
  Star,
  StarBorder,
  TrendingFlat,
  Refresh,
} from '@mui/icons-material';

const ProgressPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock progress data - this will come from API
  const progressData = {
    totalQuestionsAttempted: 1250,
    correctAnswers: 1050,
    accuracy: 84,
    timeTaken: 1500 * 60, // 1500 minutes
    currentStreak: 12,
    longestStreak: 25,
    strengths: [
      { topic: 'Mathematics', accuracy: 92, lastImprovedAt: '2024-05-03' },
      { topic: 'English', accuracy: 88, lastImprovedAt: '2024-05-02' },
    ],
    weaknesses: [
      { topic: 'Physics', accuracy: 65, lastAttemptedAt: '2024-05-03' },
      { topic: 'Chemistry', accuracy: 70, lastAttemptedAt: '2024-05-02' },
    ],
    achievements: [
      {
        name: 'Master Practitioner',
        description: 'Attempted 1000+ questions',
        points: 1000,
        icon: <Book sx={{ fontSize: 24 }} />,
      },
      {
        name: 'Master of Accuracy',
        description: 'Achieved 85%+ average accuracy',
        points: 500,
        icon: <CheckCircle sx={{ fontSize: 24 }} />,
      },
      {
        name: 'Month-long Streak',
        description: 'Maintained a 30-day streak',
        points: 1000,
        icon: <Trophy sx={{ fontSize: 24 }} />,
      },
    ],
  };

  const getPerformanceColor = (accuracy) => {
    if (accuracy >= 85) return 'success';
    if (accuracy >= 70) return 'warning';
    return 'error';
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Implement refresh logic
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const tabContent = [
    {
      title: 'Overview',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Overall Performance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp
                  sx={{
                    color: getPerformanceColor(progressData.accuracy),
                    fontSize: '2rem',
                    mr: 2,
                  }}
                />
                <Typography variant="h4">
                  {progressData.accuracy}%
                </Typography>
              </Box>
              <Typography variant="body1" color="textSecondary">
                {progressData.correctAnswers} correct out of {progressData.totalQuestionsAttempted}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Time Spent
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer sx={{ mr: 2 }} />
                <Typography variant="h5">
                  {formatTime(progressData.timeTaken)}
                </Typography>
              </Box>
              <Typography variant="body1" color="textSecondary">
                Total time spent on practice
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Streak
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: 'success.main', mr: 2 }} />
                <Typography variant="h4">
                  {progressData.currentStreak} days
                </Typography>
              </Box>
              <Typography variant="body1" color="textSecondary">
                Best streak: {progressData.longestStreak} days
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Progress
              </Typography>
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progressData.accuracy}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
              <Typography variant="body1" color="textSecondary">
                {progressData.accuracy}% accuracy
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ),
    },
    {
      title: 'Strengths',
      content: (
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your Strengths
          </Typography>
          <List>
            {progressData.strengths.map((strength, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: 'success.light',
                  mb: 1,
                  borderRadius: 2,
                  [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  },
                }}
              >
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText
                  primary={strength.topic}
                  secondary={`${strength.accuracy}% accuracy`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ),
    },
    {
      title: 'Areas for Improvement',
      content: (
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Areas for Improvement
          </Typography>
          <List>
            {progressData.weaknesses.map((weakness, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: 'error.light',
                  mb: 1,
                  borderRadius: 2,
                  [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  },
                }}
              >
                <ListItemIcon>
                  <Cancel sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText
                  primary={weakness.topic}
                  secondary={`${weakness.accuracy}% accuracy`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ),
    },
    {
      title: 'Achievements',
      content: (
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your Achievements
          </Typography>
          <List>
            {progressData.achievements.map((achievement, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 2,
                  p: 2,
                  [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  },
                }}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={achievement.name}
                  secondary={achievement.description}
                />
                <Tooltip title={`${achievement.points} points`}>
                  <Star sx={{ color: 'warning.main' }} />
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1.5rem',
                },
              }}
            >
              Progress
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                [theme.breakpoints.down('sm')]: {
                  display: 'none',
                },
              }}
            >
              Refresh
            </Button>
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              [theme.breakpoints.down('sm')]: {
                p: 2,
              },
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                {tabContent.map((tab) => (
                  <Tab key={tab.title} label={tab.title} />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ mt: 4 }}>{tabContent[activeTab].content}</Box>
          </Paper>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                // Implement practice mode
              }}
              startIcon={<TrendingUp />}
              sx={{
                [theme.breakpoints.down('sm')]: {
                  width: '100%',
                },
              }}
            >
              Practice More
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Implement analytics view
              }}
              endIcon={<TrendingFlat />}
              sx={{
                [theme.breakpoints.down('sm')]: {
                  width: '100%',
                },
              }}
            >
              View Analytics
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProgressPage;
