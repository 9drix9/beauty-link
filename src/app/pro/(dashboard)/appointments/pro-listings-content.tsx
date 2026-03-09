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

export function ProListingsContent({ listings }: ProListingsContentProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const activeListings = listings.filter((l) =>
    ACTIVE_STATUSES.includes(l.status)
  );
  const completedListings = listings.filter((l) =>
    COMPLETED_STATUSES.includes(l.status)
  );

  async function handleStatusChange(
    listingId: string,
    newStatus: string
  ) {
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

    return (
      <Card key={listing.id} className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Left side */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-dark">
                  {listing.serviceName}
                </h3>
                <Badge variant="default" size="sm">
                  {getCategoryLabel(listing.serviceCategory)}
                </Badge>
                {getStatusBadge(listing.status)}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {format(new Date(listing.appointmentDate), "MMM d, yyyy")} at{" "}
                {listing.appointmentTime}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted line-through">
                  {formatPrice(listing.originalPrice)}
                </span>
                <span className="font-semibold text-green-700">
                  {formatPrice(listing.discountedPrice)}
                </span>
                <Badge variant="success" size="sm">
                  {savings}% off
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  {listing.viewCount} views
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  {listing.bookedCount}/{listing.maxClients} booked
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
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
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleStatusChange(listing.id, "LIVE")}
                >
                  <Play className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Unpause
                </Button>
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
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderEmptyState(type: "active" | "completed") {
    return (
      <div className="py-12 text-center">
        <Calendar className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
        <p className="mt-3 text-sm text-muted">
          {type === "active"
            ? "No active listings. Create one to start attracting clients!"
            : "No completed listings yet."}
        </p>
        {type === "active" && (
          <Button variant="cta" size="sm" className="mt-4" asChild>
            <Link href="/pro/appointments/new">
              <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
              Create Listing
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">My Listings</h1>
        <Button variant="cta" asChild>
          <Link href="/pro/appointments/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Create New Listing
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeListings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedListings.length})
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
    </div>
  );
}
