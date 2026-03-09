import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-white p-4 space-y-4">
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-lg" />

      {/* Title + badge row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Price row */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Date / time */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* CTA button */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
