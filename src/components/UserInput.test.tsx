import { render, screen, fireEvent } from '@testing-library/react';
import UserInput from './UserInput';
import useChatStore from '../hooks/useChatStore';
import { MODEL_DESCRIPTIONS, Model } from '../models';

// Mock the child components
jest.mock('./ui/button', () => ({
  Button: ({ children, onClick, variant }: { children: React.ReactNode; onClick?: () => void; variant?: string }) => (
    <button
      data-testid="mock-button"
      className={variant}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

jest.mock('./ui/input', () => ({
  Input: ({ 
    value, 
    onChange, 
    placeholder, 
    onKeyDown 
  }: { 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    placeholder: string; 
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void 
  }) => (
    <input
      data-testid="mock-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
    />
  ),
}));

// Mock the chat store
jest.mock('../hooks/useChatStore');

const mockUseChatStore = useChatStore as jest.MockedFunction<typeof useChatStore>;

describe('UserInput', () => {
  const mockOnSend = jest.fn();
  const mockOnStop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Set default mock values
    mockUseChatStore.mockImplementation((selector) =>
      selector({
        userInput: '',
        setUserInput: jest.fn(),
        selectedModel: Model.LLAMA_3_8B_INSTRUCT_Q4F16_1,
        setSelectedModel: jest.fn(),
        isGenerating: false,
        setIsGenerating: jest.fn(),
        chatHistory: [],
        setChatHistory: jest.fn(),
      })
    );
  });

  it('renders without crashing', () => {
    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);
    
    expect(screen.getByTestId('mock-input')).toBeInTheDocument();
    expect(screen.getByTestId('mock-button')).toBeInTheDocument();
  });

  it('displays the correct placeholder with model name', () => {
    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);

    const input = screen.getByTestId('mock-input');
    const modelDisplayName = MODEL_DESCRIPTIONS[Model.LLAMA_3_8B_INSTRUCT_Q4F16_1].displayName;
    expect(input).toHaveAttribute('placeholder', `Message ${modelDisplayName}`);
  });

  it('allows updating input value', () => {
    const setUserInput = jest.fn();
    mockUseChatStore.mockImplementation((selector) =>
      selector({
        userInput: 'Initial value',
        setUserInput,
        selectedModel: Model.LLAMA_3_8B_INSTRUCT_Q4F16_1,
        setSelectedModel: jest.fn(),
        isGenerating: false,
        setIsGenerating: jest.fn(),
        chatHistory: [],
        setChatHistory: jest.fn(),
      })
    );

    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);

    const input = screen.getByTestId('mock-input');
    expect(input).toHaveValue('Initial value');

    fireEvent.change(input, { target: { value: 'New value' } });
    expect(setUserInput).toHaveBeenCalledWith('New value');
  });

  it('triggers onSend when Enter key is pressed', () => {
    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);
    
    const input = screen.getByTestId('mock-input');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onSend when other keys are pressed', () => {
    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);
    
    const input = screen.getByTestId('mock-input');
    fireEvent.keyDown(input, { key: 'Tab' });
    
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('shows send button when not generating', () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector({
        userInput: '',
        setUserInput: jest.fn(),
        selectedModel: Model.LLAMA_3_8B_INSTRUCT_Q4F16_1,
        setSelectedModel: jest.fn(),
        isGenerating: false,
        setIsGenerating: jest.fn(),
        chatHistory: [],
        setChatHistory: jest.fn(),
      })
    );

    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);

    const sendButton = screen.getByTestId('mock-button');
    expect(sendButton).toBeInTheDocument();
    expect(sendButton.querySelector('svg')).toBeInTheDocument(); // FaArrowUp icon
  });

  it('shows stop button when generating', () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector({
        userInput: '',
        setUserInput: jest.fn(),
        selectedModel: Model.LLAMA_3_8B_INSTRUCT_Q4F16_1,
        setSelectedModel: jest.fn(),
        isGenerating: true,
        setIsGenerating: jest.fn(),
        chatHistory: [],
        setChatHistory: jest.fn(),
      })
    );

    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);

    const stopButton = screen.getByText('Stop');
    expect(stopButton).toBeInTheDocument();
    expect(stopButton).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onStop when stop button is clicked', () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector({
        userInput: '',
        setUserInput: jest.fn(),
        selectedModel: Model.LLAMA_3_8B_INSTRUCT_Q4F16_1,
        setSelectedModel: jest.fn(),
        isGenerating: true,
        setIsGenerating: jest.fn(),
        chatHistory: [],
        setChatHistory: jest.fn(),
      })
    );

    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);

    const stopButton = screen.getByText('Stop');
    fireEvent.click(stopButton);

    expect(mockOnStop).toHaveBeenCalledTimes(1);
  });

  it('calls onSend when send button is clicked', () => {
    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);
    
    const sendButton = screen.getByTestId('mock-button');
    fireEvent.click(sendButton);
    
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  it('displays disclaimer link with correct functionality', () => {
    window.alert = jest.fn();
    
    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);
    
    const disclaimerLink = screen.getByText('Disclaimer');
    expect(disclaimerLink).toBeInTheDocument();
    
    fireEvent.click(disclaimerLink);
    expect(window.alert).toHaveBeenCalledWith(
      "WhimsyWorks, Inc. provides this open source software and website as-is and makes no representations or warranties of any kind concerning its accuracy, safety, or suitability. The user assumes full responsibility for any consequences resulting from its use. WhimsyWorks, Inc. expressly disclaims all liability for any direct, indirect, or consequential harm that may result."
    );
  });

  it('uses the correct selected model for placeholder', () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector({
        userInput: '',
        setUserInput: jest.fn(),
        selectedModel: Model.MISTRAL_7B_INSTRUCT_V0_2_Q4F16_1,
        setSelectedModel: jest.fn(),
        isGenerating: false,
        setIsGenerating: jest.fn(),
        chatHistory: [],
        setChatHistory: jest.fn(),
      })
    );

    render(<UserInput onSend={mockOnSend} onStop={mockOnStop} />);

    const input = screen.getByTestId('mock-input');
    const modelDisplayName = MODEL_DESCRIPTIONS[Model.MISTRAL_7B_INSTRUCT_V0_2_Q4F16_1].displayName;
    expect(input).toHaveAttribute('placeholder', `Message ${modelDisplayName}`);
  });
});