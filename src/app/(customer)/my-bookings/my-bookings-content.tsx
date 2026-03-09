"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Clock, MapPin, Calendar, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatPrice, formatDuration } from "@/lib/utils";

interface SerializedBooking {
  id: string;
  bookingReference: string;
  serviceName: string;
  serviceCategory: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  locationAddress: string | null;
  originalPrice: number;
  discountedPrice: number;
  platformFee: number;
  totalCharged: number;
  status: string;
  createdAt: string;
  appointmentListing: {
    id: string;
    professional: {
      id: string;
      displayName: string | null;
      user: {
        firstName: string;
        lastName: string;
        profilePhotoUrl: string | null;
      };
    };
  };
}

interface MyBookingsContentProps {
  bookings: SerializedBooking[];
}

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "success" | "default" | "error" | "warning" | "outline" }
> = {
  CONFIRMED: { label: "Confirmed", variant: "success" },
  COMPLETED: { label: "Completed", variant: "outline" },
  NO_SHOW: { label: "No Show", variant: "warning" },
  CANCELLED_BY_CUSTOMER: { label: "Cancelled", variant: "error" },
  CANCELLED_BY_PRO: { label: "Cancelled by Provider", variant: "error" },
  DISPUTED: { label: "Disputed", variant: "warning" },
  REFUNDED: { label: "Refunded", variant: "outline" },
};

const UPCOMING_STATUSES = ["CONFIRMED"];
const PAST_STATUSES = [
  "COMPLETED",
  "CANCELLED_BY_CUSTOMER",
  "CANCELLED_BY_PRO",
  "NO_SHOW",
  "DISPUTED",
  "REFUNDED",
];

function canCancel(booking: SerializedBooking): boolean {
  if (booking.status !== "CONFIRMED") return false;

  const [hours, minutes] = booking.appointmentTime.split(":").map(Number);
  const appointmentStart = new Date(booking.appointmentDate);
  appointmentStart.setHours(hours, minutes, 0, 0);

  const hoursUntil =
    (appointmentStart.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntil >= 24;
}

export function MyBookingsContent({ bookings }: MyBookingsContentProps) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const now = new Date();

  const upcomingBookings = useMemo(
    () =>
      bookings.filter((b) => {
        if (!UPCOMING_STATUSES.includes(b.status)) return false;
        const apptDate = new Date(b.appointmentDate);
        return apptDate >= new Date(now.toDateString());
      }),
    [bookings]
  );

  const pastBookings = useMemo(
    () =>
      bookings.filter((b) => {
        if (PAST_STATUSES.includes(b.status)) return true;
        if (b.status === "CONFIRMED") {
          const apptDate = new Date(b.appointmentDate);
          return apptDate < new Date(now.toDateString());
        }
        return false;
      }),
    [bookings]
  );

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
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
      setCancellingId(null);
    }
  };

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="w-full">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingBookings.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({pastBookings.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcomingBookings.length === 0 ? (
          <EmptyState
            title="No upcoming bookings"
            description="Browse available appointments to book your next beauty service."
            actionLabel="Browse Appointments"
            actionHref="/browse"
          />
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                cancellingId={cancellingId}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="past">
        {pastBookings.length === 0 ? (
          <EmptyState
            title="No past bookings"
            description="Your completed and cancelled bookings will appear here."
          />
        ) : (
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                cancellingId={cancellingId}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

function BookingCard({
  booking,
  onCancel,
  cancellingId,
}: {
  booking: SerializedBooking;
  onCancel: (id: string) => void;
  cancellingId: string | null;
}) {
  const pro = booking.appointmentListing.professional;
  const proName =
    pro.displayName || `${pro.user.firstName} ${pro.user.lastName}`;
  const statusConfig = STATUS_CONFIG[booking.status] || {
    label: booking.status,
    variant: "outline" as const,
  };
  const showCancel = canCancel(booking);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-dark line-clamp-1">
                  {booking.serviceName}
                </h3>
                <p className="text-sm text-muted truncate">with {proName}</p>
              </div>
              <Badge variant={statusConfig.variant} size="sm">
                {statusConfig.label}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {format(new Date(booking.appointmentDate), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {formatTime(booking.appointmentTime)} &middot;{" "}
                {formatDuration(booking.durationMinutes)}
              </span>
              {booking.locationAddress && (
                <span className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{booking.locationAddress}</span>
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-dark">
              {formatPrice(booking.totalCharged)}
            </p>
          </div>

          <div className="flex gap-2 sm:flex-col sm:items-end">
            <Button variant="primary" size="sm" asChild>
              <Link href={`/my-bookings/${booking.id}`}>View Details</Link>
            </Button>
            {showCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(booking.id)}
                loading={cancellingId === booking.id}
                disabled={cancellingId === booking.id}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="py-16 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-muted/50" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-semibold text-dark">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {actionLabel && actionHref && (
        <Button variant="primary" size="md" className="mt-4" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
