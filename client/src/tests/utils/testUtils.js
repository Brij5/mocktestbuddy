import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from '../../../store/store';

// Mock store with initial state
const mockStore = configureStore({
  auth: {
    userInfo: null,
    loading: false,
    error: null
  },
  exams: {
    exams: [],
    loading: false,
    error: null
  },
  testAttempts: {
    attempts: [],
    loading: false,
    error: null
  }
});

// Custom render function with store and router
function render(
  ui,
  {
    route = '/',
    store = mockStore,
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock API responses
export const mockApiResponses = {
  login: {
    token: 'mock-token',
    user: {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'Student'
    }
  },
  exams: [
    {
      id: '123',
      name: 'Mock Exam',
      description: 'This is a mock exam',
      category: '123',
      durationMinutes: 60,
      totalMarks: 100,
      passingMarks: 40,
      isActive: true
    }
  ]
};

// Mock API functions
export const mockApi = {
  login: jest.fn(),
  register: jest.fn(),
  getExams: jest.fn(),
  getExamById: jest.fn(),
  createExam: jest.fn(),
  updateExam: jest.fn(),
  deleteExam: jest.fn()
};

// Mock functions
export const mockNavigate = jest.fn();
export const mockDispatch = jest.fn();
export const mockUseSelector = jest.fn();

// Create mock store
export const createMockStore = (initialState = {}) => {
  return {
    getState: () => initialState,
    dispatch: mockDispatch,
    subscribe: () => {},
  };
};

// Create authenticated store
export const createAuthenticatedStore = () => {
  return createMockStore({
    auth: {
      userInfo: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      },
      loading: false,
      error: null
    },
    exams: {
      categories: [],
      loading: false,
      error: null
    }
  });
};

// Create unauthenticated store
export const createUnauthenticatedStore = () => {
  return createMockStore({
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
  });
};

// Mock axios
export const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Mock Material-UI Theme
export const mockTheme = {
  breakpoints: {
    down: () => false,
    up: () => true
  }
};

// Mock React Router
export const mockRouter = {
  navigate: mockNavigate,
  location: {
    pathname: '/',
    search: '',
    hash: '',
    state: null
  },
  params: {}
};

// Mock Redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: () => mockUseSelector
}));

export * from '@testing-library/react';
export { render };
