import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "pink" | "premium";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        {
          "bg-gray-100 text-gray-600": variant === "default",
          "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200": variant === "success",
          "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200": variant === "warning",
          "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200": variant === "danger",
          "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200": variant === "pink",
          "bg-gradient-to-r from-brand-500 to-purple-500 text-white shadow-sm": variant === "premium",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
