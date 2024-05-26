import * as React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autosize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autosize, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || innerRef;

    useEffect(() => {
      const resizeTextarea = () => {
        if (textareaRef && 'current' in textareaRef && textareaRef.current) {
          const textarea = textareaRef.current;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      };

      if (autosize) {
        resizeTextarea();
        window.addEventListener('resize', resizeTextarea);
        return () => window.removeEventListener('resize', resizeTextarea);
      }
    }, [autosize]);

    return (
      <textarea
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={textareaRef}
        {...props}
        onChange={(event) => {
          if (autosize) {
            const textarea = event.target as HTMLTextAreaElement;
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
          }
          if (props.onChange) props.onChange(event);
        }}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
