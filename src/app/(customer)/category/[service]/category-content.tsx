"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import {
  AppointmentCard,
  type AppointmentCardProps,
} from "@/components/shared/appointment-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { EmptyState } from "@/components/shared/empty-state";

interface CategoryContentProps {
  category: string;
  categoryLabel: string;
}

export function CategoryContent({
  category,
  categoryLabel,
}: CategoryContentProps) {
  const [listings, setListings] = useState<AppointmentCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/appointments?category=${encodeURIComponent(category)}&sort=soonest`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setListings(data.listings || data || []);
      } catch {
        // API may not exist yet -- show empty state gracefully
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [category]);

  if (loading) {
    return (
      <>
        <p className="text-sm text-muted">Loading appointments...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title={`No ${categoryLabel.toLowerCase()} appointments available`}
        description="Check back soon or browse other categories for great deals."
        action={{
          label: "Browse All",
          href: "/browse",
        }}
      />
    );
  }

  return (
    <>
      <p className="text-sm text-muted">
        {listings.length} appointment{listings.length !== 1 ? "s" : ""}{" "}
        available
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <AppointmentCard key={listing.id} {...listing} />
        ))}
      </div>
    </>
  );
}
