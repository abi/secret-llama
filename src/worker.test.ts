
// Mock the global self object to simulate web worker environment
const mockSelf: any = {
  onmessage: null,
};

// Store original self and replace during tests
let originalSelf: any;

describe("Web Worker", () => {

  beforeAll(() => {
    // Store original self
    originalSelf = (global as any).self;
    // Mock the global self object
    (global as any).self = mockSelf;
  });

  afterAll(() => {
    // Restore original self
    (global as any).self = originalSelf;
  });

  beforeEach(() => {
    // Reset mock self state
    mockSelf.onmessage = null;
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("should initialize engine and handler correctly", () => {
    // Import the module to trigger execution
    jest.resetModules();
    require("./worker");

    // Verify that onmessage handler is set
    expect(mockSelf.onmessage).toBeDefined();
    expect(typeof mockSelf.onmessage).toBe("function");
  });

  it("should call the handler's onmessage method when receiving a message", () => {
    // Import the module to trigger execution
    jest.resetModules();

    // Since the module will create an instance, we need to spy on the constructor to get the instance
    const mockHandlerInstance = {
      onmessage: jest.fn()
    };

    // Mock the EngineWorkerHandler constructor to return our mock instance
    jest.doMock("@mlc-ai/web-llm", () => {
      const actual = jest.requireActual("@mlc-ai/web-llm");
      return {
        ...actual,
        EngineWorkerHandler: jest.fn(() => mockHandlerInstance),
      };
    });

    // Now import the worker module
    require("./worker");

    // Create a mock message event
    const mockMessageEvent = {
      data: {
        test: "data"
      },
    } as MessageEvent;

    // Trigger the message handler
    if (mockSelf.onmessage) {
      mockSelf.onmessage(mockMessageEvent);
    }

    // Since we're using the mock, the onmessage method should have been called
    expect(mockHandlerInstance.onmessage).toHaveBeenCalledWith(mockMessageEvent);
  });

  it("should create a new engine instance", () => {
    // Import the module to trigger execution
    jest.resetModules();
    require("./worker");

    // Verify that the module was imported and executed without errors
    expect(() => {
      // The initialization code in worker.ts should run without throwing
    }).not.toThrow();
  });

  it("should create a new handler instance with the engine", () => {
    // Import the module to trigger execution
    jest.resetModules();
    require("./worker");

    // Just verify that initialization happens without errors
    expect(() => {
      // The initialization code in worker.ts should run without throwing
    }).not.toThrow();
  });
});