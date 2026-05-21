import { cn, copyTextToClipboard } from './utils';

// Mock the clipboard API for testing
const mockWriteText = jest.fn();
const mockExecCommand = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

Object.assign(document, {
  execCommand: mockExecCommand,
});

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('bg-red-500', 'text-white', 'p-4');
      expect(result).toBe('bg-red-500 text-white p-4');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('bg-red-500', isActive ? 'text-white' : 'text-black', 'p-4');
      expect(result).toBe('bg-red-500 text-white p-4');
    });

    it('should merge conflicting tailwind classes', () => {
      // When using tailwind-merge, later classes should take precedence
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should handle null and undefined values', () => {
      const result = cn('bg-red-500', null, undefined, 'p-4');
      expect(result).toBe('bg-red-500 p-4');
    });

    it('should handle empty arrays', () => {
      const result = cn('bg-red-500', [], 'p-4');
      expect(result).toBe('bg-red-500 p-4');
    });

    it('should handle mixed types properly', () => {
      const condition = true;
      const result = cn(
        'bg-red-500',
        condition && 'text-white',
        !condition && 'text-black',
        null,
        undefined,
        0,
        false,
        'p-4'
      );
      expect(result).toBe('bg-red-500 text-white p-4');
    });
  });

  describe('copyTextToClipboard', () => {
    it('should use navigator.clipboard.writeText when available', async () => {
      const text = 'Hello, world!';
      await copyTextToClipboard(text);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
      expect(document.execCommand).not.toHaveBeenCalled();
    });

    it('should handle promise rejection properly', async () => {
      const errorMessage = 'Clipboard write failed';
      mockWriteText.mockRejectedValue(new Error(errorMessage));

      await expect(copyTextToClipboard('test')).rejects.toThrow(errorMessage);
    });

    it('should fall back to document.execCommand when clipboard API fails', async () => {
      const text = 'Hello, world!';
      
      // Mock the clipboard API to fail
      mockWriteText.mockRejectedValue(new Error('Clipboard API not available'));
      mockExecCommand.mockReturnValue(true);
      
      // Temporarily remove clipboard API to trigger fallback
      const originalClipboard = navigator.clipboard;
      // @ts-ignore
      delete navigator.clipboard;
      
      await copyTextToClipboard(text);
      
      expect(document.execCommand).toHaveBeenCalledWith('copy', true, text);
      
      // Restore clipboard API
      Object.assign(navigator, { clipboard: originalClipboard });
    });

    it('should use fallback when clipboard API is not available', async () => {
      const text = 'Hello, world!';
      
      // Temporarily remove clipboard API to trigger fallback
      const originalClipboard = navigator.clipboard;
      // @ts-ignore
      delete navigator.clipboard;
      
      await copyTextToClipboard(text);
      
      expect(document.execCommand).toHaveBeenCalledWith('copy', true, text);
      
      // Restore clipboard API
      Object.assign(navigator, { clipboard: originalClipboard });
    });
  });
});