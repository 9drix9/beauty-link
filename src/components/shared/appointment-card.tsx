"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Star } from "lucide-react";
import {
  formatPrice,
  calcSavingsPercent,
  formatDuration,
  getTimeUntil,
} from "@/lib/utils";

export interface AppointmentCardProps {
  id: string;
  serviceName: string;
  serviceCategory: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  originalPrice: number;
  discountedPrice: number;
  locationAddress?: string;
  launchZone?: string;
  listingPhotoUrl?: string | null;
  maxClients: number;
  bookedCount: number;
  professional: {
    displayName?: string | null;
    avgRating: number;
    totalReviews: number;
    portfolioPhotos: string[];
    user: {
      firstName: string;
      lastName: string;
      profilePhotoUrl?: string | null;
    };
  };
}

export function AppointmentCard({
  id,
  serviceName,
  serviceCategory,
  appointmentDate,
  appointmentTime,
  durationMinutes,
  originalPrice,
  discountedPrice,
  locationAddress,
  launchZone,
  listingPhotoUrl,
  maxClients,
  bookedCount,
  professional,
}: AppointmentCardProps) {
  const savingsPercent = calcSavingsPercent(originalPrice, discountedPrice);
  const spotsLeft = maxClients - bookedCount;

  // Build appointment datetime for urgency
  const [hours, minutes] = appointmentTime.split(":");
  const apptDateTime = new Date(appointmentDate);
  apptDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  const timeUntil = getTimeUntil(apptDateTime);

  // Urgency level
  const diffMs = apptDateTime.getTime() - Date.now();
  const diffHours = diffMs / (1000 * 60 * 60);
  const isUrgent = diffHours > 0 && diffHours < 6;
  const isToday = diffHours > 0 && diffHours < 24;

  // Professional display name
  const proName =
    professional.displayName ||
    `${professional.user.firstName} ${professional.user.lastName.charAt(0)}.`;

  // Image source
  const imageSrc =
    listingPhotoUrl ||
    (professional.portfolioPhotos.length > 0
      ? professional.portfolioPhotos[0]
      : null);

  // Format time
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  const formattedTime = `${displayHour}:${minutes} ${ampm}`;

  // Format date
  const formattedDate = new Date(appointmentDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/appointment/${id}`} className="block group">
      <div className="relative rounded-xl bg-white border border-border overflow-hidden transition-all duration-200 group-hover:shadow-cardHover group-hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-background">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={serviceName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-background to-border flex items-center justify-center">
              <span className="text-4xl font-bold text-accent/30">
                {serviceCategory.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Savings pill — top-left, high contrast */}
          {savingsPercent > 0 && (
            <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-cta px-2.5 py-1 text-xs font-bold text-white shadow-md">
              {savingsPercent}% OFF
            </span>
          )}

          {/* Urgency pill — top-right */}
          {isUrgent && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-dark/80 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error/75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error" />
              </span>
              {timeUntil}
            </span>
          )}
          {!isUrgent && isToday && (
            <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-dark/80 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-md">
              Today
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Row 1: Service + Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-dark leading-tight line-clamp-1 flex-1 min-w-0">
              {serviceName}
            </h3>
            <div className="flex items-baseline gap-1.5 shrink-0">
              <span className="text-sm text-muted line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-lg font-bold text-dark">
                {formatPrice(discountedPrice)}
              </span>
            </div>
          </div>

          {/* Row 2: Pro name + rating */}
          <div className="mt-1.5 flex items-center gap-2 min-w-0">
            {/* Pro avatar */}
            {professional.user.profilePhotoUrl ? (
              <Image
                src={professional.user.profilePhotoUrl}
                alt=""
                width={20}
                height={20}
                className="rounded-full object-cover shrink-0"
              />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-light text-[10px] font-semibold text-accent shrink-0">
                {professional.user.firstName.charAt(0)}
              </span>
            )}
            <span className="text-sm text-body truncate">{proName}</span>
            {professional.totalReviews > 0 && (
              <span className="flex items-center gap-0.5 text-sm text-body shrink-0">
                <Star className="h-3.5 w-3.5 fill-cta text-cta" aria-hidden="true" />
                {professional.avgRating.toFixed(1)}
                <span className="text-muted">({professional.totalReviews})</span>
              </span>
            )}
          </div>

          {/* Row 3: Meta — date, time, duration, location */}
          <div className="mt-3 flex items-center gap-3 text-caption text-muted">
            <span>{formattedDate} &middot; {formattedTime}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatDuration(durationMinutes)}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-caption text-muted">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{launchZone || locationAddress || "Los Angeles"}</span>
          </div>

          {/* Row 4: Scarcity signal */}
          {spotsLeft === 0 && (
            <p className="mt-3 text-xs font-semibold text-error">Fully booked</p>
          )}
          {spotsLeft > 0 && spotsLeft <= 2 && (
            <p className="mt-3 text-xs font-semibold text-cta">
              Only {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
