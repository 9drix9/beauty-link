import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Briefcase,
  Award,
  Calendar,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";

import { db } from "@/lib/db";
import { formatPrice, getInitials, calcSavingsPercent } from "@/lib/utils";
import { WORK_SETTINGS, YEARS_EXPERIENCE_OPTIONS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RatingDisplay } from "@/components/shared/rating-display";
import { VerificationBadges } from "@/components/shared/verification-badges";
import { MessageButton } from "@/components/shared/message-button";

interface ProProfilePageProps {
  params: { id: string };
}

async function getProfile(id: string) {
  const profile = await db.professionalProfile.findUnique({
    where: { id, applicationStatus: "APPROVED" },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
        },
      },
      appointments: {
        where: { status: "LIVE" },
        orderBy: { appointmentDate: "asc" },
        take: 10,
      },
    },
  });
  return profile;
}

export async function generateMetadata({
  params,
}: ProProfilePageProps): Promise<Metadata> {
  const profile = await getProfile(params.id);
  if (!profile) return { title: "Professional Not Found | BeautyLink" };

  const name =
    profile.displayName ||
    `${profile.user.firstName} ${profile.user.lastName}`;

  return {
    title: `${name} | BeautyLink Professional`,
    description: profile.bio || `Book discounted appointments with ${name} on BeautyLink.`,
  };
}

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export default async function ProProfilePage({
  params,
}: ProProfilePageProps) {
  const profile = await getProfile(params.id);

  if (!profile) {
    notFound();
  }

  const user = profile.user;
  const proName =
    profile.displayName || `${user.firstName} ${user.lastName}`;

  const workSettingLabel = profile.workSetting
    ? WORK_SETTINGS.find((ws) => ws.value === profile.workSetting)?.label
    : null;
  const yearsLabel = profile.yearsExperience
    ? YEARS_EXPERIENCE_OPTIONS.find(
        (ye) => ye.value === profile.yearsExperience
      )?.label
    : null;

  const images = profile.portfolioPhotos || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Simple top nav for this page */}
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="shrink-0 text-xl font-bold text-dark">
            BeautyLink
          </Link>
          <div className="flex-1" />
          <Button variant="primary" size="sm" asChild>
            <Link href="/browse">Browse Deals</Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/browse"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to listings
        </Link>

        {/* Profile Header */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar size="xl">
              {user.profilePhotoUrl ? (
                <AvatarImage src={user.profilePhotoUrl} alt={proName} />
              ) : null}
              <AvatarFallback className="text-2xl">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-dark">{proName}</h1>

              {profile.city && profile.state && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {profile.city}, {profile.state}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <RatingDisplay
                  rating={profile.avgRating}
                  reviewCount={profile.totalReviews}
                />
                <VerificationBadges
                  isVerified={true}
                  isTopRated={profile.isFeatured}
                  licenseVerified={profile.licenseStatus === "LICENSE_VERIFIED"}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
                {yearsLabel && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                    {yearsLabel}
                  </span>
                )}
                {workSettingLabel && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {workSettingLabel}
                  </span>
                )}
                {profile.totalBookings > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4" aria-hidden="true" />
                    {profile.totalBookings} booking
                    {profile.totalBookings !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <MessageButton
                  recipientId={user.id}
                  recipientName={proName}
                  variant="primary"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6 rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-dark">About</h2>
            <p className="whitespace-pre-line text-body leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Specialties */}
        {profile.specialties.length > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-dark">
              Specialties
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((s) => (
                <Badge key={s} variant="default" size="sm">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {images.length > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-dark">Portfolio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={src}
                    alt={`${proName} portfolio ${idx + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram */}
        {profile.instagramHandle && (
          <div className="mt-6 rounded-xl border border-border bg-white p-6 shadow-sm">
            <a
              href={
                profile.instagramHandle.startsWith("http")
                  ? profile.instagramHandle
                  : `https://instagram.com/${profile.instagramHandle.replace("@", "")}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Instagram: {profile.instagramHandle}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}

        <Separator className="my-8" />

        {/* Available Listings */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-dark">
            Available Appointments
          </h2>

          {profile.appointments.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
              <Calendar
                className="mx-auto h-8 w-8 text-muted/50"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm text-muted">
                No open appointments right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.appointments.map((listing) => {
                const savings = calcSavingsPercent(
                  listing.originalPrice,
                  listing.discountedPrice
                );
                const spotsLeft = listing.maxClients - listing.bookedCount;

                return (
                  <Link
                    key={listing.id}
                    href={`/appointment/${listing.id}`}
                    className="block rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:shadow-card hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-dark">
                            {listing.serviceName}
                          </p>
                          {savings > 0 && (
                            <Badge variant="success" size="sm">
                              {savings}% off
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted">
                          {new Date(listing.appointmentDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          at {formatTime(listing.appointmentTime)}
                        </p>
                        <p className="text-xs text-muted">
                          {spotsLeft > 0
                            ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`
                            : "Fully booked"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-accent">
                          {formatPrice(listing.discountedPrice)}
                        </p>
                        <p className="text-xs text-muted line-through">
                          {formatPrice(listing.originalPrice)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
