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
} from '../../store/slices/testAttemptSlice'; // Corrected import path

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
      // Potential navigation to a dedicated results page if this screen shouldn't show them:
      // navigate(`/tests/${examId}/result`); // Ensure this matches your new results route
    }
  }, [isTestSubmitted, submissionResult, navigate, examId]); // Added examId to dependencies for potential navigation

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

  // Conditional rendering for submitted state
  // This component handles both test taking and showing immediate results after submission.
  // If a separate result page is strongly preferred, this section would navigate away.
  if (isTestSubmitted) {
    return (
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          Test Submitted: {currentExamDetails.name}
        </Typography>
        {testAttemptStatus === 'loading' && <CircularProgress sx={{my: 2}}/>}
        {testAttemptError && <Alert severity="error" sx={{my: 2}}>Error processing submission: {testAttemptError}</Alert>}
        {submissionResult ? (
          <Box sx={{my: 2}}>
            <Typography variant="h6">Your Score: {submissionResult.score} / {submissionResult.totalQuestions}</Typography>
            <Typography>Accuracy: {submissionResult.accuracy}%</Typography>
            {/* TODO: Add more detailed results or a link to the full TestResultPage */}
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate(`/tests/${examId}/result`)} // Navigate to the detailed results page
              sx={{ mt: 3, mr: 1 }}
            >
              View Detailed Results
            </Button>
            <Button variant="outlined" onClick={() => navigate('/student/dashboard')} sx={{ mt: 3 }}>
              Back to Student Dashboard
            </Button>
          </Box>
        ) : (
          !testAttemptError && <Typography sx={{my: 2}}>Processing your results...</Typography>
        )}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h5" component="h1">
          {currentExamDetails.name}
        </Typography>
        <Typography variant="h6" color={timeLeftSeconds <= 60 ? 'error.dark' : 'text.primary'} sx={{fontWeight: 'bold'}}>
          Time Left: {formatTime(timeLeftSeconds)}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" gutterBottom>
          Question {currentQuestionIndex + 1} of {currentExamDetails.questions.length}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 2, fontWeight: '500', minHeight: '3em' }}>
          {currentQuestionData?.text || 'Question text loading...'}
        </Typography>

        {currentQuestionData && (
          <FormControl component="fieldset" sx={{ mt: 1, width: '100%' }}>
            <RadioGroup
              value={userAnswers[currentQuestionData._id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestionData._id, e.target.value)}
            >
              {currentQuestionData.options.map((option, index) => (
                <FormControlLabel
                  key={option._id || `opt-${index}`}
                  value={option.text} // Assuming option.text is the value to store
                  control={<Radio />}
                  label={option.text}
                  sx={{
                    mb: 1,
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    '&.Mui-selected': { backgroundColor: '#e3f2fd', borderColor: '#90caf9' }, // Example styling for selected
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt:2, borderTop: '1px solid #eee' }}>
        <Button
          variant="outlined"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={testAttemptStatus === 'loading'}
        >
          {testAttemptStatus === 'loading' ? <CircularProgress size={24}/> : 'Submit Test'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleNextQuestion}
          disabled={!currentExamDetails || currentQuestionIndex >= currentExamDetails.questions.length - 1}
        >
          Next
        </Button>
      </Box>
    </StyledPaper>
  );
};

export default MockTestScreen;
