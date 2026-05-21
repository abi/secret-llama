import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("inline-flex");
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("h-9");
    expect(button).toHaveClass("px-4");
  });

  it("renders with custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("custom-class");
  });

  it("applies correct variant classes", () => {
    const { rerender } = render(<Button variant="default">Click me</Button>);
    
    let button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("bg-primary");
    
    rerender(<Button variant="destructive">Click me</Button>);
    button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("bg-destructive");
    
    rerender(<Button variant="outline">Click me</Button>);
    button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-input");
    
    rerender(<Button variant="secondary">Click me</Button>);
    button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("bg-secondary");
    
    rerender(<Button variant="ghost">Click me</Button>);
    button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("hover:bg-accent");
    
    rerender(<Button variant="link">Click me</Button>);
    button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("text-primary");
    expect(button).toHaveClass("underline-offset-4");
    expect(button).toHaveClass("hover:underline");
  });

  it("applies correct size classes", () => {
    const { rerender } = render(<Button size="default">Click me</Button>);
    
    let button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("h-9");
    expect(button).toHaveClass("px-4");
    
    rerender(<Button size="sm">Click me</Button>);
    button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("h-8");
    expect(button).toHaveClass("rounded-md");
    expect(button).toHaveClass("px-3");
    
    rerender(<Button size="lg">Click me</Button>);
    button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("h-10");
    expect(button).toHaveClass("rounded-md");
    expect(button).toHaveClass("px-8");
    
    rerender(<Button size="icon">Click me</Button>);
    button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("h-9");
    expect(button).toHaveClass("w-9");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Click me</Button>);
    
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:pointer-events-none");
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("renders as child when asChild prop is true", () => {
    // Test with asChild using a span element
    render(
      <Button asChild>
        <span>Child element</span>
      </Button>
    );
    
    const spanElement = screen.getByText(/child element/i);
    expect(spanElement).toBeInTheDocument();
    expect(spanElement.tagName).toBe("SPAN");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click me</Button>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current instanceof HTMLButtonElement).toBe(true);
  });

  it("has correct default variant and size", () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("bg-primary"); // default variant
    expect(button).toHaveClass("h-9"); // default size
    expect(button).toHaveClass("px-4"); // default size
  });
});