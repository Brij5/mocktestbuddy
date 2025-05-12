import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Import your API service functions here, e.g.:
import { 
  getExamManagerStats, 
  getExamManagerRecentActivity, 
  getManagedExams 
} from '../../services/examManagerService';

const initialState = {
  stats: null, // Example: { totalExams: 0, activeExams: 0, totalQuestions: 0 }
  recentActivity: [], // Example: [{ type: 'EXAM_CREATED', details: 'Math 101', timestamp: '...' }]
  managedExams: [], // List of exams managed by the Exam Manager
  loadingStats: false,
  loadingRecentActivity: false,
  loadingManagedExams: false,
  error: null,
};

// --- Async Thunks ---

// Fetch Exam Manager Stats
export const fetchExamManagerStats = createAsyncThunk(
  'examManager/fetchStats',
  async (_, { rejectWithValue }) => { // No need for getState if token is handled by service
    try {
      const data = await getExamManagerStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  }
);

// Fetch Recent Activity
export const fetchRecentActivity = createAsyncThunk(
  'examManager/fetchRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getExamManagerRecentActivity();
      return data;
    } catch (error) {
      return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  }
);

// Fetch Managed Exams
export const fetchManagedExams = createAsyncThunk(
  'examManager/fetchManagedExams',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getManagedExams();
      return data;
    } catch (error) {
      return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  }
);

const examManagerSlice = createSlice({
  name: 'examManager',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add other synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // fetchExamManagerStats
      .addCase(fetchExamManagerStats.pending, (state) => {
        state.loadingStats = true;
        state.error = null;
      })
      .addCase(fetchExamManagerStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchExamManagerStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.error = action.payload;
      })
      // fetchRecentActivity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loadingRecentActivity = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.loadingRecentActivity = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.loadingRecentActivity = false;
        state.error = action.payload;
      })
      // fetchManagedExams
      .addCase(fetchManagedExams.pending, (state) => {
        state.loadingManagedExams = true;
        state.error = null;
      })
      .addCase(fetchManagedExams.fulfilled, (state, action) => {
        state.loadingManagedExams = false;
        state.managedExams = action.payload;
      })
      .addCase(fetchManagedExams.rejected, (state, action) => {
        state.loadingManagedExams = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = examManagerSlice.actions;

// Selectors
export const selectExamManagerStats = (state) => state.examManager.stats;
export const selectRecentActivity = (state) => state.examManager.recentActivity;
export const selectManagedExams = (state) => state.examManager.managedExams;
export const selectExamManagerLoading = (state) => (
  state.examManager.loadingStats || 
  state.examManager.loadingRecentActivity || 
  state.examManager.loadingManagedExams
);
export const selectExamManagerError = (state) => state.examManager.error;

export default examManagerSlice.reducer;
