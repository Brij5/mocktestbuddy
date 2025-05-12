import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../../../components/common/Navbar';
import { createUnauthenticatedStore } from '../../../src/store/store';

// Mock Redux hooks
describe('Navbar Component', () => {
  const { describe, it, expect, beforeEach } = global;
  const { jest } = global;
  let store;
  let mockDispatch;

  beforeEach(() => {
    window.jest.clearAllMocks();
    store = createUnauthenticatedStore();
    mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(require('react-redux'), 'useSelector').mockImplementation(callback => callback({
      auth: {
        userInfo: null,
        loading: false,
        error: null
      }
    }));
  });

  it('renders with default props', () => {
    render(<Navbar />);
    expect(screen.getByText('Exam Buddy')).toBeInTheDocument();
  });

  it('displays login/register options when not authenticated', () => {
    jest.spyOn(require('react-redux'), 'useSelector').mockImplementation(callback => callback({
      auth: {
        userInfo: null,
        loading: false,
        error: null
      }
    }));
    render(<Navbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('displays dashboard options when authenticated', () => {
    useSelector.mockReturnValue({ userInfo: { role: 'Student' } });
    render(<Navbar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays admin options when user is admin', () => {
    useSelector.mockReturnValue({ userInfo: { role: 'Admin' } });
    render(<Navbar />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('handles mobile menu toggle', () => {
    const { getByRole } = render(<Navbar />);
    const menuButton = getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});
