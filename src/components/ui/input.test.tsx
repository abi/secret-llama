import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./input";

describe("Input Component", () => {
  test("renders input element", () => {
    render(<Input />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe("INPUT");
  });

  test("applies default class names", () => {
    render(<Input />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveClass("flex");
    expect(inputElement).toHaveClass("h-9");
    expect(inputElement).toHaveClass("w-full");
    expect(inputElement).toHaveClass("rounded-md");
    expect(inputElement).toHaveClass("border");
    expect(inputElement).toHaveClass("border-input");
    expect(inputElement).toHaveClass("bg-transparent");
    expect(inputElement).toHaveClass("px-3");
    expect(inputElement).toHaveClass("py-1");
    expect(inputElement).toHaveClass("text-sm");
    expect(inputElement).toHaveClass("shadow-sm");
    expect(inputElement).toHaveClass("transition-colors");
    expect(inputElement).toHaveClass("file:border-0");
    expect(inputElement).toHaveClass("file:bg-transparent");
    expect(inputElement).toHaveClass("file:text-sm");
    expect(inputElement).toHaveClass("file:font-medium");
    expect(inputElement).toHaveClass("placeholder:text-muted-foreground");
    expect(inputElement).toHaveClass("focus-visible:outline-none");
    expect(inputElement).toHaveClass("focus-visible:ring-1");
    expect(inputElement).toHaveClass("focus-visible:ring-ring");
    expect(inputElement).toHaveClass("disabled:cursor-not-allowed");
    expect(inputElement).toHaveClass("disabled:opacity-50");
  });

  test("applies custom class names", () => {
    render(<Input className="custom-class another-class" />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveClass("custom-class");
    expect(inputElement).toHaveClass("another-class");
  });

  test("applies the correct input type", () => {
    render(<Input type="email" />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveAttribute("type", "email");
  });

  test("has default type when not specified", () => {
    render(<Input />);
    const inputElement = screen.getByRole("textbox") as HTMLInputElement;
    // When no type prop is provided, no type attribute is set on the DOM element
    // But the browser defaults to treating inputs without a type as text inputs
    expect(inputElement).not.toHaveAttribute("type"); // No explicit type attribute
    expect(inputElement.type).toBe("text"); // But the computed type is text
  });

  test("handles value prop", () => {
    render(<Input value="test value" />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveValue("test value");
  });

  test("handles onChange event", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const inputElement = screen.getByRole("textbox");
    
    fireEvent.change(inputElement, { target: { value: "new value" } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: "new value"
        })
      })
    );
  });

  test("handles disabled state", () => {
    render(<Input disabled />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveClass("disabled:cursor-not-allowed");
    expect(inputElement).toHaveClass("disabled:opacity-50");
  });

  test("can receive focus", () => {
    render(<Input />);
    const inputElement = screen.getByRole("textbox");
    inputElement.focus();
    expect(inputElement).toHaveFocus();
  });

  test("handles placeholder", () => {
    render(<Input placeholder="Enter text" />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveAttribute("placeholder", "Enter text");
  });

  test("handles other HTML input attributes", () => {
    render(<Input id="test-id" name="test-name" data-testid="test-input" />);
    const inputElement = screen.getByTestId("test-input");
    expect(inputElement).toHaveAttribute("id", "test-id");
    expect(inputElement).toHaveAttribute("name", "test-name");
    expect(inputElement).toHaveAttribute("data-testid", "test-input");
  });

  test("forwards ref properly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current instanceof HTMLInputElement).toBe(true);
  });
});