import { Star, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ReviewCardProps {
  id: string;
  starRating: number;
  comment: string | null;
  wouldRebook: boolean | null;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string | null;
  };
}

export function ReviewCard({
  starRating,
  comment,
  wouldRebook,
  createdAt,
  customer,
}: ReviewCardProps) {
  const displayName = `${customer.firstName} ${customer.lastName.charAt(0)}.`;
  const initials = `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`;
  const relativeDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <Card variant="default">
      <CardContent className="p-5 space-y-3">
        {/* Header: Avatar + Name + Date */}
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            {customer.profilePhotoUrl ? (
              <AvatarImage
                src={customer.profilePhotoUrl}
                alt={displayName}
              />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark truncate">{displayName}</p>
            <p className="text-xs text-muted">{relativeDate}</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              aria-hidden="true"
              className={cn(
                "h-4 w-4",
                i < starRating
                  ? "fill-cta text-cta"
                  : "fill-none text-border"
              )}
            />
          ))}
        </div>

        {/* Comment */}
        {comment && (
          <p className="text-sm text-body leading-relaxed">{comment}</p>
        )}

        {/* Would Rebook */}
        {wouldRebook === true && (
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
            <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
            Would rebook
          </p>
        )}
      </CardContent>
    </Card>
  );
}
