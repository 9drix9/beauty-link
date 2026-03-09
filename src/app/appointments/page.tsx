"use client";

import { useState } from "react";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { CategoryFilter } from "@/components/appointments/category-filter";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

const DEMO_APPOINTMENTS = [
  {
    id: "1",
    serviceName: "Balayage Highlights",
    providerName: "Sarah M.",
    category: "HAIR",
    originalPrice: 18000,
    discountedPrice: 12600,
    startAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    launchZone: "UCLA / Westwood",
    rating: 4.8,
    ratingCount: 24,
    businessType: "SALON",
    thumbnailUrl: null,
  },
  {
    id: "2",
    serviceName: "Gel Manicure",
    providerName: "Lisa K.",
    category: "NAILS",
    originalPrice: 5500,
    discountedPrice: 3500,
    startAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    endAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    launchZone: "LMU / Westchester",
    rating: 4.9,
    ratingCount: 42,
    businessType: "SUITE",
    thumbnailUrl: null,
  },
  {
    id: "3",
    serviceName: "Classic Lash Extensions",
    providerName: "Mia R.",
    category: "LASHES",
    originalPrice: 15000,
    discountedPrice: 10000,
    startAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endAt: new Date(Date.now() + 26 * 60 * 60 * 1000),
    launchZone: "UCLA / Westwood",
    rating: 4.7,
    ratingCount: 18,
    businessType: "HOME",
    thumbnailUrl: null,
  },
  {
    id: "4",
    serviceName: "Full Glam Makeup",
    providerName: "Jen T.",
    category: "MAKEUP",
    originalPrice: 12000,
    discountedPrice: 8400,
    startAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    endAt: new Date(Date.now() + 9.5 * 60 * 60 * 1000),
    launchZone: "West Los Angeles",
    rating: 5.0,
    ratingCount: 11,
    businessType: "MOBILE",
    thumbnailUrl: null,
  },
  {
    id: "5",
    serviceName: "Hydrafacial Treatment",
    providerName: "Dr. Amy L.",
    category: "SKINCARE_FACIALS",
    originalPrice: 20000,
    discountedPrice: 14000,
    startAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
    endAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    launchZone: "UCLA / Westwood",
    rating: 4.6,
    ratingCount: 31,
    businessType: "SUITE",
    thumbnailUrl: null,
  },
  {
    id: "6",
    serviceName: "Silk Press & Trim",
    providerName: "Tasha W.",
    category: "HAIR",
    originalPrice: 9500,
    discountedPrice: 6500,
    startAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    endAt: new Date(Date.now() + 7.5 * 60 * 60 * 1000),
    launchZone: "LMU / Westchester",
    rating: 4.9,
    ratingCount: 56,
    businessType: "SALON",
    thumbnailUrl: null,
  },
];

export default function AppointmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = DEMO_APPOINTMENTS.filter((apt) => {
    if (selectedCategory && apt.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !apt.providerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Open appointments
          </h1>
          <p className="text-gray-400 mt-1.5 text-[15px]">
            Discounted beauty slots from verified professionals in West LA
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start animate-fade-in-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input
              placeholder="Search services or providers..."
              className="pl-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>

        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-gray-900 font-semibold">No appointments found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try a different category or search term
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-gray-400">
                <span className="font-medium text-gray-600">{filtered.length}</span>{" "}
                appointments available
              </p>
              <select className="text-[13px] text-gray-500 bg-transparent border-0 font-medium cursor-pointer focus:outline-none">
                <option>Soonest first</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>Highest rated</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((apt, i) => (
                <div
                  key={apt.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                >
                  <AppointmentCard {...apt} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
