export const dynamic = "force-dynamic";

import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice, getInitials } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import {
  CalendarCheck,
  Plus,
  Eye,
  ArrowRight,
  DollarSign,
  Calendar,
  UserCircle,
  Copy,
  CheckCircle,
  Zap,
  FileText,
  Image,
  Clock,
  Sparkles,
  Camera,
  Rocket,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IS_LAUNCHED } from "@/lib/launch";

export const metadata = { title: "Dashboard | BeautyLink Pro" };

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
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Last week date range for "Repeat Last Week" feature
  const lastWeekStart = new Date();
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  lastWeekStart.setHours(0, 0, 0, 0);

  const [
    activeListings,
    upcomingBookings,
    completedCount,
    monthBookings,
    templateCount,
    recentListings,
    draftCount,
    lastWeekListings,
  ] = await Promise.all([
    db.appointmentListing.findMany({
      where: { professionalId: profile.id, status: "LIVE" },
      orderBy: { appointmentDate: "asc" },
      take: 5,
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
    db.booking.count({
      where: {
        professionalId: profile.id,
        status: "COMPLETED",
      },
    }),
    db.booking.findMany({
      where: {
        professionalId: profile.id,
        status: { in: ["CONFIRMED", "COMPLETED"] },
        appointmentDate: { gte: monthStart },
      },
      select: { discountedPrice: true },
    }),
    db.serviceTemplate.count({
      where: { professionalProfileId: profile.id },
    }),
    db.appointmentListing.findMany({
      where: {
        professionalId: profile.id,
        status: { in: ["LIVE", "BOOKED"] },
      },
      orderBy: { appointmentDate: "desc" },
      take: 3,
      select: { serviceName: true, appointmentDate: true, appointmentTime: true },
    }),
    db.appointmentListing.count({
      where: { professionalId: profile.id, status: "DRAFT" },
    }),
    // Fetch last week's listings for "Repeat Last Week"
    db.appointmentListing.findMany({
      where: {
        professionalId: profile.id,
        appointmentDate: { gte: lastWeekStart, lt: today },
        status: { in: ["LIVE", "BOOKED", "EXPIRED"] },
      },
      orderBy: { appointmentDate: "asc" },
      take: 5,
      select: {
        id: true,
        serviceName: true,
        serviceCategory: true,
        appointmentDate: true,
        appointmentTime: true,
        originalPrice: true,
        discountedPrice: true,
        durationMinutes: true,
        isModelCall: true,
      },
    }),
  ]);

  const thisMonthEarnings = monthBookings.reduce(
    (sum, b) => sum + b.discountedPrice,
    0
  );

  // Profile completion calculation
  const completionChecks = [
    { done: true, label: "Account approved" },
    { done: !!profile.bio, label: "Add a bio" },
    { done: (profile.portfolioPhotos?.length ?? 0) > 0, label: "Upload portfolio photos" },
    { done: profile.payoutEnabled, label: "Connect bank account" },
    { done: !!(profile.defaultAddressLine1 || profile.defaultCity), label: "Set default location" },
    { done: templateCount > 0, label: "Create a service template" },
  ];
  const completionPercent = Math.round(
    (completionChecks.filter((c) => c.done).length / completionChecks.length) *
      100
  );
  const isNewPro = profile.totalBookings === 0 && activeListings.length === 0;

  // Smart nudge — pick contextual message based on pro's activity + launch state
  const lastListingDay = recentListings[0]
    ? new Date(recentListings[0].appointmentDate).toLocaleDateString("en-US", { weekday: "long" })
    : null;
  const hasLastWeek = lastWeekListings.length > 0;

  let nudgeMessage: string;
  if (!IS_LAUNCHED) {
    // Pre-launch nudges
    nudgeMessage = templateCount > 0
      ? draftCount > 0
        ? "You have draft listings ready for launch. Keep setting up!"
        : "You have templates ready — draft a listing so it\u2019s ready for May."
      : completionPercent < 100
        ? "Finish setting up your profile so you\u2019re ready for launch."
        : "Create a service template to prepare your first listings.";
  } else {
    nudgeMessage = templateCount > 0
      ? activeListings.length === 0
        ? hasLastWeek
          ? `Repeat last week's ${lastWeekListings[0].serviceName} slot?`
          : "You have templates ready — Quick Post an opening?"
        : lastListingDay
          ? `You usually post around ${lastListingDay}s — add availability?`
          : "Post another opening?"
      : completedCount > 0
        ? "Save your services as templates to post openings in seconds"
        : "Create a service template to post openings faster";
  }

  return (
    <div className="space-y-8">
      {/* Approval / Welcome Banner */}
      {isNewPro && (
        <div className="relative overflow-hidden rounded-2xl text-white px-6 py-5 sm:px-8 sm:py-6 gradient-welcome-banner">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 shrink-0">
                <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-lg">
                  Welcome to BeautyLink!
                </p>
                <p className="text-sm text-white/80 mt-0.5">
                  {IS_LAUNCHED
                    ? "Set up your profile once, then post openings in seconds."
                    : "You\u2019re getting set up early so you\u2019re ready to start getting bookings when we launch in May."}
                </p>
              </div>
            </div>
            <Link
              href="/pro/settings"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-accent whitespace-nowrap hover:bg-white/90 transition-colors shrink-0"
            >
              <UserCircle className="h-4 w-4" aria-hidden="true" />
              {IS_LAUNCHED ? "Get Started" : "Start Setting Up"}
            </Link>
          </div>

          {/* What you can do now — guided steps */}
          <div className="mt-5">
            {!IS_LAUNCHED && (
              <p className="text-xs text-white/60 mb-2.5 font-medium uppercase tracking-wide">What you can do now</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: UserCircle, text: "Complete your profile", href: "/pro/settings", done: completionPercent >= 75 },
                { icon: FileText, text: "Add services + pricing", href: "/pro/templates", done: templateCount > 0 },
                { icon: Camera, text: "Upload photos of your work", href: "/pro/settings", done: (profile.portfolioPhotos?.length ?? 0) > 0 },
                { icon: Calendar, text: IS_LAUNCHED ? "Post your first opening" : "Draft your first listings", href: "/pro/appointments/new", done: activeListings.length > 0 || draftCount > 0 },
              ].map((step, i) => (
                <Link
                  key={i}
                  href={step.href}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    step.done
                      ? "bg-white/20 text-white/60"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <step.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span className={step.done ? "line-through" : ""}>{step.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="rounded-2xl px-6 py-8 sm:px-8 gradient-dashboard">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-white shrink-0">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-dark">
                Welcome back, {user.firstName}!
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
                <span className="text-sm text-muted">Accepted Stylist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {IS_LAUNCHED ? (
              templateCount > 0 ? (
                <Link
                  href="/pro/appointments/new?mode=quick"
                  className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-dark/90 transition-colors"
                >
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  Quick Post
                </Link>
              ) : (
                <Link
                  href="/pro/appointments/new"
                  className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-dark/90 transition-colors"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  New Listing
                </Link>
              )
            ) : (
              <Link
                href={completionPercent < 100 ? "/pro/settings" : "/pro/appointments/new"}
                className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-dark/90 transition-colors"
              >
                {completionPercent < 100 ? (
                  <><UserCircle className="h-4 w-4" aria-hidden="true" />Continue Setup</>
                ) : (
                  <><Plus className="h-4 w-4" aria-hidden="true" />Draft a Listing</>
                )}
              </Link>
            )}
            <Link
              href={`/pro/${profile.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-body hover:bg-background transition-colors"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy Link
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            {
              value: upcomingBookings.length.toString(),
              label: "Upcoming",
              color: "text-accent",
            },
            {
              value: completedCount.toString(),
              label: "Completed",
              color: "text-success",
            },
            {
              value: formatPrice(thisMonthEarnings),
              label: "This Month",
              color: "text-dark",
            },
            {
              value: formatPrice(profile.availableBalance),
              label: "Pending Payout",
              color: "text-cta",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 px-4 py-4 text-center"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Nudge */}
      {!isNewPro && (
        <div className="rounded-xl border border-accent/20 bg-accent-light/30 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium text-dark">{nudgeMessage}</p>
          </div>
          <div className="flex items-center gap-2">
            {templateCount > 0 && (
              <Link
                href="/pro/appointments/new?mode=quick"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                Quick Post
              </Link>
            )}
            {hasLastWeek && (
              <Link
                href="#repeat-last-week"
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-white px-4 py-2 text-xs font-medium text-accent hover:bg-accent-light transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                Repeat Last Week
              </Link>
            )}
            <Link
              href="/pro/templates"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-body hover:bg-background transition-colors"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Templates
            </Link>
          </div>
        </div>
      )}

      {/* Profile Completion */}
      {completionPercent < 100 && (
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-dark">Complete Your Profile</h2>
            <span className="text-sm font-semibold text-accent">
              {completionPercent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <div className="mt-3 space-y-1.5">
            {completionChecks
              .filter((c) => !c.done)
              .slice(0, 3)
              .map((check, i) => (
                <Link
                  key={i}
                  href={
                    check.label.includes("template")
                      ? "/pro/templates"
                      : check.label.includes("location")
                        ? "/pro/settings"
                        : "/pro/settings"
                  }
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {check.label}
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Pre-launch timeline */}
      {!IS_LAUNCHED && (
        <div className="rounded-xl border border-accent/15 bg-accent-light/20 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5 text-accent shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-dark">Listings go live in May</p>
              <p className="text-xs text-muted mt-0.5">Set up your profile and services now so you&apos;re ready to start getting bookings at launch.</p>
            </div>
          </div>
        </div>
      )}

      {/* Help line */}
      {isNewPro && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Need help getting set up? <Link href="/contact" className="text-accent hover:underline">Reach out anytime.</Link></span>
        </div>
      )}

      {/* Drafts banner */}
      {draftCount > 0 && (
        <Link
          href="/pro/appointments"
          className="block rounded-xl border border-warning/20 bg-warning/5 px-5 py-3 text-sm font-medium text-dark hover:bg-warning/10 transition-colors"
        >
          <Clock className="inline h-4 w-4 text-warning mr-2" aria-hidden="true" />
          You have {draftCount} draft{draftCount !== 1 ? "s" : ""} — resume editing
        </Link>
      )}

      {/* Repeat Last Week */}
      {!isNewPro && lastWeekListings.length > 0 && (
        <div id="repeat-last-week" className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="font-bold text-dark">Repeat Last Week</h2>
            </div>
            <span className="text-xs text-muted">Repost with a new date</span>
          </div>
          <div className="space-y-2">
            {lastWeekListings.map((listing) => {
              const date = new Date(listing.appointmentDate);
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
              const [h, m] = listing.appointmentTime.split(":").map(Number);
              const period = h >= 12 ? "PM" : "AM";
              const displayHour = h % 12 || 12;
              return (
                <div
                  key={listing.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-background transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark truncate">
                      {listing.serviceName}
                    </p>
                    <p className="text-xs text-muted">
                      {dayName} at {displayHour}:{m.toString().padStart(2, "0")} {period}
                      {!listing.isModelCall && (
                        <span className="ml-2">{formatPrice(listing.discountedPrice)}</span>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/pro/appointments/new?duplicateId=${listing.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-colors shrink-0 ml-3"
                  >
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    Repost
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two-column: Upcoming Appointments + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">
              Upcoming Appointments
            </h2>
            <Link
              href="/pro/appointments"
              className="text-sm font-medium text-accent hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="rounded-xl border border-border bg-white py-16 text-center">
              <Calendar
                className="mx-auto h-10 w-10 text-border"
                aria-hidden="true"
              />
              <p className="mt-3 text-muted font-medium">No upcoming appointments</p>
              <p className="text-sm text-muted mt-1">
                {IS_LAUNCHED
                  ? "Post an opening to start getting booked"
                  : "Set up your services and draft listings so you\u2019re ready for launch"}
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                {IS_LAUNCHED && templateCount > 0 && (
                  <Link
                    href="/pro/appointments/new?mode=quick"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
                  >
                    <Zap className="h-4 w-4" aria-hidden="true" />
                    Quick Post
                  </Link>
                )}
                <Link
                  href="/pro/appointments/new"
                  className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-dark/90 transition-colors"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {IS_LAUNCHED ? "Create Listing" : "Draft a Listing"}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/pro/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-white p-4 transition-all hover:shadow-sm hover:-translate-y-0.5"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-dark">
                      {booking.serviceName}
                    </p>
                    <p className="text-sm text-muted mt-0.5">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-dark">
                      {format(new Date(booking.appointmentDate), "MMM d")}
                    </p>
                    <p className="text-xs text-muted">
                      {formatTime(booking.appointmentTime)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Quick Actions + Active Listings */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-bold text-dark mb-3">Quick Actions</h2>
            <div className="space-y-1">
              {IS_LAUNCHED && templateCount > 0 && (
                <Link
                  href="/pro/appointments/new?mode=quick"
                  className="flex items-center gap-3 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
                >
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  Quick Post
                </Link>
              )}
              <Link
                href="/pro/appointments/new"
                className="flex items-center gap-3 rounded-xl bg-dark px-4 py-3 text-sm font-semibold text-white hover:bg-dark/90 transition-colors"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {IS_LAUNCHED ? "New Listing" : "Draft a Listing"}
              </Link>
              {[
                {
                  label: "My Templates",
                  href: "/pro/templates",
                  icon: FileText,
                },
                {
                  label: "View Appointments",
                  href: "/pro/appointments",
                  icon: CalendarCheck,
                },
                {
                  label: "View Earnings",
                  href: "/pro/earnings",
                  icon: DollarSign,
                },
                {
                  label: "Edit Profile",
                  href: "/pro/settings",
                  icon: UserCircle,
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-body hover:bg-background transition-colors"
                >
                  <action.icon className="h-4 w-4 text-muted" aria-hidden="true" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Active Listings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-dark">Active Listings</h2>
              {activeListings.length > 0 && (
                <Badge variant="success" size="sm">
                  {activeListings.length} live
                </Badge>
              )}
            </div>

            {activeListings.length === 0 ? (
              <div className="rounded-xl border border-border bg-white p-6 text-center space-y-3">
                <p className="text-sm text-muted">
                  {IS_LAUNCHED ? "No active listings" : "No listings yet"}
                </p>
                <div className="space-y-1.5 text-left">
                  {[
                    ...(IS_LAUNCHED
                      ? [{ label: "Quick Post an opening", href: "/pro/appointments/new?mode=quick", icon: Zap }]
                      : [{ label: "Draft a listing", href: "/pro/appointments/new", icon: Calendar }]),
                    { label: "Create a service template", href: "/pro/templates", icon: FileText },
                    { label: "Upload portfolio photos", href: "/pro/settings", icon: Image },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-2 text-sm text-accent hover:underline"
                    >
                      <action.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {activeListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/pro/appointments/${listing.id}/edit`}
                    className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 hover:bg-background transition-colors"
                  >
                    <span className="text-sm font-medium text-dark truncate">
                      {listing.serviceName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        {listing.viewCount}
                      </span>
                      <span className="text-sm font-semibold text-accent">
                        {formatPrice(listing.discountedPrice)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
