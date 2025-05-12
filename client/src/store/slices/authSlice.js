import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService'; // Adjust path as needed

// --- Async Thunks ---

// Login Thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data; // This will be the action.payload in the fulfilled case
    } catch (error) {
      // Use rejectWithValue to pass the error message as payload
      return rejectWithValue(error.message);
    }
  }
);

// Register Thunk
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      // Registration returns a message, not user data directly
      return data.message; // Return the success message
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Request Password Reset Thunk
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.requestPasswordReset(email);
      return data.message; // Return success message
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Reset Password Thunk
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(token, password);
      return data.message; // Return success message
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout Thunk
export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  // Client-side logout: Clear state and storage
  localStorage.removeItem('userInfo');
  // Dispatch synchronous action to clear state immediately
  dispatch(authSlice.actions.userLogout()); 
  // Optional: Call backend logout if needed (e.g., for token blacklisting)
  // try { await authService.logout(); } catch (e) { console.error("Backend logout failed", e); }
});

// --- Slice Definition ---

// Attempt to load user info from localStorage (e.g., after a page refresh)
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage, // User object + token upon login
  loading: false,
  error: null,
  redirectPath: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState, // Keep existing state
    resetRequestSuccessMessage: null, // For forgot password success
    resetRequestError: null, // For forgot password error
    resetSuccessMessage: null, // For reset password success
    resetError: null, // For reset password error
  },
  reducers: {
    // Reducer for when login/register request starts
    userAuthRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Reducer for successful login/register
    userAuthSuccess: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
      // Determine redirect path based on user role
      state.redirectPath = action.payload.role === 'Admin' 
        ? '/admin/dashboard'
        : action.payload.role === 'ExamManager'
          ? '/exam-manager/dashboard'
          : '/dashboard';
      // Save user info to localStorage
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // Reducer for failed login/register
    userAuthFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.userInfo = null; // Clear user info on fail
      localStorage.removeItem('userInfo'); // Clear localStorage on fail
    },
    // Reducer for logout (synchronous, but can be handled here too)
    userLogout: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = null; // Clear general auth errors on logout
      // Clear specific messages too if needed
      state.resetRequestSuccessMessage = null;
      state.resetRequestError = null;
      state.resetSuccessMessage = null;
      state.resetError = null;
    },
    clearAuthMessages: (state) => {
       state.error = null;
       state.resetRequestSuccessMessage = null;
       state.resetRequestError = null;
       state.resetSuccessMessage = null;
       state.resetError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Payload is user data + token
        state.error = null;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Payload is the error message
        state.userInfo = null;
        localStorage.removeItem('userInfo');
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // Registration successful, but user is not logged in yet.
        // We might set a success message here if needed, or handle in component.
        state.error = null;
        // Don't set userInfo or localStorage here, user needs to verify/login
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Payload is the error message
      })
      // Request Password Reset cases
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.resetRequestSuccessMessage = null;
        state.resetRequestError = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.resetRequestSuccessMessage = action.payload;
        state.resetRequestError = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.resetRequestSuccessMessage = null;
        state.resetRequestError = action.payload;
      })
      // Reset Password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.resetSuccessMessage = null;
        state.resetError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetSuccessMessage = action.payload;
        state.resetError = null;
        // Password reset successful, user is NOT logged in automatically.
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetSuccessMessage = null;
        state.resetError = action.payload;
      })
      // Logout case handled by synchronous reducer via thunk dispatch
      // .addCase(logout.fulfilled, (state) => { ... }); // No longer needed here if using sync reducer
  },
});

// Export actions generated by createSlice
export const { 
  userAuthRequest, 
  userAuthSuccess, 
  userAuthFail, 
  userLogout, // Keep synchronous logout action if dispatched by thunk
  clearAuthMessages // Added action to clear feedback messages
} = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.userInfo;

export default authSlice.reducer;
