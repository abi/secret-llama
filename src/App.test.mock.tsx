// Mock App component for tests that doesn't use import.meta.url

// Mock all the components that would normally be imported
const UserInput = ({ onSend, onStop }: { onSend: () => void; onStop: () => void }) => (
  <div data-testid="user-input" onClick={onSend}>
    User Input Component
    <button data-testid="send-btn" onClick={onSend}>
      Send
    </button>
    <button data-testid="stop-btn" onClick={onStop}>
      Stop
    </button>
  </div>
);

const ResetChatButton = ({ resetChat }: { resetChat: () => void }) => (
  <button data-testid="reset-chat-btn" onClick={resetChat}>
    Reset Chat
  </button>
);

const DebugUI = ({ progress }: { progress: string }) => (
  <div data-testid="debug-ui">
    Debug UI Component - {progress}
  </div>
);

const ModelsDropdown = ({ resetEngineAndChatHistory }: { resetEngineAndChatHistory: () => void }) => (
  <div data-testid="models-dropdown">
    <button data-testid="reset-engine-btn" onClick={resetEngineAndChatHistory}>
      Reset Engine
    </button>
  </div>
);

const MessageList = () => <div data-testid="message-list">Message List</div>;

// Export the mock store for the test to use
export type ChatMessage = { role: "user" | "assistant"; content: string };

export let mockChatStore = {
  userInput: "",
  setUserInput: () => {},
  selectedModel: "default-model",
  setIsGenerating: () => {},
  chatHistory: [] as ChatMessage[],
  setChatHistory: () => {},
};

// Mock the custom hook - the test will replace this with their own mock
const useChatStore = () => mockChatStore;

const App = () => {
  const { chatHistory } = useChatStore();

  return (
    <div className="app">
      {chatHistory.length === 0 ? (
        <div>Welcome to Secret Llama</div>
      ) : (
        <MessageList />
      )}
      <UserInput
        onSend={() => {}}
        onStop={() => {}}
      />
      <ResetChatButton resetChat={() => {}} />
      <DebugUI progress="Not loaded" />
      <ModelsDropdown resetEngineAndChatHistory={() => {}} />
    </div>
  );
};

export default App;