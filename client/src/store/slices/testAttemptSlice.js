import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming axios for API calls

const initialState = {
  examId: null,
  currentExamDetails: null, // Will store { id, name, description, durationMinutes, questions: [], totalQuestions }
  startTime: null,
  endTime: null, // To be set on submission
  timeLeftSeconds: null,
  currentQuestionIndex: 0,
  userAnswers: {}, // Renamed from answers
  markedForReview: [],
  isSubmitted: false,
  submissionResult: null, // To store score, etc., after submission
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunk to start a test attempt (fetches exam details)
export const startTestAttempt = createAsyncThunk(
  'testAttempt/start',
  async (examId, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      // TODO: Replace with actual API endpoint to fetch exam details for an attempt
      // This endpoint should return the exam (id, name, questions, durationMinutes, etc.)
      const response = await axios.get(`/api/v1/exams/${examId}/for-attempt`, config);
      // Assuming response.data.data contains the exam object with questions and durationMinutes
      return { examDetails: response.data.data, examId, startTime: new Date().toISOString() };
    } catch (error) {
      const message = 
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Thunk to submit the completed test attempt
export const submitTestAttempt = createAsyncThunk(
  'testAttempt/submit',
  async (_, { getState, rejectWithValue }) => {
    const {
      examId,
      userAnswers,
      startTime,
      currentExamDetails
    } = getState().testAttempt;
    
    if (!currentExamDetails || !currentExamDetails.questions) {
        return rejectWithValue('Exam details not loaded or no questions found.');
    }

    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const attemptData = {
        examId,
        answers: userAnswers,
        startTime,
        endTime: new Date().toISOString(),
        totalQuestions: currentExamDetails.questions.length,
        // The backend will calculate score, accuracy, etc.
      };
      // TODO: Replace with actual API endpoint to submit test attempt
      const response = await axios.post('/api/v1/test-attempts/submit', attemptData, config);
      return response.data.data; // Assuming API returns attempt result (score, feedback, etc.)
    } catch (error) {
      const message = 
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);


const testAttemptSlice = createSlice({
  name: 'testAttempt',
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    resetTestAttempt: (_state) => {
      // Preserve examId if needed for retake, or reset fully
      // For now, a full reset for simplicity upon leaving the test screen
      return initialState;
    },
    moveToQuestion: (state, action) => {
      const newIndex = action.payload;
      if (state.currentExamDetails && newIndex >= 0 && newIndex < state.currentExamDetails.questions.length) {
        state.currentQuestionIndex = newIndex;
      }
    },
    updateUserAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.userAnswers[questionId] = answer;
    },
    toggleMarkForReview: (state, action) => {
      const questionId = action.payload;
      const index = state.markedForReview.indexOf(questionId);
      if (index !== -1) {
        state.markedForReview.splice(index, 1);
      } else {
        state.markedForReview.push(questionId);
      }
    },
    setTimer: (state, action) => { // Action to initialize timer
        state.timeLeftSeconds = action.payload; // payload should be duration in seconds
    },
    tickTimer: (state) => { // Action to decrement timer
        if (state.timeLeftSeconds > 0) {
            state.timeLeftSeconds -= 1;
        }
    },
    clearTestError: (_state) => { // Prefixed state with underscore
        _state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Start Test Attempt
      .addCase(startTestAttempt.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        // Reset parts of the state for a new attempt
        state.currentExamDetails = null;
        state.startTime = null;
        state.timeLeftSeconds = null;
        state.currentQuestionIndex = 0;
        state.userAnswers = {};
        state.markedForReview = [];
        state.isSubmitted = false;
        state.submissionResult = null;
      })
      .addCase(startTestAttempt.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentExamDetails = action.payload.examDetails;
        state.examId = action.payload.examId;
        state.startTime = action.payload.startTime;
        // Initialize timeLeftSeconds based on duration (e.g., durationMinutes * 60)
        if (action.payload.examDetails && action.payload.examDetails.durationMinutes) {
          state.timeLeftSeconds = action.payload.examDetails.durationMinutes * 60;
        } else {
          state.timeLeftSeconds = 3600; // Default to 1 hour if not specified
        }
      })
      .addCase(startTestAttempt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Submit Test Attempt
      .addCase(submitTestAttempt.pending, (state) => {
        state.status = 'loading'; // Or 'submitting'
        state.endTime = new Date().toISOString(); // Record end time optimistically
      })
      .addCase(submitTestAttempt.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isSubmitted = true;
        state.submissionResult = action.payload; // Store score, results, etc.
        state.timeLeftSeconds = 0; // Stop timer
      })
      .addCase(submitTestAttempt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
      // Removed submitAnswer and markForReview thunks as they are now reducers
  },
});

export const {
  resetTestAttempt,
  moveToQuestion,
  updateUserAnswer,
  toggleMarkForReview,
  setTimer,
  tickTimer,
  clearTestError
} = testAttemptSlice.actions;

// Selectors
export const selectCurrentExamDetails = (state) => state.testAttempt.currentExamDetails;
export const selectCurrentQuestionIndex = (state) => state.testAttempt.currentQuestionIndex;
export const selectUserAnswers = (state) => state.testAttempt.userAnswers;
export const selectMarkedForReview = (state) => state.testAttempt.markedForReview;
export const selectIsTestSubmitted = (state) => state.testAttempt.isSubmitted;
export const selectTestSubmissionResult = (state) => state.testAttempt.submissionResult;
export const selectTimeLeftSeconds = (state) => state.testAttempt.timeLeftSeconds;
export const selectTestAttemptStatus = (state) => state.testAttempt.status;
export const selectTestAttemptError = (state) => state.testAttempt.error;


export default testAttemptSlice.reducer;
