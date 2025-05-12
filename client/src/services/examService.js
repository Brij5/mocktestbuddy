import axios from 'axios';

// Define base URLs. Adjust if needed.
const CATEGORIES_API_URL = '/api/categories';
const EXAMS_API_URL = '/api/exams';

// Exam service
export const examService = {
  /**
   * Fetches all exam categories.
   * @returns {Promise<Array>} - Array of category objects
   */
  getAllCategories: async () => {
    try {
      // Public endpoint, no token needed for now
      const response = await axios.get(CATEGORIES_API_URL);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error(error.message || 'Failed to fetch categories');
    }
  },

  /**
   * Fetches all exams (potentially filtered).
   * @param {object} filters - Optional filters (e.g., { categoryId: '...' })
   * @returns {Promise<Array>} - Array of exam objects
   */
  getAllExams: async (filters = {}) => {
    try {
      // Public endpoint for now
      // TODO: Add filter query parameters if needed
      const response = await axios.get(EXAMS_API_URL, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error(error.message || 'Failed to fetch exams');
    }
  },

  /**
   * Fetches all exams (intended for admin).
   * @returns {Promise<Array>} A list of all exams.
   */
  getAllExamsAdmin: async () => {
    try {
      // TODO: Add token for authentication if route becomes protected
      const response = await axios.get(`${EXAMS_API_URL}/admin`);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error(error.message || 'Failed to fetch exams');
    }
  },

  /**
   * Fetches exams filtered by category ID.
   * @param {string} categoryId - The ID of the category.
   * @returns {Promise<Array>} - Array of exam objects in that category.
   */
  getExamsByCategory: async (categoryId) => {
    try {
      // This endpoint needs to be created on the backend:
      const response = await axios.get(`${EXAMS_API_URL}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error(error.message || 'Failed to fetch exams for the category');
    }
  },

  /**
   * Fetches details for a single exam by its ID.
   * @param {string} examId - The ID of the exam.
   * @returns {Promise<object>} The exam details.
   */
  getExamDetails: async (examId) => {
    try {
      const response = await axios.get(`${EXAMS_API_URL}/${examId}`);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error(error.message || 'Failed to fetch exam details');
    }
  },

  /**
   * Fetches all exams.
   * @returns {Promise<Array>} - Array of exam objects
   */
  getAllExamsList: async () => {
    try {
      const response = await axios.get('/api/exams');
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error('Failed to fetch exams');
    }
  },

  /**
   * Fetches a single exam by ID.
   * @param {string} examId - The ID of the exam to fetch
   * @returns {Promise<object>} - Exam object
   */
  getExamById: async (examId) => {
    try {
      const response = await axios.get(`/api/exams/${examId}`);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error('Exam not found');
    }
  },

  /**
   * Creates a new exam.
   * @param {object} examData - Exam data to create
   * @returns {Promise<object>} - Created exam object
   */
  createExam: async (examData) => {
    try {
      const response = await axios.post('/api/exams', examData);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error('Failed to create exam');
    }
  },

  /**
   * Updates an existing exam.
   * @param {string} examId - The ID of the exam to update
   * @param {object} examData - Updated exam data
   * @returns {Promise<object>} - Updated exam object
   */
  updateExam: async (examId, examData) => {
    try {
      const response = await axios.put(`/api/exams/${examId}`, examData);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error('Failed to update exam');
    }
  },

  /**
   * Deletes an exam.
   * @param {string} examId - The ID of the exam to delete
   * @returns {Promise<object>} - Response object
   */
  deleteExam: async (examId) => {
    try {
      const response = await axios.delete(`/api/exams/${examId}`);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error('Failed to delete exam');
    }
  },

  /**
   * Creates a new category (Admin only).
   * @param {object} categoryData - { name, description }
   * @returns {Promise<object>} - The created category object
   */
  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(CATEGORIES_API_URL, categoryData);
      return response.data;
    } catch (error) {
      throw error.response && error.response.data && error.response.data.message
        ? new Error(error.response.data.message)
        : new Error(error.message || 'Failed to create category');
    }
  },

  // Add getCategoryById, updateCategory, deleteCategory etc. later
  // Add getExamById, updateExam, deleteExam etc. later
};
