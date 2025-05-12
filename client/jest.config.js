/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-react'] }]
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleDirectories: ['node_modules', 'src'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    },
    'jest': {
      'globals': {
        'describe': true,
        'it': true,
        'expect': true,
        'beforeEach': true,
        'afterEach': true,
        'beforeAll': true,
        'afterAll': true
      }
    }
  },
  coveragePathIgnorePatterns: ['node_modules', 'dist', 'test'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/serviceWorker.js',
    '!src/**/*.test.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
};

export default config;
