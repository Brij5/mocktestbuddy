import '@testing-library/jest-dom';
import '@testing-library/react';
import { jest } from '@jest/globals';

// Mock TextEncoder for react-router-dom
if (typeof window.TextEncoder === 'undefined') {
  window.TextEncoder = class TextEncoder {
    constructor() {}
    encode() {
      return new Uint8Array();
    }
  };
}

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: function() {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function() {}, // deprecated
      removeListener: function() {}, // deprecated
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {}
    };
  }
});

// Mock IntersectionObserver for scroll/visibility tests
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock localStorage
window.localStorage = {
  getItem: () => {},
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Add Jest globals to window
window.jest = {
  fn: () => jest.fn(),
  mock: () => {},
  requireActual: (mod) => {
    try {
      if (typeof mod === 'string') {
        return mod;
      }
      return mod;
    } catch {
      console.warn(`Failed to require module: ${mod}`);
      return mod;
    }
  },
  clearAllMocks: () => {
    Object.keys(window.jest).forEach(key => {
      if (typeof window.jest[key] === 'function' && typeof window.jest[key].mockClear === 'function') {
        window.jest[key].mockClear();
      }
    });
  }
};

// Mock axios
jest.mock('axios', () => ({
  __esModule: true,
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    breakpoints: {
      down: () => false,
      up: () => true
    }
  }),
  useMediaQuery: () => false
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({})
}));

// Mock Redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: () => jest.fn()
}));
