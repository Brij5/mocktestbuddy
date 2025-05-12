import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

// Mock user data
export const mockUser = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'Student'
};

export const mockAdminUser = {
  id: '456',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Admin'
};

export const mockExamManagerUser = {
  id: '789',
  name: 'Exam Manager',
  email: 'exammanager@example.com',
  role: 'ExamManager'
};

// Create a mock store with unauthenticated state
export const createUnauthenticatedStore = () => {
  return {
    getState: () => ({
      auth: {
        userInfo: null,
        token: null,
        loading: false,
        error: null
      }
    }),
    dispatch: window.jest.fn()
  };
};

// Create a mock store with authenticated state
export const createAuthenticatedStore = (user = mockUser) => {
  return {
    getState: () => ({
      auth: {
        userInfo: user,
        token: 'mock-token',
        loading: false,
        error: null
      }
    }),
    dispatch: window.jest.fn()
  };
};

// Helper to test protected routes
export const renderWithProviders = (ui, { store = createUnauthenticatedStore() } = {}) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
};

// Helper to test role-based access
export const testRoleBasedAccess = async (Component, userRole = 'Student') => {
  const user = {
    ...mockUser,
    role: userRole
  };
  const store = createAuthenticatedStore(user);
  const { getByText } = render(
    <Provider store={store}>
      <Component />
    </Provider>
  );

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return { getByText, store };
};

// Helper to test login form
export const testLoginForm = async (container, formData = {
  email: 'test@example.com',
  password: 'password123'
}) => {
  // Fill form
  Object.entries(formData).forEach(([name, value]) => {
    const input = container.querySelector(`[name="${name}"]`);
    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  });

  // Submit form
  const submitBtn = container.getByText('Login');
  fireEvent.click(submitBtn);

  // Wait for async operations
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return container;
};

// Helper to test registration form
export const testRegistrationForm = async (container, formData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123'
}) => {
  // Fill form
  Object.entries(formData).forEach(([name, value]) => {
    const input = container.querySelector(`[name="${name}"]`);
    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  });

  // Submit form
  const submitBtn = container.getByText('Register');
  fireEvent.click(submitBtn);

  // Wait for async operations
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return container;
};
