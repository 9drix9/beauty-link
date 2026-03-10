"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewCard, type ReviewCardProps } from "@/components/shared/review-card";
import { Button } from "@/components/ui/button";

interface ReviewListProps {
  professionalId: string;
  initialReviews?: ReviewCardProps[];
}

export function ReviewList({ professionalId, initialReviews }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewCardProps[]>(
    initialReviews || []
  );
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialReviews);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(!!initialReviews);

  const fetchReviews = useCallback(
    async (cursor?: string | null) => {
      const params = new URLSearchParams({
        professionalId,
        limit: "10",
      });
      if (cursor) {
        params.set("cursor", cursor);
      }

      const res = await fetch(`/api/reviews?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }

      return res.json() as Promise<{
        reviews: ReviewCardProps[];
        nextCursor: string | null;
      }>;
    },
    [professionalId]
  );

  useEffect(() => {
    if (hasInitialized) return;

    let cancelled = false;

    async function load() {
      try {
        const data = await fetchReviews();
        if (!cancelled) {
          setReviews(data.reviews);
          setNextCursor(data.nextCursor);
        }
      } catch {
        // Silently handle - empty state will show
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchReviews, hasInitialized]);

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const data = await fetchReviews(nextCursor);
      setReviews((prev) => [...prev, ...data.reviews]);
      setNextCursor(data.nextCursor);
    } catch {
      // Silently handle
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-lg bg-background animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} {...review} />
      ))}

      {nextCursor && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleLoadMore}
            loading={isLoadingMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
