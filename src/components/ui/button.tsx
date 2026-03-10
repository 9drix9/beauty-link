import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-dark text-white hover:bg-dark/90 active:scale-[0.98] shadow-sm",
        cta:
          "bg-cta text-white hover:bg-cta-hover active:scale-[0.98] shadow-sm",
        secondary:
          "border border-border text-dark bg-white hover:bg-background",
        ghost:
          "text-dark hover:bg-background bg-transparent",
        destructive:
          "bg-error text-white hover:bg-error/90 active:scale-[0.98]",
        outline:
          "border border-border bg-white text-body hover:bg-background",
        "hero-primary":
          "bg-white text-dark hover:bg-white/90 active:scale-[0.98] shadow-sm font-semibold",
        "hero-outline":
          "border-2 border-white/80 text-white bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-sm",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-lg",
        md: "h-10 px-6 text-sm rounded-lg",
        lg: "h-12 px-8 text-base rounded-lg",
        xl: "h-14 px-10 text-base rounded-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
