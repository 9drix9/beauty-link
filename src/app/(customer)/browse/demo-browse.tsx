"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  X,
  Shield,
  Calendar,
} from "lucide-react";
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
  address: string;
  date: string;
  time: string;
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  imageGradient: string;
  badge?: string;
  initial: string;
  description: string;
  includes: string[];
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
    address: "Westwood Blvd, Los Angeles",
    date: "Today",
    time: "4:30 PM",
    duration: "90 min",
    originalPrice: 125,
    discountedPrice: 79,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80&auto=format&fit=crop",
    imageGradient: "from-rose-200 via-pink-100 to-amber-50",
    badge: "Just listed",
    initial: "L",
    description:
      "Classic + volume mix for a natural-to-glam look. Includes lash bath, primer, and aftercare kit.",
    includes: ["Lash bath & primer", "Hybrid full set", "Aftercare kit"],
  },
  {
    id: "demo-2",
    service: "Balayage + Blowout",
    category: "Hair",
    stylist: "Sarah Mitchell",
    rating: 4.8,
    reviews: 89,
    location: "Santa Monica",
    address: "Montana Ave, Santa Monica",
    date: "Tomorrow",
    time: "11:00 AM",
    duration: "2.5 hrs",
    originalPrice: 220,
    discountedPrice: 145,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80&auto=format&fit=crop",
    imageGradient: "from-amber-100 via-orange-50 to-rose-50",
    badge: "Last minute opening",
    initial: "H",
    description:
      "Hand-painted balayage with toner and a styled blowout. Perfect for a sun-kissed refresh.",
    includes: ["Consultation", "Balayage + toner", "Blowout & style"],
  },
  {
    id: "demo-3",
    service: "Gel Manicure + Pedicure",
    category: "Nails",
    stylist: "Maria Santos",
    rating: 5.0,
    reviews: 67,
    location: "Beverly Hills",
    address: "S Beverly Dr, Beverly Hills",
    date: "Today",
    time: "2:00 PM",
    duration: "75 min",
    originalPrice: 85,
    discountedPrice: 45,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop",
    imageGradient: "from-pink-100 via-rose-50 to-purple-50",
    badge: "Today only",
    initial: "N",
    description:
      "Full gel manicure and pedicure with cuticle care, shaping, and your choice of color.",
    includes: ["Gel manicure", "Gel pedicure", "Cuticle care & shaping"],
  },
  {
    id: "demo-4",
    service: "Full Glam Makeup",
    category: "Makeup",
    stylist: "Aaliyah James",
    rating: 4.9,
    reviews: 203,
    location: "Brentwood",
    address: "San Vicente Blvd, Brentwood",
    date: "Sat, Mar 15",
    time: "9:00 AM",
    duration: "60 min",
    originalPrice: 180,
    discountedPrice: 110,
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80&auto=format&fit=crop",
    imageGradient: "from-purple-100 via-pink-50 to-rose-50",
    initial: "M",
    description:
      "Red-carpet-ready glam with false lashes, contouring, and long-wear setting spray.",
    includes: ["Full face makeup", "False lashes", "Setting spray"],
  },
  {
    id: "demo-5",
    service: "Microblading Touch-Up",
    category: "Brows",
    stylist: "Priya Patel",
    rating: 4.7,
    reviews: 45,
    location: "Westwood",
    address: "Wilshire Blvd, Westwood",
    date: "Today",
    time: "6:00 PM",
    duration: "45 min",
    originalPrice: 150,
    discountedPrice: 95,
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&auto=format&fit=crop",
    imageGradient: "from-amber-50 via-rose-100 to-pink-50",
    badge: "Just listed",
    initial: "B",
    description:
      "Precision touch-up for existing microblading. Restore color and shape for brows that last.",
    includes: ["Brow mapping", "Microblading touch-up", "Aftercare balm"],
  },
  {
    id: "demo-6",
    service: "Hydrafacial Glow",
    category: "Skincare",
    stylist: "Emily Chen",
    rating: 4.8,
    reviews: 112,
    location: "Santa Monica",
    address: "Ocean Ave, Santa Monica",
    date: "Tomorrow",
    time: "3:00 PM",
    duration: "50 min",
    originalPrice: 199,
    discountedPrice: 129,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",
    imageGradient: "from-teal-50 via-emerald-50 to-rose-50",
    initial: "S",
    description:
      "Deep cleanse, exfoliation, extraction, and hydration with antioxidant serum infusion.",
    includes: ["Deep cleanse", "Extraction", "LED light therapy", "Serum boost"],
  },
];

