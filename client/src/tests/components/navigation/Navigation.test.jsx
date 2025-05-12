import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Navigation from '../../../components/Navigation/Navigation';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';
import { mockTheme, mockRouter, createUnauthenticatedStore } from '../../../tests/utils/testUtils';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => mockTheme,
  useMediaQuery: () => false
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockRouter.navigate,
  useLocation: () => mockRouter.location,
  useParams: () => mockRouter.params
}));

// Mock Redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: () => jest.fn()
}));

describe('Navigation', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createUnauthenticatedStore();
    jest.spyOn(require('react-redux'), 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(require('react-redux'), 'useSelector').mockImplementation(callback => callback({
      auth: {
        userInfo: null,
        loading: false,
        error: null
      },
      exams: {
        categories: [],
        loading: false,
        error: null
      }
    }));
  });

  it('renders admin dashboard link for admin', () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MemoryRouter>
            <Navigation />
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <Provider store={mockStore}>
          <MemoryRouter>
            <Navigation />
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders student navigation items', () => {
    window.jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        auth: {
          userInfo: { role: 'Student' }
        }
      })
    }));

    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <Provider store={mockStore}>
          <MemoryRouter>
            <Navigation />
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Exams')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders exam manager navigation items', () => {
    window.jest.mock('react-redux', () => ({
      __esModule: true,
      useSelector: () => ({
        auth: {
          userInfo: { role: 'Exam Manager' }
        }
      })
    }));

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Exams')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders exam manager dashboard link for exam manager', () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <Provider store={mockStore}>
          <MemoryRouter>
            <Navigation />
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('handles logout', () => {
    const handleLogout = jest.fn();
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <Provider store={mockStore}>
          <MemoryRouter>
            <Navigation />
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText('Logout'));
    expect(handleLogout).toHaveBeenCalled();
  });
});
