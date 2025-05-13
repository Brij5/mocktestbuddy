import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  RadioGroup,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'; 
import { questions } from '../../data/mocks/testAttemptMocks'; 

const TestAttemptPage = () => { 
  const navigate = useNavigate();
  const { testId } = useParams(); 

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleTestSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting test:', {
        testId,
        answers: selectedAnswers,
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate(`/student/test-result/${testId}`); 
    } catch (err) {
      console.error('Failed to submit test:', err);
      setError('Failed to submit test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [testId, selectedAnswers, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { 
          clearInterval(timer);
          handleTestSubmit(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, [handleTestSubmit]); 

  const handleAnswerSelect = useCallback((questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{mt: 2}}>Go Back</Button>
      </Container>
    );
  }
  
  if (!questions || questions.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6">Loading questions or no questions available for this test.</Typography>
        <CircularProgress sx={{mt: 2}}/>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test: {testId} 
      </Typography>

      <Box sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom align="right">
          Time Remaining: {formatTime(timeLeft)}
        </Typography>
        <CircularProgress
          variant="determinate"
          value={(timeLeft / 1800) * 100}
          sx={{ width: '100%', height: '10px', mt: 1 }}
          color={timeLeft < 300 ? (timeLeft < 60 ? 'error' : 'warning') : 'primary'}
        />
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Question {currentQuestion + 1} of {questions.length}
        </Typography>

        <Typography variant="body1" paragraph sx={{minHeight: '3em'}}>
          {questions[currentQuestion]?.question || 'Question text not available.'}
        </Typography>

        {questions[currentQuestion]?.options.map((option) => (
          <Button
            key={option.id}
            variant={
              selectedAnswers[questions[currentQuestion].id] === option.id
                ? 'contained'
                : 'outlined'
            }
            fullWidth
            sx={{ mb: 1.5, py: 1.5, justifyContent: 'flex-start', textAlign: 'left' }}
            onClick={() => handleAnswerSelect(questions[currentQuestion].id, option.id)}
          >
            {option.text}
          </Button>
        ))}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            disabled={currentQuestion === 0}
            onClick={handlePreviousQuestion}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            disabled={currentQuestion === questions.length - 1}
            onClick={handleNextQuestion}
          >
            Next
          </Button>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTestSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit Test'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestAttemptPage; 
