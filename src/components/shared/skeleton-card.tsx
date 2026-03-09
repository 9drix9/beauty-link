import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="aspect-[3/2] w-full rounded-none" />

      <div className="p-4 space-y-3">
        {/* Title + price row */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Pro name + rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Date + duration */}
        <Skeleton className="h-3.5 w-40" />

        {/* Location */}
        <Skeleton className="h-3.5 w-28" />
      </div>
    </div>
  );
}
