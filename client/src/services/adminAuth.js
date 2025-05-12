import axios from 'axios';

// Admin auth service
export const adminAuthService = {
  // Admin login
  login: async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        return response.data;
      }
      throw new Error('Admin login failed');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin login failed');
    }
  },

  // Admin logout
  logout: async () => {
    try {
      const response = await axios.post('/api/admin/logout');
      if (response.data.success) {
        localStorage.removeItem('adminInfo');
        return response.data;
      }
      throw new Error('Admin logout failed');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin logout failed');
    }
  },

  // Get current admin
  getCurrentAdmin: () => {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? JSON.parse(adminInfo) : null;
  }
};
