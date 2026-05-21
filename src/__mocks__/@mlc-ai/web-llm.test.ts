import { Engine, EngineWorkerHandler } from './web-llm';

describe('@mlc-ai/web-llm mock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Engine', () => {
    it('should create an instance successfully', () => {
      const engine = new Engine();

      expect(engine).toBeInstanceOf(Engine);
      expect(console.log).toHaveBeenCalledWith('Mock Engine created');
    });

    it('should log message when created', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      new Engine();

      expect(consoleSpy).toHaveBeenCalledWith('Mock Engine created');
    });
  });

  describe('EngineWorkerHandler', () => {
    it('should create an instance successfully with mock engine', () => {
      const mockEngine = new Engine();
      const handler = new EngineWorkerHandler(mockEngine);

      expect(handler).toBeInstanceOf(EngineWorkerHandler);
      expect(handler.onmessage).toBeDefined();
      expect(typeof handler.onmessage).toBe('function');
    });

    it('should initialize onmessage as a jest mock function', () => {
      const mockEngine = new Engine();
      const handler = new EngineWorkerHandler(mockEngine);

      expect(handler.onmessage).toBeInstanceOf(jest.fn().constructor);
      expect(jest.isMockFunction(handler.onmessage)).toBe(true);
    });

    it('should call console.log when onmessage is invoked', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockEngine = new Engine();
      const handler = new EngineWorkerHandler(mockEngine);

      const mockMessageEvent = { data: 'test data' } as MessageEvent;
      handler.onmessage(mockMessageEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Mock EngineWorkerHandler onmessage called with:', mockMessageEvent);
    });

    it('should properly handle message event when onmessage is called', () => {
      const mockEngine = new Engine();
      const handler = new EngineWorkerHandler(mockEngine);
      const mockCallback = jest.fn();
      handler.onmessage = mockCallback;

      const mockMessageEvent = { data: 'test data' } as MessageEvent;
      handler.onmessage(mockMessageEvent);

      expect(mockCallback).toHaveBeenCalledWith(mockMessageEvent);
    });
  });
});