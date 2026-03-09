"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BookingActionsProps {
  bookingId: string;
  professionalId: string;
  canCancel: boolean;
  isCompleted: boolean;
  hasReview: boolean;
}

export function BookingActions({
  bookingId,
  professionalId,
  canCancel,
  isCompleted,
  hasReview,
}: BookingActionsProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking? You will receive a full refund.")) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to cancel booking");
        return;
      }

      router.refresh();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const showActions = canCancel || isCompleted;

  if (!showActions) return null;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md" asChild>
            <Link href={`/pro/${professionalId}`}>Contact Professional</Link>
          </Button>

          {isCompleted && !hasReview && (
            <Button variant="primary" size="md" asChild>
              <Link href={`/my-bookings/${bookingId}/review`}>
                Leave Review
              </Link>
            </Button>
          )}

          {canCancel && (
            <Button
              variant="destructive"
              size="md"
              onClick={handleCancel}
              loading={isCancelling}
              disabled={isCancelling}
            >
              Cancel Booking
            </Button>
          )}
        </div>

        {canCancel && (
          <p className="mt-3 text-xs text-muted">
            Free cancellation is available up to 24 hours before the
            appointment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
