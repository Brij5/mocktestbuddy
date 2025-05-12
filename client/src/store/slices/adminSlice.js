import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API endpoints
const API_BASE_URL = 'http://localhost:5000/api/admin';

// Async Thunks
export const getStats = createAsyncThunk('admin/getStats', async () => {
  const response = await axios.get(`${API_BASE_URL}/stats`);
  return response.data;
});

export const getRecentActivity = createAsyncThunk('admin/getRecentActivity', async () => {
  const response = await axios.get(`${API_BASE_URL}/activity`);
  return response.data;
});

export const getUsers = createAsyncThunk('admin/getUsers', async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
});

export const createUser = createAsyncThunk('admin/createUser', async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
  return response.data;
});

export const updateUser = createAsyncThunk('admin/updateUser', async ({ id, ...userData }) => {
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
  return response.data;
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
  return response.data;
});

export const getExams = createAsyncThunk('admin/getExams', async () => {
  const response = await axios.get(`${API_BASE_URL}/exams`);
  return response.data;
});

export const createExam = createAsyncThunk('admin/createExam', async (examData) => {
  const response = await axios.post(`${API_BASE_URL}/exams`, examData);
  return response.data;
});

export const updateExam = createAsyncThunk('admin/updateExam', async ({ id, ...examData }) => {
  const response = await axios.put(`${API_BASE_URL}/exams/${id}`, examData);
  return response.data;
});

export const deleteExam = createAsyncThunk('admin/deleteExam', async (examId) => {
  const response = await axios.delete(`${API_BASE_URL}/exams/${examId}`);
  return response.data;
});

// Initial State
const initialState = {
  stats: null,
  recentActivity: [],
  users: [],
  exams: [],
  loading: false,
  error: null,
};

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(getStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Recent Activity
    builder
      .addCase(getRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivity = action.payload;
      })
      .addCase(getRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Users
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload._id);
      });

    // Exams
    builder
      .addCase(getExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(getExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex(exam => exam._id === action.payload._id);
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter(exam => exam._id !== action.payload._id);
      });
  },
});

export default adminSlice.reducer;
