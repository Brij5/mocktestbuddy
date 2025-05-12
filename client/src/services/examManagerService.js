import axios from 'axios';

const API_URL = '/api/exam-manager'; // Base URL for exam manager routes

// Helper to get the token from localStorage or auth state
const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

// Fetch Exam Manager Statistics
export const getExamManagerStats = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(`${API_URL}/stats`, config);
  return data;
};

// Fetch Recent Activity for Exam Manager
export const getExamManagerRecentActivity = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(`${API_URL}/recent-activity`, config);
  return data;
};

// Fetch all exams managed by the Exam Manager
export const getManagedExams = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(`${API_URL}/exams`, config);
  return data;
};

// You can add more service functions here as needed, e.g., for creating/updating/deleting exams
// by the Exam Manager, ensuring they operate within their managed categories.

export const examManagerService = {
  getExamManagerStats,
  getExamManagerRecentActivity,
  getManagedExams,
};
