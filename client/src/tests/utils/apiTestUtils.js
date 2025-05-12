import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from '@jest/globals';

// Mock API endpoints
export const mockEndpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me'
  },
  exams: {
    list: '/api/exams',
    create: '/api/exams',
    update: (id) => `/api/exams/${id}`,
    delete: (id) => `/api/exams/${id}`,
    category: (categoryId) => `/api/exams/category/${categoryId}`
  },
  categories: {
    list: '/api/categories',
    create: '/api/categories',
    update: (id) => `/api/categories/${id}`,
    delete: (id) => `/api/categories/${id}`
  }
};

// Mock API responses
export const mockResponses = {
  success: {
    status: 200,
    data: { success: true }
  },
  error: {
    status: 500,
    data: { error: 'Internal server error' }
  },
  validation: {
    status: 400,
    data: { error: 'Validation failed', details: {} }
  },
  unauthorized: {
    status: 401,
    data: { error: 'Unauthorized' }
  }
};

// Helper to mock API calls
export const mockApiCall = (method, endpoint, response = mockResponses.success) => {
  axios[method].mockResolvedValue(response);
};

// Helper to mock API errors
export const mockApiError = (method, endpoint, error = mockResponses.error) => {
  axios[method].mockRejectedValue(error);
};

// Helper to test API loading states
export const testApiLoading = async (container) => {
  const loadingElement = container.getByTestId('loading');
  expect(loadingElement).toBeInTheDocument();

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return loadingElement;
};

// Helper to test API success states
export const testApiSuccess = async (container, successMessage = 'Success') => {
  const successElement = container.getByText(successMessage);
  expect(successElement).toBeInTheDocument();

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return successElement;
};

// Helper to test API error states
export const testApiError = async (container, errorMessage = 'Error') => {
  const errorElement = container.getByText(errorMessage);
  expect(errorElement).toBeInTheDocument();

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return errorElement;
};

// Helper to test API validation errors
export const testApiValidation = async (container, validationErrors = {}) => {
  const errorElements = Object.entries(validationErrors).map(([field, message]) => {
    const error = container.getByText(message);
    expect(error).toBeInTheDocument();
    return error;
  });

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return errorElements;
};

// Helper to test API unauthorized access
export const testApiUnauthorized = async (container, unauthorizedMessage = 'Unauthorized') => {
  const errorElement = container.getByText(unauthorizedMessage);
  expect(errorElement).toBeInTheDocument();

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return errorElement;
};
