import { examManagerAuthService } from '../../../services/examManagerAuth';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';

// Mock axios methods
const mockAxios = {
  __esModule: true,
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

jest.mock('axios', () => mockAxios);

// Import Jest globals
import '@testing-library/jest-dom';
import '@testing-library/react';

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: function() {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function() {}, // deprecated
      removeListener: function() {}, // deprecated
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {}
    };
  }
});

// Mock IntersectionObserver for scroll/visibility tests
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock localStorage
window.localStorage = {
  getItem: () => {},
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

// Mock axios
jest.mock('axios', () => ({
  __esModule: true,
  post: () => Promise.resolve({ data: {} }),
  get: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} })
}));

describe('Exam Manager Auth Service', () => {
  const mockExamManager = {
    _id: '123',
    name: 'Exam Manager',
    email: 'exam-manager@example.com',
    role: 'exam-manager',
    token: 'exam-manager-token'
  };

  const mockExamManagerData = {
    name: 'New Exam Manager',
    email: 'new-exam-manager@example.com',
    password: 'password',
    role: 'exam-manager'
  };

  beforeEach(() => {
    // Reset mock implementations before each test
    mockAxios.post.mockClear();
    mockAxios.get.mockClear();
    mockAxios.put.mockClear();
    mockAxios.delete.mockClear();
  });

  describe('login', () => {
    it('successfully logs in exam manager', async () => {
      const mockResponse = {
        data: {
          success: true,
          examManager: mockExamManager
        }
      };
      mockAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await examManagerAuthService.login('exam-manager@example.com', 'password');
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.post).toHaveBeenCalledWith('/api/exam-manager/login', {
        email: 'exam-manager@example.com',
        password: 'password'
      });
    });

    it('throws error on failed exam manager login', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid exam manager credentials' }
        }
      };
      mockAxios.post.mockRejectedValueOnce(mockError);

      await expect(examManagerAuthService.login('exam-manager@example.com', 'password'))
        .rejects
        .toThrow('Invalid exam manager credentials');
    });
  });

  describe('logout', () => {
    it('successfully logs out exam manager', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Exam manager logged out successfully'
        }
      };
      mockAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await examManagerAuthService.logout();
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.post).toHaveBeenCalledWith('/api/exam-manager/logout');
    });
  });

  describe('getCurrentExamManager', () => {
    it('returns current exam manager from localStorage', () => {
      localStorage.setItem('examManagerInfo', JSON.stringify(mockExamManager));
      const result = examManagerAuthService.getCurrentExamManager();
      expect(result).toEqual(mockExamManager);
    });

    it('returns null if no exam manager in localStorage', () => {
      localStorage.removeItem('examManagerInfo');
      const result = examManagerAuthService.getCurrentExamManager();
      expect(result).toBeNull();
    });
  });

  describe('getAllExamManagers', () => {
    it('successfully gets all exam managers', async () => {
      const mockResponse = {
        data: {
          success: true,
          examManagers: [mockExamManager]
        }
      };
      mockAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await examManagerAuthService.getAllExamManagers();
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.get).toHaveBeenCalledWith('/api/exam-manager');
    });
  });

  describe('createExamManager', () => {
    it('successfully creates exam manager', async () => {
      const mockResponse = {
        data: {
          success: true,
          examManager: {
            ...mockExamManagerData,
            _id: '456',
            token: 'new-token'
          }
        }
      };
      mockAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await examManagerAuthService.createExamManager(mockExamManagerData);
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.post).toHaveBeenCalledWith('/api/exam-manager', mockExamManagerData);
    });
  });

  describe('updateExamManager', () => {
    it('successfully updates exam manager', async () => {
      const updates = {
        name: 'Updated Exam Manager'
      };
      const mockResponse = {
        data: {
          success: true,
          examManager: {
            ...mockExamManager,
            ...updates
          }
        }
      };
      mockAxios.put.mockResolvedValueOnce(mockResponse);

      const result = await examManagerAuthService.updateExamManager('123', updates);
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.put).toHaveBeenCalledWith('/api/exam-manager/123', updates);
    });
  });

  describe('deleteExamManager', () => {
    it('successfully deletes exam manager', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Exam manager deleted successfully'
        }
      };
      mockAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await examManagerAuthService.deleteExamManager('123');
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.delete).toHaveBeenCalledWith('/api/exam-manager/123');
    });
  });
});
