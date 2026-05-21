import { render, screen, fireEvent } from '@testing-library/react';
import ResetChatButton from './ResetChatButton';

describe('ResetChatButton', () => {
  const mockResetChat = jest.fn();

  beforeEach(() => {
    mockResetChat.mockClear();
  });

  it('renders the button with the correct icon', () => {
    const { container } = render(<ResetChatButton resetChat={mockResetChat} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Find the SVG element within the rendered container
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('has the correct class names applied', () => {
    render(<ResetChatButton resetChat={mockResetChat} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('p-2');
    // We can't easily check for "outline" variant class without knowing the exact Tailwind-generated class name
  });

  it('calls the resetChat function when clicked', () => {
    render(<ResetChatButton resetChat={mockResetChat} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockResetChat).toHaveBeenCalledTimes(1);
  });

  it('applies the correct icon class names', () => {
    const { container } = render(<ResetChatButton resetChat={mockResetChat} />);

    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveClass('h-5', 'w-5', 'text-gray-800');
  });
});