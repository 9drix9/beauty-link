import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Eye,
  Users,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Listing Details | BeautyLink Pro" };

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "LIVE":
      return <Badge variant="success">Live</Badge>;
    case "DRAFT":
      return <Badge variant="warning">Draft</Badge>;
    case "PAUSED":
      return <Badge variant="warning">Paused</Badge>;
    case "BOOKED":
      return <Badge variant="outline">Fully Booked</Badge>;
    case "EXPIRED":
      return <Badge variant="error">Expired</Badge>;
    case "CANCELLED":
      return <Badge variant="error">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requirePro();
  const profile = user.professionalProfile;

  const listing = await db.appointmentListing.findUnique({
    where: { id },
    include: {
      bookings: {
        include: { customer: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!listing || listing.professionalId !== profile.id) {
    notFound();
  }

  const savingsPercent = Math.round(
    ((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back link */}
      <Link
        href="/pro/appointments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-dark transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Appointments
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">{listing.serviceName}</h1>
          <p className="text-sm text-muted capitalize">
            {listing.serviceCategory.toLowerCase().replace("_", " ")}
          </p>
        </div>
        {getStatusBadge(listing.status)}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-info-light p-2">
              <Eye className="h-4 w-4 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted">Views</p>
              <p className="text-lg font-bold text-dark">{listing.viewCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-success-light p-2">
              <Users className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted">Booked</p>
              <p className="text-lg font-bold text-dark">
                {listing.bookedCount} / {listing.maxClients}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-accent-light p-2">
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted">Revenue</p>
              <p className="text-lg font-bold text-dark">
                {formatPrice(listing.discountedPrice * listing.bookedCount)}
              </p>
            </div>
          </CardContent>
        </Card>
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
                  {format(new Date(listing.appointmentDate), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info-light p-2">
                <Clock className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted">Time & Duration</p>
                <p className="font-medium text-dark">
                  {formatTime(listing.appointmentTime)} ({listing.durationMinutes} min)
                </p>
              </div>
            </div>
          </div>
          {listing.locationAddress && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success-light p-2">
                <MapPin className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="font-medium text-dark">{listing.locationAddress}</p>
              </div>
            </div>
          )}
          {listing.description && (
            <div className="pt-2">
              <p className="text-xs font-medium uppercase text-muted mb-1">Description</p>
              <p className="text-sm text-body">{listing.description}</p>
            </div>
          )}
          {listing.whatsIncluded.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium uppercase text-muted mb-2">What&apos;s Included</p>
              <ul className="space-y-1.5">
                {listing.whatsIncluded.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-body">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Original Price</span>
              <span className="text-sm text-muted line-through">
                {formatPrice(listing.originalPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-body">Deal Price</span>
                <span className="rounded-full bg-cta/10 px-2 py-0.5 text-xs font-semibold text-cta">
                  {savingsPercent}% OFF
                </span>
              </div>
              <span className="text-lg font-bold text-dark">
                {formatPrice(listing.discountedPrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings for this listing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Bookings ({listing.bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listing.bookings.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted">
              No bookings yet for this listing.
            </p>
          ) : (
            <div className="space-y-2">
              {listing.bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/pro/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-background"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                      {booking.customer.firstName?.[0]}
                      {booking.customer.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {booking.customer.firstName} {booking.customer.lastName}
                      </p>
                      <p className="text-xs text-muted">
                        Booked {format(new Date(booking.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dark">
                      {formatPrice(booking.totalCharged)}
                    </span>
                    {booking.status === "CONFIRMED" ? (
                      <Badge variant="success">Confirmed</Badge>
                    ) : booking.status === "COMPLETED" ? (
                      <Badge variant="default">Completed</Badge>
                    ) : (
                      <Badge variant="outline">{booking.status}</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timestamps */}
      <div className="rounded-xl border border-border bg-white p-4 text-xs text-muted">
        <p>Created {format(new Date(listing.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
        <p>Last updated {format(new Date(listing.updatedAt), "MMM d, yyyy 'at' h:mm a")}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/pro/appointments">All Appointments</Link>
        </Button>
        <Button variant="cta" asChild>
          <Link href="/pro/appointments/new">Post New Deal</Link>
        </Button>
      </div>
    </div>
  );
}
