"use client";

import { useEffect, useState } from "react";
import { AppointmentCard, type AppointmentCardProps } from "@/components/shared/appointment-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";

export function LiveFeedPreview() {
  const [listings, setListings] = useState<AppointmentCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch("/api/appointments?sort=soonest&limit=6");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setListings((data.listings || data || []).slice(0, 6));
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
        <p className="text-lg font-semibold text-dark">Deals dropping soon</p>
        <p className="mt-1 text-sm text-muted">
          New discounted appointments are added daily. Check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((listing) => (
        <AppointmentCard key={listing.id} {...listing} />
      ))}
    </div>
  );
}
