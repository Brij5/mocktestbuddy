import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examService } from '../../services/examService';
import examCategoryService from '../../services/examCategoryService';

// --- Async Thunks ---

// Fetch all exam categories
export const fetchCategories = createAsyncThunk(
  'exams/fetchCategories',
  async (_, { rejectWithValue }) => { 
    try {
      const categories = await examCategoryService.getAllCategories();
      return categories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a new category
export const createCategory = createAsyncThunk(
  'exams/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const data = await examCategoryService.createCategory(categoryData);
      return data; 
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Async thunk for updating an existing category
export const updateCategory = createAsyncThunk(
  'exams/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const data = await examCategoryService.updateCategory(categoryId, categoryData);
      return data; // Return the updated category object
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Async thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  'exams/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      // The service function returns { message: '...' } on success
      await examCategoryService.deleteCategory(categoryId);
      return categoryId; // Return the ID of the deleted category for the reducer
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching exams by category ID
export const fetchExamsByCategory = createAsyncThunk(
  'exams/fetchByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const data = await examService.getExamsByCategory(categoryId);
      return { categoryId, exams: data };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching single exam details by ID
export const fetchExamDetails = createAsyncThunk(
  'exams/fetchDetails',
  async (examId, { rejectWithValue }) => {
    try {
      const data = await examService.getExamDetails(examId);
      return data; 
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching all exams (for admin)
export const fetchAllExamsAdmin = createAsyncThunk(
  'exams/fetchAllAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const data = await examService.getAllExamsAdmin();
      return data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// --- Initial State ---
const initialState = {
  categories: [], 
  examsByCategory: {}, 
  currentExam: null, 
  loading: false,
  error: null,
  examStatus: 'idle', 
  examError: null,
  currentExamDetails: {
    data: null,
    status: 'idle', 
    error: null,
  },
  categoryStatus: 'idle', // Add status for category creation
  categoryError: null, // Add error state for category creation
  allExams: [], // List of all exams (for admin view)
  allExamsStatus: 'idle',
  allExamsError: null,
};

// --- Slice Definition ---
const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearExamError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories cases
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; 
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
        state.categories = []; 
      })
      // Handle fetchExamsByCategory
      .addCase(fetchExamsByCategory.pending, (state, action) => {
        const categoryId = action.meta.arg;
        state.examsByCategory[categoryId] = { status: 'loading', data: [], error: null };
        state.examStatus = 'loading';
      })
      .addCase(fetchExamsByCategory.fulfilled, (state, action) => {
        const { categoryId, exams } = action.payload;
        state.examsByCategory[categoryId] = { status: 'succeeded', data: exams, error: null };
        state.examStatus = 'succeeded'; 
      })
      .addCase(fetchExamsByCategory.rejected, (state, action) => {
        const categoryId = action.meta.arg;
        state.examsByCategory[categoryId] = { status: 'failed', data: [], error: action.payload };
        state.examStatus = 'failed'; 
        state.examError = action.payload; 
      })
      // Handle fetchExamDetails
      .addCase(fetchExamDetails.pending, (state) => {
        state.currentExamDetails.status = 'loading';
        state.currentExamDetails.data = null;
        state.currentExamDetails.error = null;
      })
      .addCase(fetchExamDetails.fulfilled, (state, action) => {
        state.currentExamDetails.status = 'succeeded';
        state.currentExamDetails.data = action.payload;
        state.currentExamDetails.error = null;
      })
      .addCase(fetchExamDetails.rejected, (state, action) => {
        state.currentExamDetails.status = 'failed';
        state.currentExamDetails.data = null;
        state.currentExamDetails.error = action.payload;
      })
      // Handle createCategory
      .addCase(createCategory.pending, (state) => {
        state.categoryStatus = 'loading'; 
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.categoryStatus = 'succeeded'; 
        state.categoryError = null; 
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categoryStatus = 'failed'; 
        state.categoryError = action.payload; 
      })
      // Handle updateCategory
      .addCase(updateCategory.pending, (state) => {
        // Optional: Set specific loading state for updating
        state.categoryStatus = 'loading'; // Or 'updating'
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        // Find the index of the category to update
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          // Replace the old category object with the updated one
          state.categories[index] = action.payload;
        }
        state.categoryStatus = 'succeeded';
        state.categoryError = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categoryStatus = 'failed';
        state.categoryError = action.payload; // Store the update error
      })
      // Handle deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        // Optional: Set specific loading state for deleting
        state.categoryStatus = 'loading'; // Or 'deleting'
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        // action.payload is the categoryId passed back from the thunk
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
        state.categoryStatus = 'succeeded';
        state.categoryError = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.categoryStatus = 'failed';
        state.categoryError = action.payload; // Store the delete error
      })
      // Handle fetchAllExamsAdmin
      .addCase(fetchAllExamsAdmin.pending, (state) => {
        state.allExamsStatus = 'loading';
        state.allExamsError = null;
      })
      .addCase(fetchAllExamsAdmin.fulfilled, (state, action) => {
        state.allExamsStatus = 'succeeded';
        state.allExams = action.payload;
        state.allExamsError = null;
      })
      .addCase(fetchAllExamsAdmin.rejected, (state, action) => {
        state.allExamsStatus = 'failed';
        state.allExams = []; // Clear exams on failure
        state.allExamsError = action.payload;
      });
  },
});

// Export actions
export const { clearExamError } = examSlice.actions;

// Export the reducer
export default examSlice.reducer;
