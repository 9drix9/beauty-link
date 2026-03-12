"use client";

import { useState } from "react";
import { Star, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import { WaitlistForm } from "@/components/shared/waitlist-form";
import Link from "next/link";

// ─── Demo Data ───────────────────────────────────────────────

interface DemoAppointment {
  id: string;
  service: string;
  category: string;
  stylist: string;
  rating: number;
  reviews: number;
  location: string;
  date: string;
  time: string;
  originalPrice: number;
  discountedPrice: number;
  imageGradient: string;
  badge?: string;
  initial: string;
}

const DEMO_APPOINTMENTS: DemoAppointment[] = [
  {
    id: "demo-1",
    service: "Hybrid Lash Set",
    category: "Lashes",
    stylist: "Jessica Kim",
    rating: 4.9,
    reviews: 124,
    location: "Westwood",
    date: "Today",
    time: "4:30 PM",
    originalPrice: 125,
    discountedPrice: 79,
    imageGradient: "from-rose-200 via-pink-100 to-amber-50",
    badge: "Just listed",
    initial: "L",
  },
  {
    id: "demo-2",
    service: "Balayage + Blowout",
    category: "Hair",
    stylist: "Sarah Mitchell",
    rating: 4.8,
    reviews: 89,
    location: "Santa Monica",
    date: "Tomorrow",
    time: "11:00 AM",
    originalPrice: 220,
    discountedPrice: 145,
    imageGradient: "from-amber-100 via-orange-50 to-rose-50",
    badge: "Last minute opening",
    initial: "H",
  },
  {
    id: "demo-3",
    service: "Gel Manicure + Pedicure",
    category: "Nails",
    stylist: "Maria Santos",
    rating: 5.0,
    reviews: 67,
    location: "Beverly Hills",
    date: "Today",
    time: "2:00 PM",
    originalPrice: 85,
    discountedPrice: 45,
    imageGradient: "from-pink-100 via-rose-50 to-purple-50",
    badge: "Today only",
    initial: "N",
  },
  {
    id: "demo-4",
    service: "Full Glam Makeup",
    category: "Makeup",
    stylist: "Aaliyah James",
    rating: 4.9,
    reviews: 203,
    location: "Brentwood",
    date: "Sat, Mar 15",
    time: "9:00 AM",
    originalPrice: 180,
    discountedPrice: 110,
    imageGradient: "from-purple-100 via-pink-50 to-rose-50",
    initial: "M",
  },
  {
    id: "demo-5",
    service: "Microblading Touch-Up",
    category: "Brows",
    stylist: "Priya Patel",
    rating: 4.7,
    reviews: 45,
    location: "Westwood",
    date: "Today",
    time: "6:00 PM",
    originalPrice: 150,
    discountedPrice: 95,
    imageGradient: "from-amber-50 via-rose-100 to-pink-50",
    badge: "Just listed",
    initial: "B",
  },
  {
    id: "demo-6",
    service: "Hydrafacial Glow",
    category: "Skincare",
    stylist: "Emily Chen",
    rating: 4.8,
    reviews: 112,
    location: "Santa Monica",
    date: "Tomorrow",
    time: "3:00 PM",
    originalPrice: 199,
    discountedPrice: 129,
    imageGradient: "from-teal-50 via-emerald-50 to-rose-50",
    initial: "S",
  },
];

interface MapPin {
  id: string;
  label: string;
  price: string;
  x: number;
  y: number;
  tooltip: {
    service: string;
    time: string;
    location: string;
    original: string;
    discounted: string;
  };
}

const MAP_PINS: MapPin[] = [
  {
    id: "pin-1",
    label: "$79",
    price: "$79",
    x: 48,
    y: 32,
    tooltip: {
      service: "Hybrid Lash Set",
      time: "Today \u2022 4:30 PM",
      location: "Westwood",
      original: "$125",
      discounted: "$79",
    },
  },
  {
    id: "pin-2",
    label: "$145",
    price: "$145",
    x: 18,
    y: 58,
    tooltip: {
      service: "Balayage + Blowout",
      time: "Tomorrow \u2022 11:00 AM",
      location: "Santa Monica",
      original: "$220",
      discounted: "$145",
    },
  },
  {
    id: "pin-3",
    label: "$45",
    price: "$45",
    x: 75,
    y: 25,
    tooltip: {
      service: "Gel Manicure + Pedicure",
      time: "Today \u2022 2:00 PM",
      location: "Beverly Hills",
      original: "$85",
      discounted: "$45",
    },
  },
  {
    id: "pin-4",
    label: "$110",
    price: "$110",
    x: 35,
    y: 45,
    tooltip: {
      service: "Full Glam Makeup",
      time: "Sat, Mar 15 \u2022 9:00 AM",
      location: "Brentwood",
      original: "$180",
      discounted: "$110",
    },
  },
  {
    id: "pin-5",
    label: "$95",
    price: "$95",
    x: 55,
    y: 55,
    tooltip: {
      service: "Microblading Touch-Up",
      time: "Today \u2022 6:00 PM",
      location: "Westwood",
      original: "$150",
      discounted: "$95",
    },
  },
];

const NEIGHBORHOODS = [
  { name: "Santa Monica", x: 12, y: 50 },
  { name: "Brentwood", x: 30, y: 38 },
  { name: "Westwood", x: 45, y: 28 },
  { name: "UCLA", x: 40, y: 40 },
  { name: "Beverly Hills", x: 68, y: 22 },
];

// ─── Components ──────────────────────────────────────────────

function DemoCard({ apt }: { apt: DemoAppointment }) {
  const savings = Math.round(
    ((apt.originalPrice - apt.discountedPrice) / apt.originalPrice) * 100
  );

  return (
    <div className="group relative rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-200 hover:shadow-cardHover hover:-translate-y-0.5 cursor-pointer">
      {/* Image placeholder */}
      <div
        className={`relative aspect-[3/2] bg-gradient-to-br ${apt.imageGradient} flex items-center justify-center overflow-hidden`}
      >
        <span className="text-5xl font-bold text-dark/[0.07]">
          {apt.initial}
        </span>

        {/* Savings pill */}
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-cta px-2.5 py-1 text-xs font-bold text-white shadow-md">
          Save {savings}%
        </span>

        {/* Urgency badge */}
        {apt.badge && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-dark/80 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-md">
            {apt.badge === "Just listed" && (
              <Sparkles className="h-3 w-3" aria-hidden="true" />
            )}
            {apt.badge === "Today only" && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error/75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error" />
              </span>
            )}
            {apt.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Service + Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-dark leading-tight line-clamp-1 flex-1 min-w-0">
            {apt.service}
          </h3>
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-sm text-muted line-through">
              ${apt.originalPrice}
            </span>
            <span className="text-lg font-bold text-dark">
              ${apt.discountedPrice}
            </span>
          </div>
        </div>

        {/* Stylist + Rating */}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-light text-[10px] font-semibold text-accent shrink-0">
            {apt.stylist.charAt(0)}
          </span>
          <span className="text-sm text-body truncate">{apt.stylist}</span>
          <span className="flex items-center gap-0.5 text-sm text-body shrink-0">
            <Star
              className="h-3.5 w-3.5 fill-cta text-cta"
              aria-hidden="true"
            />
            {apt.rating}
            <span className="text-muted">({apt.reviews})</span>
          </span>
        </div>

        {/* Date + Location */}
        <div className="mt-3 flex items-center gap-3 text-[13px] text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {apt.date} &middot; {apt.time}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[13px] text-muted">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          {apt.location}
        </div>
      </div>
    </div>
  );
}

function InteractiveMap() {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden bg-[#F0E8DF] border border-border">
      {/* Stylized map background with roads */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Water - Pacific Ocean on left */}
        <path d="M0 0 L8 0 Q6 20, 4 40 Q2 60, 5 80 Q3 90, 0 100 L0 0 Z" fill="#D4E6F1" opacity="0.4" />

        {/* Major roads */}
        <line x1="0" y1="45" x2="100" y2="45" stroke="#E6D8CF" strokeWidth="0.8" />
        <line x1="0" y1="65" x2="100" y2="65" stroke="#E6D8CF" strokeWidth="0.5" />
        <line x1="25" y1="0" x2="25" y2="100" stroke="#E6D8CF" strokeWidth="0.5" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#E6D8CF" strokeWidth="0.8" />
        <line x1="70" y1="0" x2="70" y2="100" stroke="#E6D8CF" strokeWidth="0.5" />

        {/* Diagonal roads */}
        <line x1="10" y1="80" x2="90" y2="10" stroke="#E6D8CF" strokeWidth="0.4" />
        <line x1="15" y1="20" x2="85" y2="70" stroke="#E6D8CF" strokeWidth="0.4" />

        {/* Parks / green areas */}
        <ellipse cx="42" cy="42" rx="5" ry="4" fill="#C8DFC3" opacity="0.35" />
        <ellipse cx="70" cy="55" rx="4" ry="3" fill="#C8DFC3" opacity="0.3" />
      </svg>

      {/* Neighborhood labels */}
      {NEIGHBORHOODS.map((n) => (
        <div
          key={n.name}
          className="absolute text-[10px] font-semibold tracking-wider uppercase text-dark/25 pointer-events-none select-none"
          style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)" }}
        >
          {n.name}
        </div>
      ))}

      {/* Price pins */}
      {MAP_PINS.map((pin) => (
        <div
          key={pin.id}
          className="absolute z-10"
          style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -100%)" }}
          onMouseEnter={() => setActivePin(pin.id)}
          onMouseLeave={() => setActivePin(null)}
        >
          {/* Pin body */}
          <div className="relative cursor-pointer group/pin">
            <div className="relative px-2.5 py-1.5 rounded-full bg-cta text-white text-xs font-bold shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl whitespace-nowrap">
              {pin.price}
            </div>
            {/* Pin arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-cta" />

            {/* Tooltip */}
            {activePin === pin.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white rounded-xl shadow-elevated border border-border p-3.5 z-20 animate-fade-in pointer-events-none">
                <p className="font-semibold text-dark text-sm leading-tight">
                  {pin.tooltip.service}
                </p>
                <p className="text-xs text-muted mt-1">{pin.tooltip.time}</p>
                <p className="text-xs text-muted">{pin.tooltip.location}</p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xs text-muted line-through">
                    {pin.tooltip.original}
                  </span>
                  <span className="text-sm font-bold text-dark">
                    {pin.tooltip.discounted}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Map label */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[11px] text-muted font-medium border border-border/50">
        West Los Angeles
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export function DemoBrowse() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark">
            Discover Appointments
          </h1>
          <p className="text-body/70 mt-1.5 text-sm sm:text-base">
            Browse discounted beauty appointments near you.
          </p>
        </div>
      </div>

      {/* Category pills */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
            {["All", "Hair", "Nails", "Makeup", "Lashes", "Brows", "Skincare"].map(
              (cat, i) => (
                <button
                  key={cat}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    i === 0
                      ? "bg-dark text-white"
                      : "bg-background text-body hover:bg-border"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Demo label */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Example appointments — full marketplace launching soon
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — Demo Cards (60%) */}
          <div className="lg:w-[60%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {DEMO_APPOINTMENTS.map((apt) => (
                <DemoCard key={apt.id} apt={apt} />
              ))}
            </div>
          </div>

          {/* Right — Map (40%) */}
          <div className="lg:w-[40%]">
            <div className="lg:sticky lg:top-[80px]">
              <InteractiveMap />
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist CTA */}
      <div className="border-t border-border bg-gradient-to-b from-accent-light/50 to-background">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-sm font-semibold text-accent mb-3 tracking-wide uppercase">
            Coming Soon
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-3">
            BeautyLink launches soon in Los Angeles
          </h2>
          <p className="text-body/70 mb-8 max-w-md mx-auto">
            Join the waitlist to get early access to discounted beauty
            appointments near you.
          </p>
          <WaitlistForm source="browse-demo" />
          <div className="mt-8">
            <Link
              href="/pro/apply"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              Are you a stylist? Apply now
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
