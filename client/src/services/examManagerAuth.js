import axios from 'axios';

// Exam Manager auth service
export const examManagerAuthService = {
  // Exam Manager login
  login: async (email, password) => {
    try {
      const response = await axios.post('/api/exam-manager/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('examManagerInfo', JSON.stringify(response.data.examManager));
        return response.data;
      }
      throw new Error('Exam Manager login failed');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Exam Manager login failed');
    }
  },

  // Exam Manager logout
  logout: async () => {
    try {
      const response = await axios.post('/api/exam-manager/logout');
      if (response.data.success) {
        localStorage.removeItem('examManagerInfo');
        return response.data;
      }
      throw new Error('Exam Manager logout failed');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Exam Manager logout failed');
    }
  },

  // Get current exam manager
  getCurrentExamManager: () => {
    const examManagerInfo = localStorage.getItem('examManagerInfo');
    return examManagerInfo ? JSON.parse(examManagerInfo) : null;
  },

  // Get all exam managers
  getAllExamManagers: async () => {
    try {
      const response = await axios.get('/api/exam-manager');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch exam managers');
    }
  },

  // Create new exam manager
  createExamManager: async (examManagerData) => {
    try {
      const response = await axios.post('/api/exam-manager', examManagerData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create exam manager');
    }
  },

  // Update exam manager
  updateExamManager: async (id, updates) => {
    try {
      const response = await axios.put(`/api/exam-manager/${id}`, updates);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update exam manager');
    }
  },

  // Delete exam manager
  deleteExamManager: async (id) => {
    try {
      const response = await axios.delete(`/api/exam-manager/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to delete exam manager');
    }
  }
};
