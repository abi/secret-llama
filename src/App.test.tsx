import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock the webllm module since it's an external dependency
jest.mock("@mlc-ai/web-llm", () => ({
  prebuiltAppConfig: {
    useIndexedDBCache: true,
  },
  CreateWebWorkerEngine: jest.fn(),
}));

// Mock all the components used in App
jest.mock("./components/UserInput", () => {
  return {
    __esModule: true,
    default: ({ onSend, onStop }: { onSend: () => void; onStop: () => void }) => (
      <div data-testid="user-input" onClick={onSend}>
        User Input Component
        <button data-testid="send-btn" onClick={onSend}>
          Send
        </button>
        <button data-testid="stop-btn" onClick={onStop}>
          Stop
        </button>
      </div>
    ),
  };
});

jest.mock("./components/ResetChatButton", () => {
  return {
    __esModule: true,
    default: ({ resetChat }: { resetChat: () => void }) => (
      <button data-testid="reset-chat-btn" onClick={resetChat}>
        Reset Chat
      </button>
    ),
  };
});

jest.mock("./components/DebugUI", () => {
  return {
    __esModule: true,
    default: ({ progress }: { progress: string }) => (
      <div data-testid="debug-ui">
        Debug UI Component - {progress}
      </div>
    ),
  };
});

jest.mock("./components/ModelsDropdown", () => {
  return {
    __esModule: true,
    default: ({ resetEngineAndChatHistory }: { resetEngineAndChatHistory: () => void }) => (
      <div data-testid="models-dropdown">
        <button data-testid="reset-engine-btn" onClick={resetEngineAndChatHistory}>
          Reset Engine
        </button>
      </div>
    ),
  };
});

jest.mock("./components/MessageList", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="message-list">Message List</div>,
  };
});

// Import the mock store from the mock file
import { mockChatStore } from "./App.test.mock";

// Update the mock functions
Object.assign(mockChatStore, {
  setUserInput: jest.fn(),
  setIsGenerating: jest.fn(),
  setChatHistory: jest.fn(),
});

jest.mock("./hooks/useChatStore", () => {
  return () => mockChatStore;
});

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mockChatStore to default values
    mockChatStore.userInput = "";
    mockChatStore.selectedModel = "default-model";
    mockChatStore.chatHistory = [];
  });

  test("renders welcome message when chat history is empty", () => {
    render(<App />);

    expect(screen.getByText("Welcome to Secret Llama")).toBeInTheDocument();
    expect(screen.getByTestId("user-input")).toBeInTheDocument();
    expect(screen.getByTestId("reset-chat-btn")).toBeInTheDocument();
    expect(screen.getByTestId("debug-ui")).toBeInTheDocument();
    expect(screen.getByTestId("models-dropdown")).toBeInTheDocument();
  });

  test("renders MessageList when chat history is not empty", () => {
    mockChatStore.chatHistory = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there!" },
    ];

    render(<App />);

    expect(screen.queryByText("Welcome to Secret Llama")).not.toBeInTheDocument();
    expect(screen.getByTestId("message-list")).toBeInTheDocument();
    expect(screen.getByTestId("user-input")).toBeInTheDocument();
  });

  test("renders UI components regardless of chat history state", () => {
    render(<App />);

    expect(screen.getByTestId("user-input")).toBeInTheDocument();
    expect(screen.getByTestId("reset-chat-btn")).toBeInTheDocument();
    expect(screen.getByTestId("debug-ui")).toBeInTheDocument();
    expect(screen.getByTestId("models-dropdown")).toBeInTheDocument();
  });

  test("displays initial debug UI progress", () => {
    render(<App />);

    // The initial progress should be "Not loaded"
    expect(screen.getByTestId("debug-ui")).toHaveTextContent("Debug UI Component - Not loaded");
  });
});