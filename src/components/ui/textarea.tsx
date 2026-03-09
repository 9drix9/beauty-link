import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      autoResize = false,
      maxLength,
      showCount = false,
      id,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = React.useState(
      () => String(value ?? defaultValue ?? "").length
    );

    const mergedRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref]
    );

    const resize = React.useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    React.useEffect(() => {
      resize();
    }, [resize, value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      resize();
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-body"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={mergedRef}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm text-body transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error focus-visible:ring-error"
              : "border-border focus-visible:ring-accent focus-visible:border-accent",
            autoResize && "resize-none overflow-hidden",
            className
          )}
          maxLength={maxLength}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : undefined
          }
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && (
            <p
              id={`${textareaId}-error`}
              className="text-sm text-error"
              role="alert"
            >
              {error}
            </p>
          )}
          {showCount && maxLength && (
            <p
              className={cn(
                "ml-auto text-xs",
                charCount >= maxLength ? "text-error" : "text-muted"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
