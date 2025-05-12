import axios from 'axios';
import { authService } from '../../../services/authService';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

describe('AuthService', () => {
  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    token: 'test-token'
  };

  beforeEach(() => {
    // Reset mock implementations before each test
    axios.post.mockClear();
    axios.get.mockClear();
    axios.put.mockClear();
    axios.delete.mockClear();
  });

  describe('login', () => {
    it('successfully logs in user', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: mockUser
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login('test@example.com', 'password');
      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
    });

    it('throws error on failed login', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' }
        }
      };
      axios.post.mockRejectedValueOnce(mockError);

      await expect(authService.login('test@example.com', 'password'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('successfully registers user', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: mockUser
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register('test@example.com', 'Test User', 'password');

      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password'
      });
    });

    it('throws error on failed registration', async () => {
      const mockError = {
        response: {
          data: { message: 'Email already exists' }
        }
      };
      axios.post.mockRejectedValueOnce(mockError);

      await expect(authService.register('test@example.com', 'Test User', 'password'))
        .rejects
        .toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('successfully logs out user', async () => {
      const mockResponse = {
        data: {
          success: true
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      await authService.logout();
      expect(axios.post).toHaveBeenCalledWith('/api/auth/logout');
    });
  });

  describe('refreshToken', () => {
    it('successfully refreshes token', async () => {
      const mockResponse = {
        data: {
          success: true,
          token: 'new-token'
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.refreshToken();
      expect(result.token).toBe('new-token');
      expect(axios.post).toHaveBeenCalledWith('/api/auth/refresh-token');
    });
  });
});
