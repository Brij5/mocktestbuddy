import axios from 'axios';
import { adminAuthService } from '../../../services/adminAuth';
import { describe, it, expect, beforeEach } from '@jest/globals';
import jest from 'jest';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

describe('AdminAuthService', () => {
  const mockAdmin = {
    _id: '123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    token: 'admin-token'
  };

  beforeEach(() => {
    // Reset mock implementations before each test
    axios.post.mockClear();
    axios.get.mockClear();
    axios.put.mockClear();
    axios.delete.mockClear();
  });

  describe('login', () => {
    it('successfully logs in admin', async () => {
      const mockResponse = {
        data: {
          success: true,
          admin: mockAdmin
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await adminAuthService.login('admin@example.com', 'password');
      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith('/api/admin/login', {
        email: 'admin@example.com',
        password: 'password'
      });
    });

    it('throws error on failed admin login', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid admin credentials' }
        }
      };
      axios.post.mockRejectedValueOnce(mockError);

      await expect(adminAuthService.login('admin@example.com', 'password'))
        .rejects
        .toThrow('Invalid admin credentials');
    });
  });

  describe('logout', () => {
    it('successfully logs out admin', async () => {
      const mockResponse = {
        data: {
          success: true
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      await adminAuthService.logout();
      expect(axios.post).toHaveBeenCalledWith('/api/admin/logout');
    });
  });

  describe('getCurrentAdmin', () => {
    it('returns current admin from localStorage', () => {
      localStorage.setItem('adminInfo', JSON.stringify(mockAdmin));
      const result = adminAuthService.getCurrentAdmin();
      expect(result).toEqual(mockAdmin);
    });

    it('returns null if no admin in localStorage', () => {
      localStorage.removeItem('adminInfo');
      const result = adminAuthService.getCurrentAdmin();
      expect(result).toBeNull();
    });
  });
});
