"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchValue), 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Active filter state
  const [activeCategory, setActiveCategory] = useState(searchParams.category || "");
  const [activeSort, setActiveSort] = useState(searchParams.sort || "recommended");
  const [activeDate, setActiveDate] = useState(searchParams.date || "any");
  const [activeZone, setActiveZone] = useState(searchParams.zone || "");

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (activeSort && activeSort !== "recommended") params.set("sort", activeSort);
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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchListings();
  }

  function clearFilters() {
    setActiveCategory("");
    setActiveSort("recommended");
    setActiveDate("any");
    setActiveZone("");
    setSearchValue("");
  }

  const hasActiveFilters =
    activeCategory || activeSort !== "recommended" || activeDate !== "any" || activeZone || debouncedSearch;

  const activeFilterCount = [
    activeCategory,
    activeSort !== "recommended" ? activeSort : "",
    activeDate !== "any" ? activeDate : "",
    activeZone,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky search + filter bar — offset by nav height (57px) */}
      <div className="sticky top-[57px] z-30 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Search row */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search services, professionals..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(
                "relative flex items-center gap-1.5 h-11 px-4 rounded-lg border text-sm font-medium transition-colors",
                filtersOpen
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-body border-border hover:bg-gray-50"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && !filtersOpen && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cta text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </form>

          {/* Category pills — always visible, horizontal scroll */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
            <button
              onClick={() => setActiveCategory("")}
              aria-pressed={!activeCategory}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !activeCategory
                  ? "bg-dark text-white"
                  : "bg-gray-100 text-body hover:bg-gray-200"
              )}
            >
              All
            </button>
            {SERVICE_CATEGORIES.filter(c => c.value !== "OTHER").map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(activeCategory === cat.value ? "" : cat.value)}
                aria-pressed={activeCategory === cat.value}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  activeCategory === cat.value
                    ? "bg-dark text-white"
                    : "bg-gray-100 text-body hover:bg-gray-200"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded filter panel */}
        {filtersOpen && (
          <div className="border-t border-border bg-white animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-6">
                {/* Date filter */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">When</p>
                  <div className="flex gap-1.5">
                    {DATE_FILTERS.map((df) => (
                      <button
                        key={df.value}
                        onClick={() => setActiveDate(df.value)}
                        aria-pressed={activeDate === df.value}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                          activeDate === df.value
                            ? "bg-accent text-white"
                            : "bg-gray-100 text-body hover:bg-gray-200"
                        )}
                      >
                        {df.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Sort by</p>
                  <div className="relative">
                    <select
                      value={activeSort}
                      onChange={(e) => setActiveSort(e.target.value)}
                      className="appearance-none h-9 rounded-lg border border-border bg-white pl-3 pr-8 text-sm text-body focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* Zone */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Area</p>
                  <div className="relative">
                    <select
                      value={activeZone}
                      onChange={(e) => setActiveZone(e.target.value)}
                      className="appearance-none h-9 rounded-lg border border-border bg-white pl-3 pr-8 text-sm text-body focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                    >
                      <option value="">All areas</option>
                      {LAUNCH_ZONES.map((zone) => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results header */}
        {!loading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted">
              <span className="font-semibold text-dark">{listings.length}</span>{" "}
              {listings.length === 1 ? "deal" : "deals"} available
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-accent hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing) => (
              <AppointmentCard key={listing.id} {...listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No deals found"
            description="Try adjusting your filters or check back later — new appointments are added daily."
            action={{
              label: "Clear filters",
              href: "/browse",
            }}
          />
        )}
      </div>
    </div>
  );
}
