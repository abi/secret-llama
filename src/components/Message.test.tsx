import { render, screen } from "@testing-library/react";
import * as webllm from "@mlc-ai/web-llm";

// Mock all dependencies BEFORE the component is imported
jest.mock("../hooks/useChatStore", () => ({
  __esModule: true,
  default: jest.fn((selector) =>
    selector({ selectedModel: "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k" })
  ),
}));

jest.mock("../models", () => ({
  Model: {
    TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K: "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k",
  },
  MODEL_DESCRIPTIONS: {
    "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k": {
      displayName: "TinyLlama",
      icon: "🦙",
    },
  },
}));

jest.mock("react-icons/fa6", () => ({
  FaHorseHead: () => <span data-testid="horse-icon" />,
  FaPerson: () => <span data-testid="person-icon" />,
}));

jest.mock("./CodeMessage", () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <code data-testid="code-message" className={className}>{children}</code>
  ),
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children, className, components, ...rest }: {
    children: React.ReactNode;
    className?: string;
    components?: any;
    [key: string]: any
  }) => {
    // If there's a code component override in components, use it
    if (components && components.code) {
      // Process the children to detect if there's inline code like `code`
      // For simplicity, we'll check if the content contains backticks
      const content = typeof children === 'string' ? children : '';

      // If we have a code component and the content looks like code, use the custom renderer
      if (content.includes('`') && components.code) {
        // Transform content like `code` to use the code component
        const processedChildren = content.split(/(`[^`]+`)/g).map((part, index) => {
          if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
            // This is inline code, render with the custom code component
            const codeContent = part.slice(1, -1); // Remove the backticks
            return components.code({
              children: codeContent,
              key: `code-${index}`,
            });
          }
          return part;
        });

        return (
          <div data-testid="markdown-container" className={className} {...rest}>
            {processedChildren}
          </div>
        );
      }
    }

    // Default rendering
    return (
      <div data-testid="markdown-container" className={className} {...rest}>
        {children}
      </div>
    );
  },
}));

import Message from "./Message";

// Helper function to render the component with a given message
const renderMessage = (message: webllm.ChatCompletionMessageParam) => {
  return render(<Message message={message} />);
};

describe("Message", () => {
  it("renders user message correctly", () => {
    const userMessage: webllm.ChatCompletionMessageParam = {
      role: "user",
      content: "Hello, world!",
    };

    renderMessage(userMessage);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByTestId("person-icon")).toBeInTheDocument(); // User icon
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });

  it("renders assistant message correctly", () => {
    const assistantMessage: webllm.ChatCompletionMessageParam = {
      role: "assistant",
      content: "Hello, user!",
    };

    renderMessage(assistantMessage);

    expect(screen.getByText("TinyLlama")).toBeInTheDocument(); // Display name of the model
    expect(screen.getByTestId("horse-icon")).toBeInTheDocument(); // Assistant icon
    expect(screen.getByText("Hello, user!")).toBeInTheDocument();
  });

  it("handles non-string content", () => {
    const nonStringMessage: webllm.ChatCompletionMessageParam = {
      role: "assistant",
      content: 123 as any, // Non-string content
    };

    renderMessage(nonStringMessage);

    expect(screen.getByText("Non-string content found")).toBeInTheDocument();
  });

  it("renders markdown container with proper class", () => {
    const message: webllm.ChatCompletionMessageParam = {
      role: "user",
      content: "Some **bold** text",
    };

    renderMessage(message);

    const markdownContainer = screen.getByTestId("markdown-container");
    expect(markdownContainer).toHaveClass("text-gray-700");
    expect(markdownContainer).toHaveClass("pl-8");
    expect(markdownContainer).toHaveClass("mt-2");
    expect(markdownContainer).toHaveClass("prose");
  });

  it("renders code blocks with CodeMessage component", () => {
    const message: webllm.ChatCompletionMessageParam = {
      role: "user",
      content: "`code`",
    };

    renderMessage(message);

    // Check that the code message component is rendered
    expect(screen.getByTestId("code-message")).toBeInTheDocument();
  });
});