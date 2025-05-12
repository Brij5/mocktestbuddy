import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from '../../pages/LoginPage';
import { createUnauthenticatedStore } from '../../../src/tests/utils/authTestUtils';
import { mockUser, mockAdminUser, mockExamManagerUser } from '../../../src/tests/utils/authTestUtils';
import { describe, it, expect, beforeEach } from '@jest/globals';
import * as reactRedux from 'react-redux';
import jest from 'jest';

// Mock react-redux
window.jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: window.jest.fn(),
  useSelector: window.jest.fn()
}));

describe('LoginPage', () => {
  let store;

  beforeEach(() => {
    window.jest.clearAllMocks();
    store = createUnauthenticatedStore();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(jest.fn());
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue({});
  });

  const renderLoginPage = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );
  };

  describe('Student Login', () => {
    const studentCredentials = {
      email: mockUser.email,
      password: 'password123'
    };

    it('renders login form with email and password fields', () => {
      renderLoginPage();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('submits form with valid student credentials', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: studentCredentials.email } });
      fireEvent.change(passwordInput, { target: { value: studentCredentials.password } });
      fireEvent.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Admin Login', () => {
    const adminCredentials = {
      email: mockAdminUser.email,
      password: 'admin123'
    };

    it('redirects to admin dashboard on successful admin login', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: adminCredentials.email } });
      fireEvent.change(passwordInput, { target: { value: adminCredentials.password } });
      fireEvent.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  describe('Exam Manager Login', () => {
    const examManagerCredentials = {
      email: mockExamManagerUser.email,
      password: 'exam123'
    };

    it('redirects to exam manager dashboard on successful login', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: examManagerCredentials.email } });
      fireEvent.change(passwordInput, { target: { value: examManagerCredentials.password } });
      fireEvent.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith('/exam-manager/dashboard');
    });
  });

  describe('Error Handling', () => {
    it('displays error message for invalid credentials', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('displays error message when API call fails', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'error@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'errorpassword' } });
      fireEvent.click(loginButton);

      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty email', async () => {
      renderLoginPage();
      
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    it('shows error for invalid email format', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(loginButton);

      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });

    it('shows error for empty password', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(loginButton);

      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
