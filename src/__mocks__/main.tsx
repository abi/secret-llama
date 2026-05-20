// Mock version of main.tsx that doesn't execute the DOM rendering code
// This prevents the CSS import and DOM rendering during tests
export const mockMainExecution = jest.fn();

// We don't execute the actual ReactDOM code here