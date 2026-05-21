// Unit tests for setupJestEnvironment.js
describe('setupJestEnvironment', () => {
  beforeEach(() => {
    // Clean up any existing global import state for each test
    if (global.import && global.import.meta) {
      delete global.import.meta.url;
    }
    
    // Ensure we start with a clean state
    jest.resetModules();
  });

  it('should set up import.meta.url in the global scope', () => {
    // Require the setup file to execute it
    require('./setupJestEnvironment.js');

    // Check that import.meta exists in global scope
    expect(global.import).toBeDefined();
    expect(global.import.meta).toBeDefined();
    expect(global.import.meta.url).toBeDefined();
  });

  it('should set a mock URL for import.meta.url', () => {
    require('./setupJestEnvironment.js');

    const expectedUrl = 'http://localhost/index.html';
    expect(global.import.meta.url).toBe(expectedUrl);
  });

  it('should make import.meta.url non-writable', () => {
    require('./setupJestEnvironment.js');

    // Try to modify the url property to see if it's truly non-writable
    const originalUrl = global.import.meta.url;
    try {
      global.import.meta.url = 'modified-url';
    } catch (e) {
      // If an error is thrown, that's expected behavior for non-writable property
    }
    // The value should remain unchanged
    expect(global.import.meta.url).toBe(originalUrl);
  });

  it('should be configurable property', () => {
    require('./setupJestEnvironment.js');

    // Check that the property descriptor shows configurable as true
    const descriptor = Object.getOwnPropertyDescriptor(global.import.meta, 'url');
    expect(descriptor.configurable).toBe(true);
  });

  it('should handle case where import already exists in global scope', () => {
    // Set up a scenario where import already exists
    global.import = { someOtherProperty: 'test' };
    
    require('./setupJestEnvironment.js');

    // Verify that existing properties are preserved and meta is added
    expect(global.import.someOtherProperty).toBe('test');
    expect(global.import.meta).toBeDefined();
    expect(global.import.meta.url).toBe('http://localhost/index.html');
  });

  it('should handle case where import.meta already exists in global scope', () => {
    // Set up a scenario where import.meta already exists
    global.import = { meta: { someProperty: 'existing' } };
    
    require('./setupJestEnvironment.js');

    // Verify that existing meta properties are preserved and url is added
    expect(global.import.meta.someProperty).toBe('existing');
    expect(global.import.meta.url).toBe('http://localhost/index.html');
  });

  it('should have correct URL format', () => {
    require('./setupJestEnvironment.js');

    // Ensure the URL follows proper format
    const url = global.import.meta.url;
    expect(typeof url).toBe('string');
    expect(url).toMatch(/^https?:\/\//); // Should start with http:// or https://
  });
});