interface DemoMapPin {
  id: string;
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

const MAP_PINS: DemoMapPin[] = [
  {
    id: "pin-1",
    price: "$79",
    x: 52,
    y: 28,
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
    price: "$145",
    x: 15,
    y: 62,
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
    price: "$45",
    x: 80,
    y: 20,
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
    price: "$110",
    x: 32,
    y: 38,
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
    price: "$95",
    x: 58,
    y: 52,
    tooltip: {
      service: "Microblading Touch-Up",
      time: "Today \u2022 6:00 PM",
      location: "Westwood",
      original: "$150",
      discounted: "$95",
    },
  },
  {
    id: "pin-6",
    price: "$129",
    x: 22,
    y: 48,
    tooltip: {
      service: "Hydrafacial Glow",
      time: "Tomorrow \u2022 3:00 PM",
      location: "Santa Monica",
      original: "$199",
      discounted: "$129",
    },
  },
];

// ─── Components ──────────────────────────────────────────────

function DemoCard({
  apt,
  onSelect,
}: {
  apt: DemoAppointment;
  onSelect: (apt: DemoAppointment) => void;
}) {
  const savings = Math.round(
    ((apt.originalPrice - apt.discountedPrice) / apt.originalPrice) * 100
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(apt)}
      className="group relative rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-200 hover:shadow-cardHover hover:-translate-y-0.5 text-left w-full"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-background">
        <Image
          src={apt.image}
          alt={apt.service}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

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
          <span>&middot;</span>
          <span>{apt.duration}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[13px] text-muted">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          {apt.location}
        </div>
      </div>
    </button>
  );
}

function DetailModal({
  apt,
  onClose,
}: {
  apt: DemoAppointment;
  onClose: () => void;
}) {
  const savings = Math.round(
    ((apt.originalPrice - apt.discountedPrice) / apt.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl shadow-elevated overflow-hidden max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={apt.image}
            alt={apt.service}
            fill
            unoptimized
            className="object-cover"
            sizes="500px"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-dark hover:bg-white transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {apt.badge && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-dark/80 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white">
              {apt.badge === "Just listed" && (
                <Sparkles className="h-3 w-3" aria-hidden="true" />
              )}
              {apt.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service + Price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-dark">{apt.service}</h2>
              <p className="text-sm text-muted mt-0.5">{apt.category}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted line-through">
                  ${apt.originalPrice}
                </span>
                <span className="text-2xl font-bold text-dark">
                  ${apt.discountedPrice}
                </span>
              </div>
              <span className="text-xs font-semibold text-cta">
                Save {savings}%
              </span>
            </div>
          </div>

          {/* Stylist */}
          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-background">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
              {apt.stylist.charAt(0)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-dark text-sm">{apt.stylist}</p>
              <div className="flex items-center gap-1 text-xs text-muted">
                <Star
                  className="h-3 w-3 fill-cta text-cta"
                  aria-hidden="true"
                />
                {apt.rating} ({apt.reviews} reviews)
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-success font-medium">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              Verified
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-body">
              <Calendar className="h-4 w-4 text-muted" aria-hidden="true" />
              {apt.date} &middot; {apt.time} &middot; {apt.duration}
            </div>
            <div className="flex items-center gap-2 text-sm text-body">
              <MapPin className="h-4 w-4 text-muted" aria-hidden="true" />
              {apt.address}
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm text-body/80 leading-relaxed">
            {apt.description}
          </p>

          {/* Includes */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              What&apos;s included
            </p>
            <ul className="space-y-1.5">
              {apt.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-body"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-center text-sm text-muted mb-4">
              This is a preview listing. Bookings open soon.
            </p>
            <WaitlistForm source={`demo-card-${apt.id}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractiveMap() {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[700px] rounded-2xl overflow-hidden border border-border">
      {/* Real Google Maps embed — West LA area */}
      <iframe
        title="West Los Angeles map"
        className="absolute inset-0 w-full h-full"
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d52944.72377694!2d-118.46!3d34.055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
        style={{ border: 0, filter: "saturate(0.85) brightness(1.05)" }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Overlay for pins */}
      <div className="absolute inset-0 pointer-events-none">
        {MAP_PINS.map((pin) => (
          <div
            key={pin.id}
            className="absolute pointer-events-auto z-10"
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: "translate(-50%, -100%)",
            }}
            onMouseEnter={() => setActivePin(pin.id)}
            onMouseLeave={() => setActivePin(null)}
          >
            <div className="relative cursor-pointer">
              {/* Pin body */}
              <div
                className={`relative px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-200 hover:scale-110 whitespace-nowrap ${
                  activePin === pin.id
                    ? "bg-dark text-white scale-110"
                    : "bg-white text-dark border border-border"
                }`}
              >
                {pin.price}
              </div>
              {/* Pin arrow */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${
                  activePin === pin.id
                    ? "border-t-dark"
                    : "border-t-white"
                }`}
              />

              {/* Tooltip */}
              {activePin === pin.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white rounded-xl shadow-elevated border border-border p-3.5 z-20 animate-fade-in">
                  <p className="font-semibold text-dark text-sm leading-tight">
                    {pin.tooltip.service}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {pin.tooltip.time}
                  </p>
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
      </div>

      {/* Map label */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[11px] text-dark font-semibold border border-border/50 shadow-sm z-10 pointer-events-none">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-accent" />
          West Los Angeles
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export function DemoBrowse() {
  const [selectedApt, setSelectedApt] = useState<DemoAppointment | null>(null);

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
            {[
              "All",
              "Hair",
              "Nails",
              "Makeup",
              "Lashes",
              "Brows",
              "Skincare",
            ].map((cat, i) => (
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
            ))}
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
                <DemoCard key={apt.id} apt={apt} onSelect={setSelectedApt} />
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

      {/* Detail Modal */}
      {selectedApt && (
        <DetailModal
          apt={selectedApt}
          onClose={() => setSelectedApt(null)}
        />
      )}
    </div>
  );
}
