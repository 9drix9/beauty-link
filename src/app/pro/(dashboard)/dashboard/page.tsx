import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import Link from "next/link";
import {
  DollarSign,
  CalendarCheck,
  Star,
  Plus,
  Eye,
  ArrowRight,
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Dashboard — BeautyLink Pro" };

function getStatusBadge(status: string) {
  switch (status) {
    case "LIVE":
      return <Badge variant="success">Live</Badge>;
    case "DRAFT":
    case "PAUSED":
      return <Badge variant="warning">{status === "DRAFT" ? "Draft" : "Paused"}</Badge>;
    case "BOOKED":
      return <Badge variant="outline">Booked</Badge>;
    case "CONFIRMED":
      return <Badge variant="success">Confirmed</Badge>;
    case "COMPLETED":
      return <Badge variant="default">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export default async function ProDashboardPage() {
  const user = await requirePro();
  const profile = user.professionalProfile;

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

  const [
    activeListingsCount,
    upcomingBookings,
    thisWeekBookings,
    lastWeekBookings,
    recentListings,
    totalClientsCount,
  ] = await Promise.all([
    db.appointmentListing.count({
      where: { professionalId: profile.id, status: "LIVE" },
    }),
    db.booking.findMany({
      where: {
        professionalId: profile.id,
        status: "CONFIRMED",
        appointmentDate: { gte: today },
      },
      include: { customer: true },
      orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
      take: 5,
    }),
    db.booking.findMany({
      where: {
        professionalId: profile.id,
        status: { in: ["CONFIRMED", "COMPLETED"] },
        appointmentDate: { gte: thisWeekStart, lte: thisWeekEnd },
      },
      select: { discountedPrice: true },
    }),
    db.booking.findMany({
      where: {
        professionalId: profile.id,
        status: { in: ["CONFIRMED", "COMPLETED"] },
        appointmentDate: { gte: lastWeekStart, lte: lastWeekEnd },
      },
      select: { discountedPrice: true },
    }),
    db.appointmentListing.findMany({
      where: { professionalId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.booking.groupBy({
      by: ["customerId"],
      where: {
        professionalId: profile.id,
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
    }),
  ]);

  const thisWeekEarnings = thisWeekBookings.reduce(
    (sum, b) => sum + b.discountedPrice,
    0
  );
  const lastWeekEarnings = lastWeekBookings.reduce(
    (sum, b) => sum + b.discountedPrice,
    0
  );
  const earningsTrend =
    lastWeekEarnings > 0
      ? Math.round(
          ((thisWeekEarnings - lastWeekEarnings) / lastWeekEarnings) * 100
        )
      : thisWeekEarnings > 0
        ? 100
        : 0;

  const stats = [
    {
      label: "Active Listings",
      value: activeListingsCount.toString(),
      icon: Zap,
      color: "text-accent",
      bg: "bg-accent-light",
    },
    {
      label: "Upcoming Bookings",
      value: upcomingBookings.length.toString(),
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Earnings This Week",
      value: formatPrice(thisWeekEarnings),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: earningsTrend,
    },
    {
      label: "Total Clients",
      value: totalClientsCount.length.toString(),
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  // Aggregate views + conversion for performance section
  const totalViews = recentListings.reduce((s, l) => s + l.viewCount, 0);
  const totalBooked = recentListings.reduce((s, l) => s + l.bookedCount, 0);
  const conversionRate =
    totalViews > 0 ? ((totalBooked / totalViews) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-accent-light/40 via-white to-cta-light/30 p-6 sm:p-8">
        {/* Decorative blob */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-cta/5 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark">
              Welcome back, {user.firstName}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Here&apos;s your BeautyLink overview.
            </p>
          </div>
          <Button variant="cta" asChild>
            <Link href="/pro/appointments/new">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Post New Deal
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const borderColors = ["border-t-accent", "border-t-blue-500", "border-t-green-500", "border-t-orange-500"];
          return (
            <Card key={stat.label} variant="elevated" className={`border-t-2 ${borderColors[i]}`}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                    <Icon
                      className={`h-5 w-5 ${stat.color}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{stat.label}</p>
                    <p className="text-lg font-bold text-dark sm:text-xl">
                      {stat.value}
                    </p>
                  </div>
                </div>
                {"trend" in stat && stat.trend !== undefined && stat.trend !== 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {stat.trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" aria-hidden="true" />
                    )}
                    <span
                      className={
                        stat.trend > 0 ? "text-green-600" : "text-red-500"
                      }
                    >
                      {stat.trend > 0 ? "+" : ""}
                      {stat.trend}% vs last week
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance + Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="elevated">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-yellow-50 p-2.5">
              <Star className="h-5 w-5 text-yellow-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted">Avg Rating</p>
              <p className="text-lg font-bold text-dark">
                {profile.avgRating > 0
                  ? `${profile.avgRating.toFixed(1)} / 5`
                  : "Not rated yet"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-50 p-2.5">
              <Eye className="h-5 w-5 text-blue-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted">Total Views</p>
              <p className="text-lg font-bold text-dark">{totalViews}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-accent-light p-2.5">
              <BarChart3 className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted">Conversion Rate</p>
              <p className="text-lg font-bold text-dark">{conversionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card variant="elevated">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pro/appointments">
              View all{" "}
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarCheck
                className="mx-auto h-8 w-8 text-muted/50"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm text-muted">
                No upcoming appointments.
              </p>
              <Button variant="cta" size="sm" className="mt-3" asChild>
                <Link href="/pro/appointments/new">
                  <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                  Post a Deal
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/pro/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 sm:p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-medium text-dark">
                      {booking.serviceName}
                    </p>
                    <p className="text-sm text-muted">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-right shrink-0">
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {format(
                          new Date(booking.appointmentDate),
                          "MMM d"
                        )}
                      </p>
                      <p className="text-xs text-muted">
                        {formatTime(booking.appointmentTime)}
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
      <Card variant="elevated">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Recent Listings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pro/appointments">
              View all{" "}
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentListings.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarCheck
                className="mx-auto h-8 w-8 text-muted/50"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm text-muted">
                No listings yet. Post your first deal to attract new clients.
              </p>
              <Button variant="cta" size="sm" className="mt-3" asChild>
                <Link href="/pro/appointments/new">
                  <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                  Post a Deal
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/pro/appointments/${listing.id}/edit`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 sm:p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-medium text-dark">
                      {listing.serviceName}
                    </p>
                    <p className="text-xs text-muted">
                      {format(
                        new Date(listing.appointmentDate),
                        "MMM d, yyyy"
                      )}{" "}
                      at {formatTime(listing.appointmentTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-medium text-dark">
                        {formatPrice(listing.discountedPrice)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        {listing.viewCount}
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

      {/* Lifetime Stats Footer */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-r from-accent-light/30 via-white to-cta-light/30 p-4 sm:p-5 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
          Lifetime
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-dark sm:text-xl">
              {formatPrice(profile.lifetimeEarnings)}
            </p>
            <p className="text-xs text-muted">Earnings</p>
          </div>
          <div>
            <p className="text-lg font-bold text-dark sm:text-xl">
              {profile.totalBookings}
            </p>
            <p className="text-xs text-muted">Bookings</p>
          </div>
          <div>
            <p className="text-lg font-bold text-dark sm:text-xl">
              {formatPrice(profile.availableBalance)}
            </p>
            <p className="text-xs text-muted">Balance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
