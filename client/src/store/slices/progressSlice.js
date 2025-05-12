import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming you use axios for API calls

const initialState = {
  recentAttempts: [], // Array of attempt objects { _id, examName, completedAt, accuracy, score, totalQuestions }
  overallProgress: {
    averageAccuracy: 0,
    totalStudyTime: 0, // in minutes or hours
    examsCompleted: 0,
    strongSubjects: [], // Array of strings or objects { subject: 'Math', accuracy: 90 }
    weakSubjects: [],   // Array of strings or objects { subject: 'Physics', accuracy: 60 }
    // Potentially add more detailed stats like performanceBySubject: [{ subject: 'Math', accuracy: 75 }, ...]
    // weakAreas: [], // e.g., [{ topic: 'Algebra', suggestion: 'Review chapter 3' }]
  },
  currentAttemptDetails: null, // For viewing a specific past attempt
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null, // Stores error message if an API call fails
};

// Async Thunk to fetch all student progress data
export const fetchStudentProgressData = createAsyncThunk(
  'progress/fetchStudentProgressData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState(); // Get user token for authenticated request
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      // Replace with your actual API endpoint
      const response = await axios.get('/api/progress/me', config);
      return response.data.data; // Assuming API returns data in { data: { recentAttempts: [], overallProgress: {} } }
    } catch (error) {
      const message = 
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Async Thunk to fetch details of a single past attempt
export const fetchAttemptDetails = createAsyncThunk(
  'progress/fetchAttemptDetails',
  async (attemptId, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.get(`/api/progress/attempts/${attemptId}`, config);
      return response.data.data;
    } catch (error) {
      const message = 
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    resetProgressState: (state) => {
      state.recentAttempts = [];
      state.overallProgress = initialState.overallProgress;
      state.currentAttemptDetails = null;
      state.loading = 'idle';
      state.error = null;
    },
    // You can add other synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch all progress data
      .addCase(fetchStudentProgressData.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchStudentProgressData.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.recentAttempts = action.payload.recentAttempts || [];
        state.overallProgress = action.payload.overallProgress || initialState.overallProgress;
        state.error = null;
      })
      .addCase(fetchStudentProgressData.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // Fetch single attempt details
      .addCase(fetchAttemptDetails.pending, (state) => {
        state.loading = 'pending'; // Or a specific loading flag for this action
        state.error = null;
      })
      .addCase(fetchAttemptDetails.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.currentAttemptDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchAttemptDetails.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetProgressState } = progressSlice.actions;

// Selectors
export const selectRecentAttempts = (state) => state.progress.recentAttempts;
export const selectOverallProgress = (state) => state.progress.overallProgress;
export const selectCurrentAttemptDetails = (state) => state.progress.currentAttemptDetails;
export const selectProgressLoading = (state) => state.progress.loading;
export const selectProgressError = (state) => state.progress.error;

export default progressSlice.reducer;
