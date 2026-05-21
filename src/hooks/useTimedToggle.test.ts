import { renderHook, act } from '@testing-library/react';
import { useTimedToggle } from './useTimedToggle';

describe('useTimedToggle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('should initialize with false state', () => {
    const { result } = renderHook(() => useTimedToggle(1000));
    expect(result.current[0]).toBe(false);
  });

  it('should return a function as the second element', () => {
    const { result } = renderHook(() => useTimedToggle(1000));
    expect(typeof result.current[1]).toBe('function');
  });

  it('should toggle to true when the setter is called', () => {
    const { result } = renderHook(() => useTimedToggle(1000));
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
  });

  it('should toggle back to false after the specified duration', () => {
    const duration = 1000;
    const { result } = renderHook(() => useTimedToggle(duration));
    
    // Initially false
    expect(result.current[0]).toBe(false);
    
    // Set to true
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(duration);
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('should not toggle back if duration has not passed', () => {
    const duration = 1000;
    const { result } = renderHook(() => useTimedToggle(duration));
    
    // Set to true
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
    
    // Advance time less than the duration
    act(() => {
      jest.advanceTimersByTime(duration - 1);
    });
    
    expect(result.current[0]).toBe(true);
  });

  it('should handle multiple calls correctly', () => {
    const duration = 1000;
    const { result } = renderHook(() => useTimedToggle(duration));
    
    // First call
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
    
    // Advance time halfway
    act(() => {
      jest.advanceTimersByTime(duration / 2);
    });
    
    // Second call before first timeout completes
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
    
    // Advance remaining time
    act(() => {
      jest.advanceTimersByTime(duration);
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('should handle multiple simultaneous timeouts correctly', () => {
    const duration = 1000;
    const { result } = renderHook(() => useTimedToggle(duration));

    // First call
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);

    // Advance time halfway
    act(() => {
      jest.advanceTimersByTime(duration / 2);
    });

    // Second call - this creates another timeout, but first timeout is still active
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);

    // Advance time by half duration - first timeout completes, sets state to false
    act(() => {
      jest.advanceTimersByTime(duration / 2);
    });

    expect(result.current[0]).toBe(false); // First timeout finished and set state to false

    // Advance time by the full duration - second timeout completes, tries to set state to false again
    act(() => {
      jest.advanceTimersByTime(duration);
    });

    expect(result.current[0]).toBe(false);
  });

  it('should work with different durations', () => {
    const shortDuration = 100;
    const longDuration = 2000;
    
    const { result: shortResult } = renderHook(() => useTimedToggle(shortDuration));
    const { result: longResult } = renderHook(() => useTimedToggle(longDuration));
    
    // Set both to true
    act(() => {
      shortResult.current[1]();
    });
    act(() => {
      longResult.current[1]();
    });
    
    expect(shortResult.current[0]).toBe(true);
    expect(longResult.current[0]).toBe(true);
    
    // Advance time to short duration
    act(() => {
      jest.advanceTimersByTime(shortDuration);
    });
    
    // Short duration should be false, long should still be true
    expect(shortResult.current[0]).toBe(false);
    expect(longResult.current[0]).toBe(true);
    
    // Advance remaining time for long duration
    act(() => {
      jest.advanceTimersByTime(longDuration - shortDuration);
    });
    
    expect(longResult.current[0]).toBe(false);
  });
});