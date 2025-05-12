import axios from 'axios';

// Define the base URL for category-related API calls
const API_BASE_URL = '/api/categories'; // Assumes proxy or same origin

const examCategoryService = {
  /**
   * Fetches all exam categories.
   * @returns {Promise<Array>} A list of categories.
   */
  getAllCategories: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Creates a new exam category.
   * @param {object} categoryData - Object containing { name, description }.
   * @returns {Promise<object>} The newly created category.
   */
  createCategory: async (categoryData) => {
    try {
      // TODO: Add token for authentication
      const response = await axios.post(API_BASE_URL, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Updates an existing exam category.
   * @param {string} categoryId - The ID of the category to update.
   * @param {object} categoryData - Object containing { name, description } updates.
   * @returns {Promise<object>} The updated category.
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      // TODO: Add token for authentication
      const response = await axios.put(`${API_BASE_URL}/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Deletes an exam category.
   * @param {string} categoryId - The ID of the category to delete.
   * @returns {Promise<object>} Success message or response data.
   */
  deleteCategory: async (categoryId) => {
    try {
      // TODO: Add token for authentication
      const response = await axios.delete(`${API_BASE_URL}/${categoryId}`);
      return response.data; // Usually a success message
    } catch (error) {
      console.error(`Error deleting category ${categoryId}:`, error);
      throw error;
    }
  },
};

export default examCategoryService;
