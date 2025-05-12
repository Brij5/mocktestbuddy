import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  startTestAttempt,
  submitTestAttempt,
  moveToQuestion,
  updateUserAnswer,
  tickTimer,
  resetTestAttempt,
  selectCurrentExamDetails,
  selectCurrentQuestionIndex,
  selectUserAnswers,
  selectTimeLeftSeconds,
  selectIsTestSubmitted,
  selectTestSubmissionResult,
  selectTestAttemptStatus,
  selectTestAttemptError,
  selectMarkedForReview,
} from '../store/slices/testAttemptSlice';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const MockTestScreen = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentExamDetails = useSelector(selectCurrentExamDetails);
  const currentQuestionIndex = useSelector(selectCurrentQuestionIndex);
  const userAnswers = useSelector(selectUserAnswers);
  const timeLeftSeconds = useSelector(selectTimeLeftSeconds);
  const isTestSubmitted = useSelector(selectIsTestSubmitted);
  const submissionResult = useSelector(selectTestSubmissionResult);
  const testAttemptStatus = useSelector(selectTestAttemptStatus);
  const testAttemptError = useSelector(selectTestAttemptError);
  const markedForReviewCount = useSelector(selectMarkedForReview).length;

  useEffect(() => {
    if (examId) {
      dispatch(startTestAttempt(examId));
    }
    return () => {
      dispatch(resetTestAttempt());
    };
  }, [dispatch, examId]);

  useEffect(() => {
    if (testAttemptStatus === 'succeeded' && timeLeftSeconds > 0 && !isTestSubmitted) {
      const timerId = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeftSeconds === 0 && !isTestSubmitted && testAttemptStatus === 'succeeded') {
      dispatch(submitTestAttempt());
    }
  }, [dispatch, timeLeftSeconds, isTestSubmitted, testAttemptStatus]);

  useEffect(() => {
    if (isTestSubmitted && submissionResult) {
      // For now, let's assume results are shown on this screen or a dedicated one.
      // Navigation can be handled based on submissionResult content later.
      // console.log('Test submitted, result:', submissionResult);
    }
  }, [isTestSubmitted, submissionResult, navigate]);

  const handleAnswerChange = (questionId, answer) => {
    dispatch(updateUserAnswer({ questionId, answer }));
  };

  const handleNextQuestion = () => {
    if (currentExamDetails && currentQuestionIndex < currentExamDetails.questions.length - 1) {
      dispatch(moveToQuestion(currentQuestionIndex + 1));
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      dispatch(moveToQuestion(currentQuestionIndex - 1));
    }
  };

  const handleSubmit = () => {
    dispatch(submitTestAttempt());
  };

  if (testAttemptStatus === 'loading' && !currentExamDetails) {
    return (
      <StyledPaper sx={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading exam questions...</Typography>
      </StyledPaper>
    );
  }

  if (testAttemptError) {
    return (
      <StyledPaper>
        <Alert severity="error">Error: {testAttemptError}</Alert>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back to Dashboard</Button>
      </StyledPaper>
    );
  }

  if (!currentExamDetails || !currentExamDetails.questions || currentExamDetails.questions.length === 0) {
    return (
      <StyledPaper>
        <Typography>Exam data is not available or exam has no questions.</Typography>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back to Dashboard</Button>
      </StyledPaper>
    );
  }

  if (isTestSubmitted) {
    return (
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          Test Results for {currentExamDetails.name}
        </Typography>
        {testAttemptStatus === 'loading' && <CircularProgress />}
        {testAttemptError && <Alert severity="error">Error submitting: {testAttemptError}</Alert>}
        {submissionResult && (
          <Box>
            <Typography variant="h6">Your Score: {submissionResult.score} / {submissionResult.totalQuestions}</Typography>
            <Typography>Accuracy: {submissionResult.accuracy}%</Typography>
            {/* Add more detailed results display here if needed */}
          </Box>
        )}
        <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </StyledPaper>
    );
  }

  const currentQuestionData = currentExamDetails.questions[currentQuestionIndex];
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          {currentExamDetails.name}
        </Typography>
        <Typography variant="h6" color={timeLeftSeconds <= 60 ? 'error' : 'textPrimary'}>
          Time Left: {formatTime(timeLeftSeconds)}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1">
          Question {currentQuestionIndex + 1} of {currentExamDetails.questions.length}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 'medium' }}>
          {currentQuestionData.text}
        </Typography>

        <FormControl component="fieldset" sx={{ mt: 1, width: '100%' }}>
          <RadioGroup
            value={userAnswers[currentQuestionData._id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestionData._id, e.target.value)}
          >
            {currentQuestionData.options.map((option, index) => (
              <FormControlLabel
                key={option._id || index}
                value={option.text}
                control={<Radio />}
                label={option.text}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  border: '1px solid #eee',
                  '&:hover': { backgroundColor: '#f9f9f9' }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || testAttemptStatus === 'loading'}
        >
          Previous
        </Button>
        <Typography>
          Marked for Review: {markedForReviewCount}
        </Typography>
        {currentQuestionIndex < currentExamDetails.questions.length - 1 ? (
          <Button variant="contained" onClick={handleNextQuestion} disabled={testAttemptStatus === 'loading'}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleSubmit} disabled={testAttemptStatus === 'loading' || isTestSubmitted}>
            {testAttemptStatus === 'loading' ? <CircularProgress size={24} /> : 'Submit Test'}
          </Button>
        )}
      </Box>
    </StyledPaper>
  );
};

export default MockTestScreen;
