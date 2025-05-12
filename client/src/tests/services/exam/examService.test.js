import { examService } from '../../../services/examService';
import { describe, it, expect, beforeEach } from '@jest/globals';
import axios from 'axios';
import { jest } from '@jest/globals';

// Mock axios
const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

jest.mock('axios', () => {
  const axios = {
    __esModule: true,
    ...mockAxios
  };
  return axios;
});

describe('Exam Service', () => {
  const mockExam = {
    id: '1',
    title: 'Test Exam',
    description: 'Test Description',
    duration: 60,
    questions: [],
    status: 'active'
  };

  beforeEach(() => {
    window.jest.clearAllMocks();
  });

  describe('getAllExams', () => {
    it('successfully fetches exams', async () => {
      window.axios.get.mockResolvedValue({
        data: [mockExam]
      });

      const result = await examService.getAllExams();
      expect(result).toEqual([mockExam]);
    });

    it('throws error on failed fetch', async () => {
      window.axios.get.mockRejectedValue({
        response: {
          data: { message: 'Failed to fetch exams' }
        }
      });

      await expect(examService.getAllExams())
        .rejects
        .toThrow('Failed to fetch exams');
    });
  });

  describe('getExamDetails', () => {
    it('successfully fetches exam by ID', async () => {
      window.axios.get.mockResolvedValue({
        data: mockExam
      });

      const result = await examService.getExamDetails('123');
      expect(result).toEqual(mockExam);
    });

    it('throws error on failed fetch', async () => {
      window.axios.get.mockRejectedValue({
        response: {
          data: { message: 'Exam not found' }
        }
      });

      await expect(examService.getExamDetails('123'))
        .rejects
        .toThrow('Exam not found');
    });
  });

  describe('createExam', () => {
    it('successfully creates exam', async () => {
      window.axios.post.mockResolvedValue({
        data: mockExam
      });

      const result = await examService.createExam({
        name: 'New Exam',
        description: 'This is a new exam',
        category: '123',
        durationMinutes: 60,
        totalMarks: 100,
        passingMarks: 40,
        isActive: true
      });

      expect(result).toEqual(mockExam);
    });

    it('throws error on failed creation', async () => {
      window.axios.post.mockRejectedValue({
        response: {
          data: { message: 'Failed to create exam' }
        }
      });

      await expect(examService.createExam({
        name: 'New Exam',
        description: 'This is a new exam',
        category: '123',
        durationMinutes: 60,
        totalMarks: 100,
        passingMarks: 40,
        isActive: true
      })).rejects.toThrow('Failed to create exam');
    });
  });

  describe('updateExam', () => {
    it('successfully updates exam', async () => {
      window.axios.put.mockResolvedValue({
        data: {
          ...mockExam,
          name: 'Updated Exam',
          description: 'This is an updated exam'
        }
      });

      const result = await examService.updateExam('123', {
        name: 'Updated Exam',
        description: 'This is an updated exam'
      });

      expect(result.name).toBe('Updated Exam');
      expect(result.description).toBe('This is an updated exam');
    });

    it('throws error on failed update', async () => {
      window.axios.put.mockRejectedValue({
        response: {
          data: { message: 'Failed to update exam' }
        }
      });

      await expect(examService.updateExam('123', {
        name: 'Updated Exam',
        description: 'This is an updated exam'
      })).rejects.toThrow('Failed to update exam');
    });
  });

  describe('deleteExam', () => {
    it('successfully deletes exam', async () => {
      window.axios.delete.mockResolvedValue({
        data: { success: true }
      });

      await examService.deleteExam('123');
      expect(axios.delete).toHaveBeenCalledWith('/api/exams/123');
    });
  });
});
