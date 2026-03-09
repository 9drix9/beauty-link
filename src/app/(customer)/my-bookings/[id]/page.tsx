import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Clock,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

import { db } from "@/lib/db";
import { formatPrice, formatDuration, isWithinCancellationWindow } from "@/lib/utils";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingActions } from "./booking-actions";

export const metadata: Metadata = {
  title: "Booking Details",
};

interface BookingDetailPageProps {
  params: { id: string };
  searchParams: { confirmed?: string };
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

export default async function BookingDetailPage({
  params,
  searchParams,
}: BookingDetailPageProps) {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const booking = await db.booking.findUnique({
    where: { id: params.id },
    include: {
      appointmentListing: {
        include: {
          professional: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  profilePhotoUrl: true,
                },
              },
            },
          },
        },
      },
      review: {
        select: { id: true },
      },
    },
  });

  if (!booking || booking.customerId !== user.id) {
    notFound();
  }

  const isConfirmed = searchParams.confirmed === "true";
  const pro = booking.appointmentListing.professional;
  const proName =
    pro.displayName || `${pro.user.firstName} ${pro.user.lastName}`;
  const statusConfig = STATUS_CONFIG[booking.status] || {
    label: booking.status,
    variant: "outline" as const,
  };

  const priceBreakdown = calculatePriceBreakdown(
    booking.originalPrice,
    booking.discountedPrice,
    booking.promoDiscount || 0
  );

  // Determine if cancellation is eligible
  const canCancel =
    booking.status === "CONFIRMED" &&
    !isWithinCancellationWindow(
      booking.appointmentDate,
      booking.appointmentTime
    );

  const isCompleted = booking.status === "COMPLETED";
  const hasReview = !!booking.review;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/my-bookings"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Bookings
      </Link>

      {/* Confirmation Banner */}
      {isConfirmed && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-success-light p-4">
          <CheckCircle className="h-6 w-6 flex-shrink-0 text-success" />
          <div>
            <p className="font-semibold text-success">Booking Confirmed!</p>
            <p className="text-sm text-success/80">
              Your appointment has been booked successfully. A confirmation
              email has been sent.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark">
              {booking.serviceName}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Booking Reference:{" "}
              <span className="font-mono font-medium text-dark">
                {booking.bookingReference}
              </span>
            </p>
          </div>
          <Badge variant={statusConfig.variant} size="md">
            {statusConfig.label}
          </Badge>
        </div>

        {/* Professional Info */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Professional</p>
                <Link
                  href={`/pro/${pro.id}`}
                  className="font-semibold text-accent hover:underline"
                >
                  {proName}
                </Link>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/pro/${pro.id}`}>View Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted" />
              <span>
                {format(
                  new Date(booking.appointmentDate),
                  "EEEE, MMMM d, yyyy"
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted" />
              <span>
                {formatTime(booking.appointmentTime)} &middot;{" "}
                {formatDuration(booking.durationMinutes)}
              </span>
            </div>
            {booking.locationAddress && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted" />
                <span>{booking.locationAddress}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Price Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Original price</span>
              <span className="line-through text-muted">
                {formatPrice(priceBreakdown.originalPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Discounted price</span>
              <span>{formatPrice(priceBreakdown.discountedPrice)}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>You saved ({priceBreakdown.savingsPercent}%)</span>
              <span>-{formatPrice(priceBreakdown.savingsAmount)}</span>
            </div>
            {booking.promoDiscount && booking.promoDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>Promo discount</span>
                <span>-{formatPrice(booking.promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Service fee (5%)</span>
              <span>{formatPrice(priceBreakdown.platformFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold text-dark">
              <span>Total Paid</span>
              <span>{formatPrice(priceBreakdown.totalCharged)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <BookingActions
          bookingId={booking.id}
          professionalId={pro.id}
          canCancel={canCancel}
          isCompleted={isCompleted}
          hasReview={hasReview}
        />

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
          <Shield className="h-3.5 w-3.5" />
          <span>Payment processed securely by Stripe</span>
        </div>
      </div>
    </div>
  );
}
