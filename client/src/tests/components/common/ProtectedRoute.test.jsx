import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

// Mock TextEncoder for react-router-dom
if (typeof window.TextEncoder === 'undefined') {
  window.TextEncoder = class TextEncoder {
    constructor() {}
    encode() {
      return new Uint8Array();
    }
  };
}

// Mock useSelector and useDispatch
jest.mock('react-redux', () => ({
  __esModule: true,
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

// Import Jest globals
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('ProtectedRoute Component', () => {
  const mockComponent = () => <div>Test Component</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders child component when user is logged in', () => {
    jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        isAuthenticated: true,
        role: 'student'
      })
    }));

    render(
      <MemoryRouter>
        <ProtectedRoute component={mockComponent} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('redirects to login when user is not logged in', () => {
    jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        isAuthenticated: false
      })
    }));

    render(
      <MemoryRouter>
        <ProtectedRoute component={mockComponent} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
  });

  it('renders child component for admin role', () => {
    jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        isAuthenticated: true,
        role: 'admin'
      })
    }));

    render(
      <MemoryRouter>
        <ProtectedRoute component={mockComponent} role="admin" />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('redirects to login for unauthorized admin access', () => {
    jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        isAuthenticated: true,
        role: 'student'
      })
    }));

    render(
      <MemoryRouter>
        <ProtectedRoute component={mockComponent} role="admin" />
      </MemoryRouter>
    );

    expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
  });

  it('renders child component for exam manager role', () => {
    jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        isAuthenticated: true,
        role: 'exam-manager'
      })
    }));

    render(
      <MemoryRouter>
        <ProtectedRoute component={mockComponent} role="exam-manager" />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('redirects to login for unauthorized exam manager access', () => {
    jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        isAuthenticated: true,
        role: 'student'
      })
    }));

    render(
      <MemoryRouter>
        <ProtectedRoute component={mockComponent} role="exam-manager" />
      </MemoryRouter>
    );

    expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
  });

  it('shows access denied message for unauthorized users', () => {
    jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        auth: {
          userInfo: { id: '1', name: 'Test User', email: 'test@example.com', role: 'Student' },
          loading: false,
          error: null
        }
      })
      }
    }));

    render(
      <MemoryRouter>
        <ProtectedRoute adminRequired>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('shows exam manager access denied message for unauthorized users', () => {
    useSelector.mockImplementation(callback => callback({
      auth: {
        userInfo: { id: '1', name: 'Test User', email: 'test@example.com', role: 'Student' },
        loading: false,
        error: null
      }
    }));

    render(
      <MemoryRouter>
        <ProtectedRoute examManagerRequired>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});
});
});
});
