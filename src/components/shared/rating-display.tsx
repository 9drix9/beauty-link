import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md";
}

export function RatingDisplay({
  rating,
  reviewCount,
  size = "md",
}: RatingDisplayProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={cn(
              starSize,
              i < Math.round(rating)
                ? "fill-cta text-cta"
                : "fill-none text-border"
            )}
          />
        ))}
      </div>
      <span className={cn("text-muted", textSize)}>
        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}
