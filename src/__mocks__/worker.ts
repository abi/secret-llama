// Mock worker module to avoid import.meta.url issues in tests
export const mockWorker = class MockWorker {
  constructor() {
    // Mock worker constructor
  }
  postMessage = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  terminate = jest.fn();
};

export default mockWorker;