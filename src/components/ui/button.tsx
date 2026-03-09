import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-md hover:shadow-glow focus-visible:ring-brand-500":
              variant === "primary",
            "bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-900":
              variant === "secondary",
            "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-500 shadow-sm":
              variant === "outline",
            "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 focus-visible:ring-gray-500":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500":
              variant === "danger",
          },
          {
            "h-8 px-3.5 text-xs gap-1.5": size === "sm",
            "h-10 px-5 text-sm gap-2": size === "md",
            "h-12 px-7 text-base gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
