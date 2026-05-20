import { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { copyTextToClipboard } from "@/lib/utils";
import CodeMessage from "./CodeMessage";

// Mock the external dependencies
jest.mock("@/lib/utils", () => ({
  copyTextToClipboard: jest.fn(),
}));

// Mock the syntax highlighter and its style
jest.mock("react-syntax-highlighter/dist/esm/styles/prism", () => ({
  vscDarkPlus: {},
}));

jest.mock("react-syntax-highlighter", () => ({
  Prism: ({ children, language, style }: any) => (
    <pre
      data-testid="syntax-highlighter"
      data-language={language}
      style={style}
    >
      {typeof children === "string"
        ? children.replace(/\n$/, "")
        : String(children || "").replace(/\n$/, "")}
    </pre>
  ),
}));

// Mock the icons
jest.mock("react-icons/fa6", () => ({
  FaCheck: () => <span data-testid="fa-check">✓</span>,
  FaRegClipboard: () => <span data-testid="fa-clipboard">📋</span>,
}));

describe("CodeMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders code block with language detection", () => {
    render(
      <CodeMessage className="language-js">
        {`function hello() {
  console.log('Hello World');
}`}
      </CodeMessage>
    );

    // Check header with language
    expect(screen.getByText("js")).toBeInTheDocument();
    expect(screen.getByText("Copy code")).toBeInTheDocument();
    
    // Check syntax highlighter is rendered
    expect(screen.getByTestId("syntax-highlighter")).toBeInTheDocument();
  });

  it("renders plain code when no language class is provided", () => {
    const codeContent = `function hello() {
  console.log('Hello World');
}`;

    render(
      <CodeMessage className="other-class">
        {codeContent}
      </CodeMessage>
    );

    // Should render as regular code element with the provided class
    const codeElement = screen.getByText(/function hello/);
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.tagName).toBe('CODE');

    // Should not have header or copy functionality
    expect(screen.queryByText("Copy code")).not.toBeInTheDocument();
  });

  it("renders plain code when no className is provided", () => {
    render(
      <CodeMessage>
        {`function hello() {
  console.log('Hello World');
}`}
      </CodeMessage>
    );

    // Should render as regular code element
    expect(screen.getByText(/function hello/)).toBeInTheDocument();
    
    // Should not have header or copy functionality
    expect(screen.queryByText("Copy code")).not.toBeInTheDocument();
  });

  it("copies text to clipboard when copy button is clicked", async () => {
    const codeText = `function hello() {
  console.log('Hello World');
}`;
    
    render(
      <CodeMessage className="language-js">{codeText}</CodeMessage>
    );

    // Click the copy button
    fireEvent.click(screen.getByText("Copy code"));

    // Verify copyTextToClipboard was called with the code text
    await waitFor(() => {
      expect(copyTextToClipboard).toHaveBeenCalledWith(codeText);
    });
  });

  it("shows copied state for a brief period", async () => {
    // Mock setTimeout to control the timed toggle
    jest.useFakeTimers();
    
    render(
      <CodeMessage className="language-js">
        {`console.log('test');`}
      </CodeMessage>
    );

    // Initially should show "Copy code"
    expect(screen.getByText("Copy code")).toBeInTheDocument();
    expect(screen.queryByText("Copied!")).not.toBeInTheDocument();

    // Click the copy button
    fireEvent.click(screen.getByText("Copy code"));

    // Should now show "Copied!"
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // Fast-forward time to after the 3000ms timeout
    act(() => {
      jest.advanceTimersByTime(3100);
    });

    // Should revert back to "Copy code"
    expect(screen.getByText("Copy code")).toBeInTheDocument();
    
    // Restore real timers
    jest.useRealTimers();
  });

  it("displays correct language in header", () => {
    render(
      <CodeMessage className="language-python">
        {`def hello():
    print("Hello World")`}
      </CodeMessage>
    );

    // Check that the correct language is displayed
    expect(screen.getByText("python")).toBeInTheDocument();
  });

  it("renders with additional props passed to SyntaxHighlighter", () => {
    render(
      <CodeMessage 
        className="language-js" 
        customProp="test"
        showLineNumbers={true}
      >
        {`console.log('test');`}
      </CodeMessage>
    );

    // The additional props should be passed through
    const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
    expect(syntaxHighlighter).toBeInTheDocument();
  });

  it("removes trailing newline from code", () => {
    const codeWithTrailingNewline = `console.log('test');
`;
    
    render(
      <CodeMessage className="language-js">
        {codeWithTrailingNewline}
      </CodeMessage>
    );

    // The trailing newline should be removed
    const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
    expect(syntaxHighlighter).toBeInTheDocument();
  });

  it("displays copy button with proper styling", () => {
    render(
      <CodeMessage className="language-js">
        {`console.log('test');`}
      </CodeMessage>
    );

    const copyButton = screen.getByRole("button");
    expect(copyButton).toHaveClass("ml-auto", "text-slate-400", "hover:text-slate-100", "flex", "gap-2", "items-center");
  });

  it("shows check icon when copied", async () => {
    // Mock setTimeout to control the timed toggle
    jest.useFakeTimers();
    
    render(
      <CodeMessage className="language-js">
        {`console.log('test');`}
      </CodeMessage>
    );

    // Initially should show clipboard icon
    expect(screen.getByTestId("fa-clipboard")).toBeInTheDocument();
    expect(screen.queryByTestId("fa-check")).not.toBeInTheDocument();

    // Click the copy button
    fireEvent.click(screen.getByText("Copy code"));

    // Should now show check icon
    expect(screen.getByTestId("fa-check")).toBeInTheDocument();
    
    // Restore real timers
    jest.useRealTimers();
  });
});