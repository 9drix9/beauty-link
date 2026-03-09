"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Calendar, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  calcSavingsPercent,
  formatDuration,
  cn,
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

  // Determine urgency
  const apptDate = new Date(appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const apptDay = new Date(apptDate);
  apptDay.setHours(0, 0, 0, 0);

  const isToday = apptDay.getTime() === today.getTime();
  const isTomorrow = apptDay.getTime() === tomorrow.getTime();

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

  // Format date for display
  const formattedDate = apptDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Format time
  const [hours, minutes] = appointmentTime.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  const formattedTime = `${displayHour}:${minutes} ${ampm}`;

  return (
    <Link href={`/appointment/${id}`} className="block group">
      <Card
        variant="default"
        className="overflow-hidden transition-all duration-200 group-hover:shadow-cardHover group-hover:-translate-y-0.5"
      >
        {/* Image Area */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={serviceName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-primary/20 to-orange-primary/20 flex items-center justify-center">
              <span className="text-3xl text-purple-primary/40 font-semibold">
                {serviceCategory.charAt(0)}
              </span>
            </div>
          )}

          {/* Savings Badge - top right */}
          {savingsPercent > 0 && (
            <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 shadow-sm">
              Save {savingsPercent}%
            </span>
          )}

          {/* Urgency Badge - top left */}
          {isToday && (
            <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 animate-pulse shadow-sm">
              Today
            </span>
          )}
          {isTomorrow && !isToday && (
            <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700 shadow-sm">
              Tomorrow
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Service name */}
          <h3 className="font-semibold text-dark line-clamp-1">{serviceName}</h3>

          {/* Professional name */}
          <p className="text-sm text-muted truncate">{proName}</p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.round(professional.avgRating)
                      ? "fill-orange-primary text-orange-primary"
                      : "fill-none text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted">
              ({professional.totalReviews})
            </span>
          </div>

          {/* Duration + Location */}
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDuration(durationMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="line-clamp-1">
                {launchZone || locationAddress || "Los Angeles"}
              </span>
            </span>
          </div>

          {/* Date + Time */}
          <div className="flex items-center gap-1 text-sm text-muted">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {formattedDate} at {formattedTime}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm text-muted line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-lg font-bold text-purple-primary">
              {formatPrice(discountedPrice)}
            </span>
          </div>

          {/* Spots indicator */}
          {spotsLeft === 0 && (
            <Badge variant="error" size="sm">
              Fully Booked
            </Badge>
          )}
          {spotsLeft > 0 && spotsLeft <= 2 && (
            <p className="text-xs font-medium text-orange-primary">
              Only {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
