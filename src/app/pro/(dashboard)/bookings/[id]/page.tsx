import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Mail,
  DollarSign,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Booking Details | BeautyLink Pro" };

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "CONFIRMED":
      return <Badge variant="success">Confirmed</Badge>;
    case "COMPLETED":
      return <Badge variant="default">Completed</Badge>;
    case "CANCELLED":
      return <Badge variant="error">Cancelled</Badge>;
    case "NO_SHOW":
      return <Badge variant="warning">No Show</Badge>;
    case "DISPUTED":
      return <Badge variant="warning">Disputed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "CONFIRMED":
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case "COMPLETED":
      return <CheckCircle2 className="h-5 w-5 text-accent" />;
    case "CANCELLED":
      return <XCircle className="h-5 w-5 text-error" />;
    default:
      return <AlertCircle className="h-5 w-5 text-warning" />;
  }
}

export default async function ProBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requirePro();
  const profile = user.professionalProfile;

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      appointmentListing: true,
    },
  });

  if (!booking || booking.professionalId !== profile.id) {
    notFound();
  }

  const apptDate = new Date(booking.appointmentDate);
  const isPast = apptDate.getTime() < Date.now();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back link */}
      <Link
        href="/pro/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-dark transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon(booking.status)}
          <div>
            <h1 className="text-2xl font-bold text-dark">
              {booking.serviceName}
            </h1>
            <p className="text-sm text-muted">
              Ref: {booking.bookingReference}
            </p>
          </div>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent-light p-2">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted">Date</p>
                <p className="font-medium text-dark">
                  {format(apptDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info-light p-2">
                <Clock className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted">Time</p>
                <p className="font-medium text-dark">
                  {formatTime(booking.appointmentTime)} ({booking.durationMinutes} min)
                </p>
              </div>
            </div>
          </div>
          {booking.locationAddress && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success-light p-2">
                <MapPin className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="font-medium text-dark">
                  {booking.locationAddress}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {booking.customer.profilePhotoUrl ? (
              <Image
                src={booking.customer.profilePhotoUrl}
                alt={`${booking.customer.firstName} ${booking.customer.lastName}`}
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white font-bold">
                {booking.customer.firstName?.[0]}
                {booking.customer.lastName?.[0]}
              </div>
            )}
            <div>
              <p className="font-medium text-dark">
                {booking.customer.firstName} {booking.customer.lastName}
              </p>
              <div className="flex items-center gap-1.5 text-sm text-muted">
                <Mail className="h-3.5 w-3.5" />
                {booking.customer.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Original Price</span>
              <span className="text-sm text-muted line-through">
                {formatPrice(booking.originalPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-body">Discounted Price</span>
              <span className="text-sm font-medium text-dark">
                {formatPrice(booking.discountedPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Platform Fee</span>
              <span className="text-sm text-muted">
                -{formatPrice(booking.platformFee)}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-medium text-dark">Your Payout</span>
              <span className="text-lg font-bold text-success">
                {formatPrice(booking.discountedPrice - booking.platformFee)}
              </span>
            </div>
            {booking.payoutReleased && (
              <div className="flex items-center gap-2 rounded-lg bg-success-light px-3 py-2 text-sm text-success">
                <DollarSign className="h-4 w-4" />
                Payout released{" "}
                {booking.payoutReleasedAt
                  ? format(new Date(booking.payoutReleasedAt), "MMM d, yyyy")
                  : ""}
              </div>
            )}
            {!booking.payoutReleased && booking.status === "CONFIRMED" && !isPast && (
              <div className="flex items-center gap-2 rounded-lg bg-info-light px-3 py-2 text-sm text-info">
                <CreditCard className="h-4 w-4" />
                Payout will be released 24 hours after the appointment
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timestamps */}
      <div className="rounded-xl border border-border bg-white p-4 text-xs text-muted">
        <p>Booked on {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
        {booking.cancelledAt && (
          <p className="mt-1">
            Cancelled on {format(new Date(booking.cancelledAt), "MMM d, yyyy 'at' h:mm a")}
            {booking.cancellationReason && `: ${booking.cancellationReason}`}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/pro/appointments">View All Appointments</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/messages`}>Message Client</Link>
        </Button>
      </div>
    </div>
  );
}
