// Custom Jest setup to handle import.meta.url in test environment

// Mock import.meta.url for test environment
// This is needed since Jest doesn't natively support import.meta.url
global.import = global.import || {};
if (!global.import.meta) {
  global.import.meta = {};
}

// Define import.meta.url to return a mock URL
Object.defineProperty(global.import.meta, 'url', {
  value: 'http://localhost/index.html',
  writable: false,
  configurable: true,
});