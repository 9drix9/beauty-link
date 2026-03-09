"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AppointmentCard,
  type AppointmentCardProps,
} from "@/components/shared/appointment-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  SERVICE_CATEGORIES,
  SORT_OPTIONS,
  DATE_FILTERS,
  LAUNCH_ZONES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrowseContentProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    date?: string;
    zone?: string;
  };
}

export function BrowseContent({ searchParams }: BrowseContentProps) {
  const router = useRouter();

  const [listings, setListings] = useState<AppointmentCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  // Debounce search input – only propagate after 300ms of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Active filter state
  const [activeCategory, setActiveCategory] = useState(
    searchParams.category || ""
  );
  const [activeSort, setActiveSort] = useState(
    searchParams.sort || "recommended"
  );
  const [activeDate, setActiveDate] = useState(searchParams.date || "any");
  const [activeZone, setActiveZone] = useState(searchParams.zone || "");

  // Build query string and update URL
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (activeSort && activeSort !== "recommended")
      params.set("sort", activeSort);
    if (activeDate && activeDate !== "any") params.set("date", activeDate);
    if (activeZone) params.set("zone", activeZone);
    return params.toString();
  }, [activeCategory, debouncedSearch, activeSort, activeDate, activeZone]);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQueryString();
      const res = await fetch(`/api/appointments${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setListings(data.listings || data || []);
    } catch {
      // API may not exist yet -- show empty state gracefully
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Update URL when filters change
  useEffect(() => {
    const qs = buildQueryString();
    const newUrl = `/browse${qs ? `?${qs}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [activeCategory, activeSort, activeDate, activeZone, buildQueryString, router]);

  // Handle search submit
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchListings();
  }

  // Clear all filters
  function clearFilters() {
    setActiveCategory("");
    setActiveSort("recommended");
    setActiveDate("any");
    setActiveZone("");
    setSearchValue("");
  }

  const hasActiveFilters =
    activeCategory || activeSort !== "recommended" || activeDate !== "any" || activeZone || debouncedSearch;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-h2 text-dark">Browse Appointments</h1>
          <p className="text-muted mt-1">
            Discover discounted beauty services from top professionals
          </p>
        </div>

        {/* Search Bar + Filter Toggle */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search services, professionals..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              startIcon={<Search className="h-4 w-4" aria-hidden="true" />}
              inputSize="lg"
            />
          </div>
          <Button
            type="button"
            variant={filtersOpen ? "primary" : "outline"}
            size="lg"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Filters</span>
          </Button>
        </form>

        {/* Collapsible Filter Bar */}
        {filtersOpen && (
          <div className="space-y-4 p-4 bg-white rounded-lg border border-border animate-fade-in">
            {/* Category Pills */}
            <div>
              <p className="text-sm font-medium text-body mb-2">Category</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveCategory("")}
                  aria-pressed={!activeCategory}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    !activeCategory
                      ? "bg-purple-primary text-white"
                      : "bg-gray-100 text-body hover:bg-gray-200"
                  )}
                >
                  All
                </button>
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === cat.value ? "" : cat.value
                      )
                    }
                    aria-pressed={activeCategory === cat.value}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      activeCategory === cat.value
                        ? "bg-purple-primary text-white"
                        : "bg-gray-100 text-body hover:bg-gray-200"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort + Date + Zone Row */}
            <div className="flex flex-wrap gap-4">
              {/* Sort */}
              <div>
                <p className="text-sm font-medium text-body mb-2">Sort By</p>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="h-10 rounded-md border border-border bg-white px-3 text-sm text-body focus:outline-none focus:ring-2 focus:ring-purple-primary"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <p className="text-sm font-medium text-body mb-2">Date</p>
                <div className="flex gap-2">
                  {DATE_FILTERS.map((df) => (
                    <button
                      key={df.value}
                      onClick={() => setActiveDate(df.value)}
                      aria-pressed={activeDate === df.value}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                        activeDate === df.value
                          ? "bg-purple-primary text-white"
                          : "bg-gray-100 text-body hover:bg-gray-200"
                      )}
                    >
                      {df.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone Filter */}
              <div>
                <p className="text-sm font-medium text-body mb-2">Zone</p>
                <select
                  value={activeZone}
                  onChange={(e) => setActiveZone(e.target.value)}
                  className="h-10 rounded-md border border-border bg-white px-3 text-sm text-body focus:outline-none focus:ring-2 focus:ring-purple-primary"
                >
                  <option value="">All Zones</option>
                  {LAUNCH_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-purple-primary hover:underline"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <p className="text-sm text-muted">
            {listings.length} appointment{listings.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <AppointmentCard key={listing.id} {...listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No appointments found"
            description="Try adjusting your filters or search terms to find available appointments."
            action={{
              label: "Browse All",
              href: "/browse",
            }}
          />
        )}
      </div>
    </div>
  );
}
