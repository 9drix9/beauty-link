import { cn } from "@/lib/utils";

interface BeautyLinkLogoProps {
  className?: string;
  /** Optional badge text (e.g. "Pro", "Admin") */
  badge?: string;
  /** Badge style variant */
  badgeVariant?: "pill" | "rounded";
}

export function BeautyLinkLogo({
  className,
  badge,
  badgeVariant = "rounded",
}: BeautyLinkLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="font-serif font-semibold tracking-tight">
        BeautyLink
      </span>
      {badge && (
        <span
          className={cn(
            "bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5",
            badgeVariant === "pill" ? "rounded-full text-xs font-medium px-2" : "rounded-md"
          )}
        >
          {badge}
        </span>
      )}
    </span>
  );
}
