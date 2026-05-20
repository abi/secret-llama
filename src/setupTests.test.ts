import '@testing-library/jest-dom';

describe('setupTests.ts', () => {
  // Clear all mocks after each test to avoid test interference
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('localStorage mock', () => {
    it('should mock localStorage with jest functions', () => {
      expect(window.localStorage.getItem).toBeDefined();
      expect(window.localStorage.setItem).toBeDefined();
      expect(window.localStorage.removeItem).toBeDefined();
      expect(window.localStorage.clear).toBeDefined();
    });

    it('should have localStorage methods as jest functions', () => {
      expect(jest.isMockFunction(window.localStorage.getItem)).toBe(true);
      expect(jest.isMockFunction(window.localStorage.setItem)).toBe(true);
      expect(jest.isMockFunction(window.localStorage.removeItem)).toBe(true);
      expect(jest.isMockFunction(window.localStorage.clear)).toBe(true);
    });

    it('should return null for localStorage.getItem by default', () => {
      const result = window.localStorage.getItem('test-key');
      expect(result).toBeNull();
      expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should be able to set and get items', () => {
      window.localStorage.setItem('test-key', 'test-value');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });
  });

  describe('Worker mock', () => {
    it('should define Worker on the window object', () => {
      expect(window.Worker).toBeDefined();
      expect(typeof window.Worker).toBe('function');
    });

    it('should create a Worker instance', () => {
      const worker = new window.Worker('test-url');
      // Since worker is mocked, we can't verify the URL property directly
      // as the MockWorker class has its own implementation
      expect(worker).toBeDefined();
    });

    it('should have Worker instance with jest mocked methods', () => {
      const worker = new window.Worker('test-url');

      expect(worker.postMessage).toBeDefined();
      expect(worker.addEventListener).toBeDefined();
      expect(worker.removeEventListener).toBeDefined();
      expect(worker.terminate).toBeDefined();

      expect(jest.isMockFunction(worker.postMessage)).toBe(true);
      expect(jest.isMockFunction(worker.addEventListener)).toBe(true);
      expect(jest.isMockFunction(worker.removeEventListener)).toBe(true);
      expect(jest.isMockFunction(worker.terminate)).toBe(true);
    });

    it('should call postMessage mock function', () => {
      const worker = new window.Worker('test-url');
      worker.postMessage('test-message');
      expect(worker.postMessage).toHaveBeenCalledWith('test-message');
    });
  });

  describe('URL mock', () => {
    it('should define URL globally', () => {
      expect(global.URL).toBeDefined();
    });

    it('should return a mock URL object for worker.ts files', () => {
      const urlObj = new global.URL('worker.ts');
      expect(urlObj.href).toBe('http://localhost/worker.ts');
      expect(urlObj.toString()).toBe('http://localhost/worker.ts');
    });

    it('should return a mock URL object for URLs containing worker.ts', () => {
      const urlObj = new global.URL('./path/to/worker.ts');
      expect(urlObj.href).toBe('http://localhost/worker.ts');
      expect(urlObj.toString()).toBe('http://localhost/worker.ts');
    });

    it('should return a mock URL object with input as href for non-worker URLs', () => {
      const testUrl = 'http://example.com/test.js';
      const urlObj = new global.URL(testUrl);
      expect(urlObj.href).toBe(testUrl);
      expect(urlObj.toString()).toBe(testUrl);
    });

    it('should handle empty input', () => {
      const urlObj = new global.URL('');
      expect(urlObj.href).toBe('');
      expect(urlObj.toString()).toBe('');
    });

    it('should handle null input', () => {
      const urlObj = new global.URL(null as any);
      expect(urlObj.href).toBe('');
      expect(urlObj.toString()).toBe('');
    });
  });

  describe('console mock', () => {
    it('should mock console.log, warn, and error', () => {
      expect(global.console.log).toBeDefined();
      expect(global.console.warn).toBeDefined();
      expect(global.console.error).toBeDefined();
      expect(jest.isMockFunction(global.console.log)).toBe(true);
      expect(jest.isMockFunction(global.console.warn)).toBe(true);
      expect(jest.isMockFunction(global.console.error)).toBe(true);
    });

    it('should preserve other console properties', () => {
      expect(global.console.table).toBeDefined();
    });

    it('should call the mocked console functions', () => {
      global.console.log('test log');
      global.console.warn('test warn');
      global.console.error('test error');
      
      expect(global.console.log).toHaveBeenCalledWith('test log');
      expect(global.console.warn).toHaveBeenCalledWith('test warn');
      expect(global.console.error).toHaveBeenCalledWith('test error');
    });
  });

  describe('jest-dom integration', () => {
    it('should have access to jest-dom matchers', () => {
      // Create a simple element to test the matcher
      const element = document.createElement('div');
      element.textContent = 'Hello React';
      
      // This would fail without jest-dom matchers
      expect(element).toHaveTextContent(/react/i);
    });
  });
});