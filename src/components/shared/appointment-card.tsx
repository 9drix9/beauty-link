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
  launchZone,
  listingPhotoUrl,
  maxClients,
  bookedCount,
  professional,
}: AppointmentCardProps) {
  const savingsPercent = calcSavingsPercent(originalPrice, discountedPrice);
  const spotsLeft = maxClients - bookedCount;

  // Appointment datetime for urgency
  const [hours, minutes] = appointmentTime.split(":");
  const apptDateTime = new Date(appointmentDate);
  apptDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  const timeUntil = getTimeUntil(apptDateTime);

  const diffMs = apptDateTime.getTime() - Date.now();
  const diffHours = diffMs / (1000 * 60 * 60);
  const isUrgent = diffHours > 0 && diffHours < 6;
  const isToday = diffHours > 0 && diffHours < 24;

  // Professional display name
  const proName =
    professional.displayName ||
    `${professional.user.firstName} ${professional.user.lastName.charAt(0)}.`;

  // Image source — listing photo, then portfolio, then gradient fallback
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

  const location = launchZone || "Los Angeles";

  return (
    <Link href={`/appointment/${id}`} className="block group">
      <div className="relative rounded-2xl bg-white border border-border/60 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={serviceName}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-light via-background to-accent-light/60 flex items-center justify-center">
              <span className="font-serif text-5xl font-bold text-accent/20 italic">
                {serviceCategory.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Subtle gradient overlay at bottom for text contrast */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

          {/* Savings badge — refined pill */}
          {savingsPercent > 0 && (
            <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-dark shadow-sm">
              Save {savingsPercent}%
            </span>
          )}

          {/* Urgency — subtle, bottom-left over gradient */}
          {isUrgent && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {timeUntil}
            </span>
          )}
          {!isUrgent && isToday && (
            <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white">
              Today
            </span>
          )}

          {/* Scarcity — bottom-right, only when low */}
          {spotsLeft > 0 && spotsLeft <= 2 && (
            <span className="absolute bottom-3 right-3 text-[11px] font-semibold text-white">
              {spotsLeft === 1 ? "Last spot" : `${spotsLeft} spots left`}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pt-3.5 pb-4">
          {/* Service name */}
          <h3 className="font-semibold text-dark text-[15px] leading-snug line-clamp-1">
            {serviceName}
          </h3>

          {/* Provider row */}
          <div className="mt-2 flex items-center gap-2">
            {professional.user.profilePhotoUrl ? (
              <Image
                src={professional.user.profilePhotoUrl}
                alt=""
                width={22}
                height={22}
                className="rounded-full object-cover shrink-0"
              />
            ) : (
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-accent-light text-[9px] font-semibold text-accent shrink-0">
                {professional.user.firstName.charAt(0)}
              </span>
            )}
            <span className="text-[13px] text-muted truncate">{proName}</span>
            {professional.totalReviews > 0 && (
              <span className="flex items-center gap-0.5 text-[13px] text-muted shrink-0 ml-auto">
                <Star className="h-3 w-3 fill-cta text-cta" aria-hidden="true" />
                {professional.avgRating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="mt-3 mb-3 border-t border-border/50" />

          {/* Bottom row: date/time/location + price */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] text-body font-medium">
                {formattedDate} · {formattedTime}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{location}</span>
                <span className="mx-0.5">·</span>
                <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                {formatDuration(durationMinutes)}
              </p>
            </div>

            {/* Price cluster — right-aligned */}
            <div className="text-right shrink-0">
              {originalPrice > discountedPrice && (
                <p className="text-[11px] text-muted line-through leading-none">
                  {formatPrice(originalPrice)}
                </p>
              )}
              <p className="text-lg font-bold text-dark leading-tight">
                {formatPrice(discountedPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
