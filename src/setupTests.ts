// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock localStorage if not available
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => {}),
    removeItem: jest.fn(() => {}),
    clear: jest.fn(() => {}),
  },
  writable: true,
});

// Mock Worker to handle the Worker constructor that uses import.meta.url
class MockWorker {
  url: any;
  constructor(url: any, _options?: any) {
    // Mock worker constructor
    this.url = url;
  }
  postMessage = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  terminate = jest.fn();
}

// Set up the global Worker before module imports
Object.defineProperty(window, 'Worker', {
  writable: true,
  value: MockWorker,
});

// Mock URL creation to handle import.meta.url
global.URL = function(input: any, _base?: any) {
  // If this is called for the worker.ts file, return a mock URL
  if (input && input.includes('worker.ts')) {
    return {
      href: 'http://localhost/worker.ts',
      toString: () => 'http://localhost/worker.ts'
    };
  }
  // Otherwise, use the standard URL constructor approach
  // In test environment, we'll return a mock
  return {
    href: input || '',
    toString: () => input || ''
  };
} as any;

// Mock console to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

