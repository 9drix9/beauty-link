"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Star, ThumbsUp, ThumbsDown, Send, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BookingData {
  id: string;
  serviceName: string;
  professionalName: string;
  appointmentDate: string;
}

interface ReviewFormProps {
  booking: BookingData;
}

export function ReviewForm({ booking }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [wouldRebook, setWouldRebook] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const displayRating = hoveredRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    if (comment.length < 10) {
      setError("Please write at least 10 characters in your review.");
      return;
    }

    if (comment.length > 500) {
      setError("Your review must be 500 characters or fewer.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          comment,
          wouldRebook,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review.");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card variant="default">
        <CardContent className="p-8 text-center space-y-4">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-dark">Thank you for your review!</h2>
          <p className="text-muted">
            Your feedback helps other customers and supports {booking.professionalName}.
          </p>
          <Button variant="primary" asChild>
            <Link href="/my-bookings">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to My Bookings
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-1 text-sm text-purple-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to My Bookings
        </Link>
      </div>

      <Card variant="default">
        <CardHeader>
          <CardTitle>Leave a Review</CardTitle>
          <p className="text-sm text-muted">
            {booking.serviceName} with {booking.professionalName}
            {" — "}
            {format(new Date(booking.appointmentDate), "MMM d, yyyy")}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-body">
                How was your experience?
              </label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-primary rounded"
                      aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          starValue <= displayRating
                            ? "fill-orange-primary text-orange-primary"
                            : "fill-none text-gray-300"
                        )}
                      />
                    </button>
                  );
                })}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Great"}
                    {rating === 5 && "Excellent"}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <Textarea
              label="Your Review"
              placeholder="Share your experience... What did you enjoy? Would you recommend this service?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              showCount
              autoResize
              className="min-h-[120px]"
            />
            {comment.length > 0 && comment.length < 10 && (
              <p className="text-xs text-muted">
                {10 - comment.length} more character{10 - comment.length !== 1 ? "s" : ""} needed
              </p>
            )}

            {/* Would Rebook */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-body">
                Would you rebook with {booking.professionalName}?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWouldRebook(wouldRebook === true ? null : true)}
                  aria-pressed={wouldRebook === true}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors",
                    wouldRebook === true
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-border bg-white text-body hover:bg-gray-50"
                  )}
                >
                  <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRebook(wouldRebook === false ? null : false)}
                  aria-pressed={wouldRebook === false}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors",
                    wouldRebook === false
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-border bg-white text-body hover:bg-gray-50"
                  )}
                >
                  <ThumbsDown className="h-4 w-4" aria-hidden="true" />
                  No
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="cta"
              size="lg"
              loading={isSubmitting}
              disabled={rating === 0 || comment.length < 10}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
