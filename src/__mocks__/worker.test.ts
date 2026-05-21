import MockWorker from './worker';

describe('MockWorker', () => {
  let worker: any;

  beforeEach(() => {
    worker = new MockWorker();
  });

  test('should create an instance of MockWorker', () => {
    expect(worker).toBeInstanceOf(MockWorker);
  });

  test('should have postMessage method that is a jest function', () => {
    expect(worker.postMessage).toBeDefined();
    expect(typeof worker.postMessage).toBe('function');
    expect(jest.isMockFunction(worker.postMessage)).toBe(true);
  });

  test('should have addEventListener method that is a jest function', () => {
    expect(worker.addEventListener).toBeDefined();
    expect(typeof worker.addEventListener).toBe('function');
    expect(jest.isMockFunction(worker.addEventListener)).toBe(true);
  });

  test('should have removeEventListener method that is a jest function', () => {
    expect(worker.removeEventListener).toBeDefined();
    expect(typeof worker.removeEventListener).toBe('function');
    expect(jest.isMockFunction(worker.removeEventListener)).toBe(true);
  });

  test('should have terminate method that is a jest function', () => {
    expect(worker.terminate).toBeDefined();
    expect(typeof worker.terminate).toBe('function');
    expect(jest.isMockFunction(worker.terminate)).toBe(true);
  });

  test('should call postMessage with correct arguments', () => {
    const message = { type: 'test', data: 'data' };
    worker.postMessage(message);
    expect(worker.postMessage).toHaveBeenCalledWith(message);
  });

  test('should call addEventListener with correct arguments', () => {
    const eventType = 'message';
    const handler = jest.fn();
    worker.addEventListener(eventType, handler);
    expect(worker.addEventListener).toHaveBeenCalledWith(eventType, handler);
  });

  test('should call removeEventListener with correct arguments', () => {
    const eventType = 'message';
    const handler = jest.fn();
    worker.removeEventListener(eventType, handler);
    expect(worker.removeEventListener).toHaveBeenCalledWith(eventType, handler);
  });

  test('should call terminate without arguments', () => {
    worker.terminate();
    expect(worker.terminate).toHaveBeenCalledWith();
  });

  test('should maintain separate mock instances', () => {
    const worker2 = new MockWorker();
    worker.postMessage('test1');
    worker2.postMessage('test2');

    expect(worker.postMessage).toHaveBeenCalledWith('test1');
    expect(worker2.postMessage).toHaveBeenCalledWith('test2');
  });
});