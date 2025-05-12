import axios from 'axios';

// Define the base URL for the API. Adjust if your backend runs on a different port/URL.
// Consider using environment variables for this in a real application.
// Using relative URL, assumes frontend/backend on same origin or proxy configured
const USERS_API_URL = '/api/user'; // Base URL for user endpoints (login, profile, register)
const AUTH_API_URL = '/api/auth'; // Base URL for other auth endpoints (refresh, logout - if they exist)

// Auth service
export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      // Corrected endpoint
      const response = await axios.post(`${USERS_API_URL}/login`, credentials);
      // Return data for the slice to handle
      return response.data; 
      // Removed localStorage logic from service
    } catch (error) {
      // Re-throw a structured error for the slice to handle
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) ||
        error.message ||
        error.toString();
      // Throw the message directly to be caught by rejectWithValue in the thunk
      throw new Error(message);
    }
  },

  // Register user
  register: async (userData) => { // Updated signature to accept userData object
    try {
      // Corrected endpoint to use USERS_API_URL
      const response = await axios.post(`${USERS_API_URL}/register`, userData);
      // Registration might just return a success message or minimal data
      return response.data; 
      // Removed localStorage logic
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw new Error(message);
    }
  },

  // Logout user - Assuming endpoint exists
  logout: async () => {
    try {
      // Backend might handle cookie clearing etc. Frontend primarily clears local state.
      await axios.post(`${AUTH_API_URL}/logout`); 
      // No data needed on success, Redux slice handles clearing state/localStorage
      return true; 
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw new Error(message);
    }
  },

  // Refresh token - Assuming endpoint exists
  refreshToken: async () => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/refresh-token`);
      // Return token for slice to handle updating state/localStorage
      return response.data; 
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw new Error(message);
    }
  },

  // Get current user (Profile) - Uses /api/users/profile
  getCurrentUserProfile: async () => {
    // This typically requires the token to be sent in headers
    // Axios instance should be configured with interceptors to add Auth header
    try {
      const response = await axios.get(`${USERS_API_URL}/profile`);
      return response.data;
    } catch (error) {
       const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw new Error(message);
    }
  },

  // Get current user info from storage (synchronous helper)
  getCurrentUserFromStorage: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Update user profile - Uses /api/users/profile
  updateProfile: async (updates) => {
    // Assumes Axios interceptor adds Auth header
    try {
      const response = await axios.put(`${USERS_API_URL}/profile`, updates);
       // Return updated user data for slice to handle
      return response.data; 
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw new Error(message);
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${USERS_API_URL}/forgot-password`, { email });
      // Return success message or data for the slice
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw new Error(message);
    }
  },

  // Reset password using token
  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(`${USERS_API_URL}/reset-password/${token}`, { password });
      // Return success message or data for the slice
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw new Error(message);
    }
  }
};
