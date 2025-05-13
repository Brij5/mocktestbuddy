import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

const API_BASE_URL = '/categories'; // Removed '/api' as it's in the baseURL of axios instance

// Async Thunks
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_BASE_URL);
    return response.data.data; // Assuming backend sends { success: true, count: N, data: [...] }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData, { rejectWithValue }) => {
  try {
    const response = await api.post(API_BASE_URL, categoryData);
    return response.data.data; // Assuming backend sends { success: true, data: { ... } }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ id, categoryData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`${API_BASE_URL}/${id}`, categoryData);
    return response.data.data; // Assuming backend sends { success: true, data: { ... } }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (categoryId, { rejectWithValue }) => {
  try {
    // The backend for deleteCategory in categoryController sends back the deactivated category object
    const response = await api.delete(`${API_BASE_URL}/${categoryId}`);
    return response.data.data; // Contains the deactivated category, or use categoryId if just need to filter
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  categories: [],
  currentCategory: null, // For holding a single category, e.g., when editing
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload; // Error message from rejectWithValue
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory && state.currentCategory._id === action.payload._id) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // Delete Category (Soft Delete)
      .addCase(deleteCategory.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        // The payload is the deactivated category object. We can update it in the list.
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload; // Reflects isActive: false
        }
        // Or, if you prefer to remove it from the list visually immediately:
        // state.categories = state.categories.filter((cat) => cat._id !== action.payload._id);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCurrentCategory, clearCurrentCategory } = categorySlice.actions;

export default categorySlice.reducer;
