import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Users,
  Award,
  Briefcase,
  ChevronLeft,
} from "lucide-react";
import { ListingGallery } from "@/components/shared/listing-gallery";

import { db } from "@/lib/db";
import {
  formatPrice,
  formatDuration,
  calcPlatformFee,
  calcTotalCharged,
  calcSavingsPercent,
  getInitials,
} from "@/lib/utils";
import { WORK_SETTINGS, YEARS_EXPERIENCE_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RatingDisplay } from "@/components/shared/rating-display";
import { VerificationBadges } from "@/components/shared/verification-badges";
import { MessageButton } from "@/components/shared/message-button";

interface AppointmentPageProps {
  params: { id: string };
}

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

async function getListing(id: string) {
  const listing = await db.appointmentListing.findUnique({
    where: { id },
    include: {
      professional: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePhotoUrl: true,
            },
          },
        },
      },
      service: true,
    },
  });

  return listing;
}

export async function generateMetadata({
  params,
}: AppointmentPageProps): Promise<Metadata> {
  const listing = await getListing(params.id);

  if (!listing) {
    return { title: "Appointment Not Found | BeautyLink" };
  }

  const proName =
    listing.professional.displayName ||
    `${listing.professional.user.firstName} ${listing.professional.user.lastName}`;

  return {
    title: `${listing.serviceName} | ${proName}`,
    description: listing.description || undefined,
  };
}

export default async function AppointmentDetailPage({
  params,
}: AppointmentPageProps) {
  const listing = await getListing(params.id);

  if (!listing || listing.status !== "LIVE") {
    notFound();
  }

  // Fire-and-forget view count increment
  db.appointmentListing
    .update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  const professional = listing.professional;
  const user = professional.user;
  const proName =
    professional.displayName || `${user.firstName} ${user.lastName}`;

  const spotsAvailable = listing.maxClients - listing.bookedCount;
  const isFullyBooked = spotsAvailable <= 0;
  const savingsPercent = calcSavingsPercent(
    listing.originalPrice,
    listing.discountedPrice
  );
  const platformFee = calcPlatformFee(listing.discountedPrice);
  const totalCharged = calcTotalCharged(listing.discountedPrice);

  // Gather images for the gallery
  const images: string[] = [];
  if (listing.listingPhotoUrl) images.push(listing.listingPhotoUrl);
  if (professional.portfolioPhotos?.length) {
    for (const photo of professional.portfolioPhotos) {
      if (!images.includes(photo)) images.push(photo);
    }
  }

  const workSettingLabel = professional.workSetting
    ? WORK_SETTINGS.find((ws) => ws.value === professional.workSetting)?.label
    : null;
  const yearsLabel = professional.yearsExperience
    ? YEARS_EXPERIENCE_OPTIONS.find(
        (ye) => ye.value === professional.yearsExperience
      )?.label
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/browse"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <ListingGallery
            images={images}
            serviceName={listing.serviceName}
            savingsPercent={savingsPercent}
          />

          {/* Service Name */}
          <h1 className="text-h2 font-bold text-dark">{listing.serviceName}</h1>

          {/* Professional Info Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/pro/${professional.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar size="lg">
                {user.profilePhotoUrl ? (
                  <AvatarImage src={user.profilePhotoUrl} alt={proName} />
                ) : null}
                <AvatarFallback>
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-dark truncate">{proName}</p>
                {professional.city && professional.state && (
                  <p className="text-sm text-muted">
                    {professional.city}, {professional.state}
                  </p>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <RatingDisplay
                rating={professional.avgRating}
                reviewCount={professional.totalReviews}
              />
              <VerificationBadges
                isVerified={
                  professional.applicationStatus === "APPROVED"
                }
                isTopRated={professional.isFeatured}
                licenseVerified={professional.licenseStatus === "LICENSE_VERIFIED"}
              />
            </div>
            <MessageButton
              recipientId={user.id}
              recipientName={proName}
              variant="outline"
              size="sm"
            />
          </div>

          <Separator />

          {/* Description */}
          {listing.description && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-dark">
                About This Appointment
              </h2>
              <p className="whitespace-pre-line text-body leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* What's Included */}
          {listing.whatsIncluded.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-dark">
                What&apos;s Included
              </h2>
              <ul className="space-y-2">
                {listing.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" aria-hidden="true" />
                    <span className="text-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* About Professional */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-dark">
              About {proName}
            </h2>

            {professional.bio && (
              <p className="mb-4 whitespace-pre-line text-body leading-relaxed">
                {professional.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted">
              {yearsLabel && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" aria-hidden="true" />
                  <span>{yearsLabel}</span>
                </div>
              )}
              {workSettingLabel && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>{workSettingLabel}</span>
                </div>
              )}
              {professional.totalBookings > 0 && (
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {professional.totalBookings} booking
                    {professional.totalBookings !== 1 ? "s" : ""} completed
                  </span>
                </div>
              )}
            </div>

            {professional.specialties.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {professional.specialties.map((specialty) => (
                  <Badge key={specialty} variant="default" size="sm">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card variant="elevated" className="sticky top-24">
            <CardContent className="p-6 space-y-5">
              {/* Price Display */}
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-bold text-accent">
                    {formatPrice(listing.discountedPrice)}
                  </span>
                  <span className="text-lg text-muted line-through">
                    {formatPrice(listing.originalPrice)}
                  </span>
                </div>
                {savingsPercent > 0 && (
                  <Badge variant="success" size="sm" className="mt-1">
                    Save {savingsPercent}%
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Appointment Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted" aria-hidden="true" />
                  <span>
                    {format(new Date(listing.appointmentDate), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted" aria-hidden="true" />
                  <span>
                    {formatTime(listing.appointmentTime)} &middot;{" "}
                    {formatDuration(listing.durationMinutes)}
                  </span>
                </div>
                {listing.locationAddress && (
                  <div className="flex items-start gap-3 text-sm min-w-0">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted" aria-hidden="true" />
                    <div>
                      <span className="break-words">
                        {listing.professional.neighborhood ||
                          listing.professional.city
                            ? `${listing.professional.neighborhood || listing.professional.city}${listing.professional.state ? `, ${listing.professional.state}` : ""}`
                            : listing.launchZone || "Los Angeles Area"}
                      </span>
                      <p className="text-xs text-muted mt-0.5">
                        Exact address provided after booking
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Service</span>
                  <span>{formatPrice(listing.discountedPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">
                    + Service fee
                  </span>
                  <span>{formatPrice(platformFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(totalCharged)}</span>
                </div>
              </div>

              {/* Spots Indicator */}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted" aria-hidden="true" />
                {isFullyBooked ? (
                  <span className="font-medium text-error">Fully Booked</span>
                ) : (
                  <span>
                    <span className="font-medium">{spotsAvailable}</span> of{" "}
                    {listing.maxClients} spot
                    {listing.maxClients !== 1 ? "s" : ""} available
                  </span>
                )}
              </div>

              {/* CTA Button */}
              {isFullyBooked ? (
                <Button variant="secondary" size="lg" className="w-full" asChild>
                  <Link href={`/appointment/${listing.id}/waitlist`}>
                    Join Waitlist
                  </Link>
                </Button>
              ) : (
                <Button variant="cta" size="lg" className="w-full" asChild>
                  <Link href={`/checkout/${listing.id}`}>Book Now</Link>
                </Button>
              )}

              <p className="text-center text-xs text-muted">
                Free cancellation up to 24 hours before appointment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
