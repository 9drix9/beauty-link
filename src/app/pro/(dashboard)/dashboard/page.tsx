import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import {
  DollarSign,
  Wallet,
  CalendarCheck,
  Star,
  Plus,
  TrendingUp,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


export const metadata = { title: "Pro Dashboard" };

function getStatusBadge(status: string) {
  switch (status) {
    case "LIVE":
      return <Badge variant="success">{status}</Badge>;
    case "DRAFT":
    case "PAUSED":
      return <Badge variant="warning">{status}</Badge>;
    case "BOOKED":
    case "EXPIRED":
      return <Badge variant="outline">{status}</Badge>;
    case "CANCELLED":
      return <Badge variant="error">{status}</Badge>;
    case "CONFIRMED":
      return <Badge variant="success">Confirmed</Badge>;
    case "COMPLETED":
      return <Badge variant="default">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function ProDashboardPage() {
  const user = await requirePro();
  const profile = user.professionalProfile;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [upcomingBookings, recentListings] = await Promise.all([
    db.booking.findMany({
      where: {
        professionalId: profile.id,
        status: "CONFIRMED",
        appointmentDate: { gte: today },
      },
      include: {
        customer: true,
      },
      orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
      take: 5,
    }),
    db.appointmentListing.findMany({
      where: { professionalId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      label: "Total Earnings",
      value: formatPrice(profile.lifetimeEarnings),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Available Balance",
      value: formatPrice(profile.availableBalance),
      icon: Wallet,
      color: "text-accent",
      bg: "bg-accent-light",
    },
    {
      label: "Total Bookings",
      value: profile.totalBookings.toString(),
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Average Rating",
      value: profile.avgRating > 0 ? profile.avgRating.toFixed(1) : "N/A",
      icon: Star,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-dark">
          Welcome back, {user.firstName}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s an overview of your BeautyLink activity.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted">{stat.label}</p>
                  <p className="text-xl font-bold text-dark">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="cta" asChild>
            <Link href="/pro/appointments/new">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create New Listing
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/pro/earnings">
              <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
              View Earnings
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pro/appointments">
              View all <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No upcoming appointments. Create a listing to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/pro/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-dark">
                      {booking.serviceName}
                    </p>
                    <p className="text-sm text-muted">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {format(new Date(booking.appointmentDate), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted">
                        {booking.appointmentTime}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Listings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pro/appointments">
              View all <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentListings.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              You haven&apos;t created any listings yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/pro/appointments/${listing.id}/edit`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-dark">
                      {listing.serviceName}
                    </p>
                    <p className="text-sm text-muted">
                      {format(new Date(listing.appointmentDate), "MMM d, yyyy")}{" "}
                      at {listing.appointmentTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-dark">
                        {formatPrice(listing.discountedPrice)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        {listing.viewCount} views
                      </div>
                    </div>
                    {getStatusBadge(listing.status)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
