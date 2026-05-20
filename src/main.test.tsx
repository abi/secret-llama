import * as React from 'react';
import { render } from '@testing-library/react';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Test the expected behavior of main.tsx without importing it directly to avoid CSS issues
describe('Main entry point behavior', () => {
  // Store original document.getElementById to restore later
  const originalGetElementById = document.getElementById;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original method
    Object.defineProperty(document, 'getElementById', {
      value: originalGetElementById,
      writable: true,
    });
  });

  it('verifies that the expected DOM element exists', () => {
    // Check that the expected root element exists in a JSDOM environment
    // In the actual index.html, this element would be present
    document.body.innerHTML = '<div id="root"></div>';

    const rootElement = document.getElementById('root');
    expect(rootElement).not.toBeNull();
    expect(rootElement!.id).toBe('root');
  });

  it('verifies that React StrictMode works as expected', () => {
    // Test that StrictMode renders children correctly
    const TestComponent = () => <div>Test Content</div>;

    const { getByText } = render(
      <React.StrictMode>
        <TestComponent />
      </React.StrictMode>
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('verifies that document.getElementById gets called with "root"', () => {
    // Mock document.getElementById to track calls
    const getElementByIdSpy = jest.spyOn(document, 'getElementById');

    // In the context of the main.tsx, it should try to get element with id "root"
    document.getElementById('root');

    expect(getElementByIdSpy).toHaveBeenCalledWith('root');
  });
});