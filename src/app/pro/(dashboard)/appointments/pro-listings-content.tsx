"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Plus,
  Eye,
  Users,
  Pencil,
  Pause,
  Play,
  XCircle,
  Calendar,
  Clock,
  BarChart3,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatPrice, calcSavingsPercent } from "@/lib/utils";

interface SerializedListing {
  id: string;
  professionalId: string;
  serviceId: string | null;
  serviceCategory: string;
  serviceName: string;
  description: string | null;
  whatsIncluded: string[];
  appointmentDate: string;
  appointmentTime: string;
  timezone: string;
  durationMinutes: number;
  originalPrice: number;
  discountedPrice: number;
  listingPhotoUrl: string | null;
  maxClients: number;
  bookedCount: number;
  viewCount: number;
  locationAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  launchZone: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProListingsContentProps {
  listings: SerializedListing[];
}

const ACTIVE_STATUSES = ["LIVE", "DRAFT", "PAUSED"];
const COMPLETED_STATUSES = ["BOOKED", "EXPIRED", "CANCELLED"];

function getStatusBadge(status: string) {
  switch (status) {
    case "LIVE":
      return <Badge variant="success">Live</Badge>;
    case "DRAFT":
      return <Badge variant="warning">Draft</Badge>;
    case "PAUSED":
      return <Badge variant="warning">Paused</Badge>;
    case "BOOKED":
      return <Badge variant="outline">Booked</Badge>;
    case "EXPIRED":
      return <Badge variant="outline">Expired</Badge>;
    case "CANCELLED":
      return <Badge variant="error">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getCategoryLabel(value: string) {
  const labels: Record<string, string> = {
    HAIR: "Hair",
    NAILS: "Nails",
    MAKEUP: "Makeup",
    LASHES: "Lashes",
    BROWS: "Brows",
    SKINCARE: "Skincare",
    HAIR_REMOVAL: "Hair Removal",
    MASSAGE: "Massage",
    SPRAY_TAN: "Spray Tan",
    OTHER: "Other",
  };
  return labels[value] || value;
}

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function ProListingsContent({ listings }: ProListingsContentProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const activeListings = listings.filter((l) =>
    ACTIVE_STATUSES.includes(l.status)
  );
  const completedListings = listings.filter((l) =>
    COMPLETED_STATUSES.includes(l.status)
  );

  async function handleStatusChange(listingId: string, newStatus: string) {
    setLoadingId(listingId);
    try {
      const res = await fetch(`/api/providers/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoadingId(null);
    }
  }

  function renderListingCard(listing: SerializedListing) {
    const savings = calcSavingsPercent(
      listing.originalPrice,
      listing.discountedPrice
    );
    const isLoading = loadingId === listing.id;
    const conversionRate =
      listing.viewCount > 0
        ? ((listing.bookedCount / listing.viewCount) * 100).toFixed(1)
        : "0";
    const spotsLeft = listing.maxClients - listing.bookedCount;

    return (
      <Card key={listing.id} variant="elevated" className={`overflow-hidden border-l-[3px] ${
        listing.status === "LIVE" ? "border-l-green-500" :
        listing.status === "DRAFT" || listing.status === "PAUSED" ? "border-l-yellow-400" :
        listing.status === "CANCELLED" ? "border-l-red-400" :
        "border-l-gray-300"
      }`}>
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Header: Service name + badges */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h3 className="font-semibold text-dark">
                {listing.serviceName}
              </h3>
              {getStatusBadge(listing.status)}
              {savings > 0 && (
                <Badge variant="success" size="sm">
                  {savings}% off
                </Badge>
              )}
            </div>
            <Badge variant="default" size="sm" className="self-start sm:self-auto shrink-0">
              {getCategoryLabel(listing.serviceCategory)}
            </Badge>
          </div>

          {/* Detail Row: date/time + price */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
            <div className="flex items-center gap-4 text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {format(new Date(listing.appointmentDate), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {formatTime(listing.appointmentTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted line-through text-xs">
                {formatPrice(listing.originalPrice)}
              </span>
              <span className="font-semibold text-dark">
                {formatPrice(listing.discountedPrice)}
              </span>
            </div>
          </div>

          {/* Availability Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted mb-1.5">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                {listing.bookedCount}/{listing.maxClients} booked
              </span>
              <span>
                {spotsLeft > 0
                  ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`
                  : "Full"}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-background overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  spotsLeft === 0
                    ? "bg-success"
                    : listing.bookedCount > 0
                      ? "bg-accent"
                      : "bg-border"
                }`}
                style={{
                  width: `${
                    listing.maxClients > 0
                      ? (listing.bookedCount / listing.maxClients) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              {listing.viewCount} views
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              {listing.bookedCount} bookings
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
              {conversionRate}% conversion
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
            {(listing.status === "DRAFT" || listing.status === "LIVE") && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/pro/appointments/${listing.id}/edit`}>
                  <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </Link>
              </Button>
            )}
            {listing.status === "LIVE" && (
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => handleStatusChange(listing.id, "PAUSED")}
              >
                <Pause className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Pause
              </Button>
            )}
            {listing.status === "PAUSED" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleStatusChange(listing.id, "LIVE")}
                >
                  <Play className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Unpause
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/pro/appointments/${listing.id}/edit`}>
                    <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </Link>
                </Button>
              </>
            )}
            {listing.status === "DRAFT" && (
              <Button
                variant="cta"
                size="sm"
                disabled={isLoading}
                onClick={() => handleStatusChange(listing.id, "LIVE")}
              >
                <Play className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Publish
              </Button>
            )}
            {!["CANCELLED", "EXPIRED"].includes(listing.status) && (
              <Button
                variant="destructive"
                size="sm"
                disabled={isLoading}
                onClick={() => handleStatusChange(listing.id, "CANCELLED")}
              >
                <XCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderEmptyState(type: "active" | "completed") {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background">
          <Calendar className="h-7 w-7 text-muted" aria-hidden="true" />
        </div>
        <h3 className="font-semibold text-dark">
          {type === "active" ? "No active listings" : "No completed listings"}
        </h3>
        <p className="mt-1 text-sm text-muted max-w-xs mx-auto">
          {type === "active"
            ? "Post your first deal to start attracting new clients."
            : "Completed, expired, and cancelled listings will appear here."}
        </p>
        {type === "active" && (
          <Button variant="cta" size="sm" className="mt-4" asChild>
            <Link href="/pro/appointments/new">
              <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
              Post New Deal
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">My Listings</h1>
        <Button variant="cta" asChild>
          <Link href="/pro/appointments/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Post New Deal
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeListings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Past ({completedListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-4">
          {activeListings.length === 0
            ? renderEmptyState("active")
            : activeListings.map(renderListingCard)}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {completedListings.length === 0
            ? renderEmptyState("completed")
            : completedListings.map(renderListingCard)}
        </TabsContent>
      </Tabs>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-20 right-4 sm:hidden z-40">
        <Button
          variant="cta"
          size="lg"
          className="rounded-full shadow-elevated h-14 w-14 p-0"
          asChild
        >
          <Link href="/pro/appointments/new">
            <Plus className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Post New Deal</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
