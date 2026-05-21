import { render, screen, fireEvent } from '@testing-library/react';
import DebugUI from './DebugUI';

describe('DebugUI', () => {
  const mockLoadEngine = jest.fn();
  const defaultProps = {
    loadEngine: mockLoadEngine,
    progress: 'Loading... 50%',
  };

  beforeEach(() => {
    mockLoadEngine.mockClear();
  });

  it('renders the progress text', () => {
    render(<DebugUI {...defaultProps} />);
    
    expect(screen.getByText('Loading... 50%')).toBeInTheDocument();
  });

  it('triggers loadEngine function when button is clicked', () => {
    render(<DebugUI {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /Load/i });
    fireEvent.click(button);
    
    expect(mockLoadEngine).toHaveBeenCalledTimes(1);
  });

  it('renders with different progress text', () => {
    const { rerender } = render(<DebugUI {...defaultProps} />);
    
    // Test different progress text
    rerender(<DebugUI loadEngine={mockLoadEngine} progress="Complete!" />);
    
    expect(screen.getByText('Complete!')).toBeInTheDocument();
  });

  it('passes correct props to the button', () => {
    render(<DebugUI {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /Load/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('hidden');
  });

  it('displays correct progress in the div', () => {
    render(<DebugUI {...defaultProps} />);
    
    const progressDiv = screen.getByText('Loading... 50%');
    expect(progressDiv).toBeInTheDocument();
    expect(progressDiv).toHaveClass('p-2');
    expect(progressDiv).toHaveClass('text-xs');
    expect(progressDiv).toHaveClass('max-w-[250px]');
    expect(progressDiv).toHaveClass('hidden');
  });
});