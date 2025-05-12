import axios from 'axios';

// Mock data
const mockUserData = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'Student',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

const mockExamData = {
  id: '123',
  name: 'Mock Exam',
  description: 'This is a mock exam',
  category: '123',
  durationMinutes: 60,
  totalMarks: 100,
  passingMarks: 40,
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  categoryDetails: {
    id: '123',
    name: 'Mock Category',
    description: 'This is a mock category',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
};

const mockTestCategory = {
  id: '456',
  name: 'Test Category',
  description: 'This is a test category',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

export const mockAxios = () => {
  // Mock axios methods
  axios.get.mockImplementation((url) => {
    switch (url) {
      case '/api/auth/me':
        return Promise.resolve({ data: mockUserData });
      case '/api/exams':
        return Promise.resolve({ data: [mockExamData] });
      case '/api/exams/123':
        return Promise.resolve({ data: mockExamData });
      case '/api/categories':
        return Promise.resolve({ data: [mockTestCategory] });
      case '/api/categories/456':
        return Promise.resolve({ data: mockTestCategory });
      case '/api/exams/category/456':
        return Promise.resolve({ data: [mockExamData] });
      default:
        return Promise.reject(new Error('Not implemented'));
    }
  });

  axios.post.mockImplementation((url, data) => {
    switch (url) {
      case '/api/auth/login':
        return Promise.resolve({
          data: {
            token: 'mock-token',
            user: mockUserData
          }
        });
      case '/api/auth/register':
        return Promise.resolve({
          data: {
            token: 'mock-token',
            user: { ...mockUserData, id: '456' }
          }
        });
      case '/api/exams':
        return Promise.resolve({
          data: {
            id: '456',
            ...data
          }
        });
      case '/api/categories':
        return Promise.resolve({
          data: {
            id: '789',
            ...data
          }
        });
      default:
        return Promise.reject(new Error('Not implemented'));
    }
  });

  axios.put.mockImplementation((url, data) => {
    switch (url) {
      case '/api/exams/123':
        return Promise.resolve({
          data: {
            id: '123',
            ...data
          }
        });
      case '/api/categories/456':
        return Promise.resolve({
          data: {
            id: '456',
            ...data
          }
        });
      default:
        return Promise.reject(new Error('Not implemented'));
    }
  });

  axios.delete.mockImplementation((url) => {
    switch (url) {
      case '/api/exams/123':
        return Promise.resolve({ data: { success: true } });
      case '/api/categories/456':
        return Promise.resolve({ data: { success: true } });
      default:
        return Promise.reject(new Error('Not implemented'));
    }
  });

  return axios;
};

export const mockApiError = (error = 'API Error') => {
  const errorResponse = {
    response: {
      data: { message: error },
      status: 500,
      statusText: 'Internal Server Error'
    }
  };

  axios.get.mockRejectedValue(errorResponse);
  axios.post.mockRejectedValue(errorResponse);
  axios.put.mockRejectedValue(errorResponse);
  axios.delete.mockRejectedValue(errorResponse);
};

export const mockValidationError = (errors = {}) => {
  const errorResponse = {
    response: {
      data: {
        message: 'Validation failed',
        errors
      },
      status: 400,
      statusText: 'Bad Request'
    }
  };

  axios.post.mockRejectedValue(errorResponse);
  axios.put.mockRejectedValue(errorResponse);
};

export const mockUnauthorizedError = () => {
  const errorResponse = {
    response: {
      data: { message: 'Unauthorized' },
      status: 401,
      statusText: 'Unauthorized'
    }
  };

  axios.get.mockRejectedValue(errorResponse);
  axios.post.mockRejectedValue(errorResponse);
  axios.put.mockRejectedValue(errorResponse);
  axios.delete.mockRejectedValue(errorResponse);
};

export const resetAxiosMocks = () => {
  axios.get.mockReset();
  axios.post.mockReset();
  axios.put.mockReset();
  axios.delete.mockReset();
};
