import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Timer,
  ArrowBack,
  ArrowForward,
  CheckCircleOutline,
  HighlightOff,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { startTestAttempt, submitAnswer, markForReview } from '../store/slices/testAttemptSlice';
import { selectUser } from '../store/slices/authSlice';

const TestAttemptPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Mock exam data - this will come from API
  const exam = {
    name: 'Sample Exam',
    durationMinutes: 60,
    totalQuestions: 50,
    instructions: [
      'Read all questions carefully before answering.',
      'Each question carries equal marks.',
      'Negative marking will be applied for incorrect answers.',
      'You cannot go back to previous questions once submitted.',
      'Use the Mark for Review option to revisit questions later.',
    ],
  };

  // Mock questions - this will come from API
  const questions = [
    {
      id: 1,
      question: 'What is the capital of India?',
      options: [
        { id: 'a', text: 'Mumbai' },
        { id: 'b', text: 'Delhi' },
        { id: 'c', text: 'Bangalore' },
        { id: 'd', text: 'Chennai' },
      ],
      correctAnswer: 'b',
    },
    // Add more questions as needed
  ];

  useEffect(() => {
    if (examId) {
      // Start the test attempt when component mounts
      dispatch(startTestAttempt({ examId, userId: user?.id }));
    }
  }, [examId, dispatch, user?.id]);

  useEffect(() => {
    if (showTimer) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setShowTimer(false);
            setShowSubmitDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    }
    return () => clearInterval(timerInterval);
  }, [showTimer, timerInterval]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setShowInstructions(false);
    setShowTimer(true);
    setTimeLeft(exam.durationMinutes * 60);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleAnswerSubmit = (selectedOption) => {
    dispatch(
      submitAnswer({
        questionId: questions[currentQuestionIndex].id,
        selectedOption,
        timeTaken: 30, // This will be calculated based on actual time taken
      })
    );
  };

  const handleMarkForReview = () => {
    dispatch(
      markForReview({
        questionId: questions[currentQuestionIndex].id,
      })
    );
  };

  const handleEndTest = () => {
    setShowSubmitDialog(false);
    // Navigate to results page
    navigate(`/exam/${examId}/results`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {showInstructions ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            {exam.name}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Duration: {exam.durationMinutes} minutes
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Total Questions: {exam.totalQuestions}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Instructions:
            </Typography>
            <ul>
              {exam.instructions.map((instruction, index) => (
                <li key={index}>
                  <Typography variant="body1">{instruction}</Typography>
                </li>
              ))}
            </ul>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartTest}
            sx={{ mt: 4 }}
          >
            Start Test
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h6" color="textSecondary">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {showTimer && (
                <Box sx={{ mr: 2 }}>
                  <Typography variant="h6" color="textSecondary">
                    Time Left: {formatTime(timeLeft)}
                  </Typography>
                </Box>
              )}
              <Tooltip title="Mark for Review">
                <IconButton
                  color={questions[currentQuestionIndex].isMarkedForReview ? 'primary' : 'default'}
                  onClick={handleMarkForReview}
                >
                  {questions[currentQuestionIndex].isMarkedForReview ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              {questions[currentQuestionIndex].question}
            </Typography>
            <Box sx={{ mt: 2 }}>
              {questions[currentQuestionIndex].options.map((option) => (
                <Button
                  key={option.id}
                  variant={
                    option.id === questions[currentQuestionIndex].selectedOption
                      ? 'contained'
                      : 'outlined'
                  }
                  fullWidth
                  sx={{ mb: 1 }}
                  onClick={() => handleAnswerSubmit(option.id)}
                >
                  {option.text}
                </Button>
              ))}
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Button
              variant="outlined"
              disabled={currentQuestionIndex === 0}
              onClick={handlePreviousQuestion}
              startIcon={<ArrowBack />}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              endIcon={<ArrowForward />}
            >
              Next
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowReviewDialog(true)}
              startIcon={<HighlightOff />}
            >
              End Test
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSubmitDialog(true)}
              startIcon={<CheckCircleOutline />}
            >
              Submit Test
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Test</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit the test? You cannot go back once submitted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleEndTest} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showReviewDialog} onClose={() => setShowReviewDialog(false)}>
        <DialogTitle>End Test</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end the test? All your answers will be saved, but you won't be able to continue.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleEndTest} color="error">
            End Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestAttemptPage;
