"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Info,
  Users,
  X,
  Calendar,
} from "lucide-react";
import { WaitlistForm } from "@/components/shared/waitlist-form";

interface ModelCallListing {
  id: string;
  service: string;
  category: string;
  stylist: string;
  skillLevel: "Student" | "Trainee" | "Beginner";
  school?: string;
  location: string;
  address: string;
  date: string;
  time: string;
  duration: string;
  modelRequirements: string;
  description: string;
  includes: string[];
  image: string;
}

const DEMO_MODEL_CALLS: ModelCallListing[] = [
  {
    id: "mc-1",
    service: "Practice Balayage",
    category: "Hair",
    stylist: "Maya Johnson",
    skillLevel: "Student",
    school: "UCLA Cosmetology Program",
    location: "Westwood",
    address: "Westwood Blvd, Los Angeles",
    date: "Saturday",
    time: "10:00 AM",
    duration: "3 hrs",
    modelRequirements: "Looking for medium to long hair, any texture. Must be comfortable with a longer appointment time.",
    description: "Practice balayage technique under instructor supervision. Great for anyone wanting a free color refresh.",
    includes: ["Consultation", "Balayage application", "Toner", "Blowout"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "mc-2",
    service: "Gel Manicure Practice",
    category: "Nails",
    stylist: "Lucia Reyes",
    skillLevel: "Trainee",
    location: "Santa Monica",
    address: "Montana Ave, Santa Monica",
    date: "Sunday",
    time: "1:00 PM",
    duration: "90 min",
    modelRequirements: "All nail types welcome. Please come with clean, polish free nails.",
    description: "Practicing gel application and nail art techniques. Choose from a selection of gel colors.",
    includes: ["Nail shaping", "Cuticle care", "Gel application", "Top coat"],
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "mc-3",
    service: "Lash Lift Training",
    category: "Lashes",
    stylist: "Priya Desai",
    skillLevel: "Student",
    school: "LMU Beauty Academy",
    location: "Beverly Hills",
    address: "S Beverly Dr, Beverly Hills",
    date: "Friday",
    time: "3:00 PM",
    duration: "75 min",
    modelRequirements: "Natural lashes only (no extensions). Please arrive with clean, makeup free eyes.",
    description: "Lash lift and tint practice session. Supervised by a licensed instructor.",
    includes: ["Lash lift", "Lash tint", "Aftercare instructions"],
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "mc-4",
    service: "Beginner Makeup Application",
    category: "Makeup",
    stylist: "Jasmine Cole",
    skillLevel: "Beginner",
    location: "Brentwood",
    address: "San Vicente Blvd, Brentwood",
    date: "Saturday",
    time: "11:00 AM",
    duration: "60 min",
    modelRequirements: "All skin tones welcome. Let me know about any skin sensitivities.",
    description: "Building my portfolio with full glam looks. Great if you have an event coming up or just want a free makeover.",
    includes: ["Full face makeup", "Lashes (optional)", "Setting spray"],
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "mc-5",
    service: "Brow Lamination Practice",
    category: "Brows",
    stylist: "Taylor Kim",
    skillLevel: "Trainee",
    location: "Westwood",
    address: "Wilshire Blvd, Westwood",
    date: "Thursday",
    time: "5:00 PM",
    duration: "45 min",
    modelRequirements: "Natural brows preferred (not recently waxed or threaded). All brow types welcome.",
    description: "Practicing brow lamination technique to create a fuller, brushed up look.",
    includes: ["Brow lamination", "Brow tint", "Shaping"],
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&auto=format&fit=crop",
  },
];

const CATEGORIES = ["All", "Hair", "Nails", "Makeup", "Lashes", "Brows", "Skincare"];

function SkillBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Student: "bg-blue-50 text-blue-700 border-blue-200/60",
    Trainee: "bg-purple-50 text-purple-700 border-purple-200/60",
    Beginner: "bg-green-50 text-green-700 border-green-200/60",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colors[level] || "bg-gray-50 text-gray-700 border-gray-200/60"}`}>
      <GraduationCap className="h-2.5 w-2.5" aria-hidden="true" />
      {level}
    </span>
  );
}

function FreeBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-md">
      FREE
    </span>
  );
}

function ModelCallCard({
  listing,
  onSelect,
}: {
  listing: ModelCallListing;
  onSelect: (l: ModelCallListing) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(listing)}
      className="group relative rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-200 hover:shadow-cardHover hover:-translate-y-0.5 text-left w-full"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-background">
        <Image
          src={listing.image}
          alt={listing.service}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <FreeBadge />
        <span className="absolute top-3 left-3">
          <FreeBadge />
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-dark leading-tight line-clamp-1">
              {listing.service}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <SkillBadge level={listing.skillLevel} />
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                <Users className="h-2.5 w-2.5" aria-hidden="true" />
                Model Call
              </span>
            </div>
          </div>
          <span className="text-lg font-bold text-emerald-600 shrink-0">
            $0
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-light text-[10px] font-semibold text-accent shrink-0">
            {listing.stylist.charAt(0)}
          </span>
          <span className="text-sm text-body truncate">{listing.stylist}</span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[13px] text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {listing.date} &middot; {listing.time}
          </span>
          <span>&middot;</span>
          <span>{listing.duration}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[13px] text-muted">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          {listing.location}
        </div>

        <p className="mt-2 text-xs text-muted line-clamp-2 leading-relaxed">
          {listing.modelRequirements}
        </p>
      </div>
    </button>
  );
}

function ModelCallDetailModal({
  listing,
  onClose,
}: {
  listing: ModelCallListing;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl shadow-elevated overflow-hidden max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={listing.image}
            alt={listing.service}
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
          <span className="absolute top-4 left-4">
            <FreeBadge />
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-dark">{listing.service}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm text-muted">{listing.category}</span>
                <SkillBadge level={listing.skillLevel} />
              </div>
            </div>
            <span className="text-2xl font-bold text-emerald-600">FREE</span>
          </div>

          {/* Stylist */}
          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-background">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
              {listing.stylist.charAt(0)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-dark text-sm">{listing.stylist}</p>
              <div className="flex items-center gap-2 text-xs text-muted">
                <GraduationCap className="h-3 w-3" aria-hidden="true" />
                {listing.skillLevel}
                {listing.school && ` at ${listing.school}`}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-body">
              <Calendar className="h-4 w-4 text-muted" aria-hidden="true" />
              {listing.date} &middot; {listing.time} &middot; {listing.duration}
            </div>
            <div className="flex items-center gap-2 text-sm text-body">
              <MapPin className="h-4 w-4 text-muted" aria-hidden="true" />
              {listing.address}
            </div>
          </div>

          {/* Model Requirements */}
          <div className="mt-4 p-3 rounded-xl bg-blue-50/50 border border-blue-200/40">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1.5">
              Model Requirements
            </p>
            <p className="text-sm text-blue-900 leading-relaxed">
              {listing.modelRequirements}
            </p>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm text-body/80 leading-relaxed">
            {listing.description}
          </p>

          {/* Includes */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              What&apos;s Included
            </p>
            <ul className="space-y-1.5">
              {listing.includes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-body">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="mt-5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/40">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Model Call services may be performed in a practice, training, or demo setting and can vary by provider experience and service type.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-center text-sm text-muted mb-4">
              This is a preview listing. Bookings open soon.
            </p>
            <WaitlistForm source={`model-call-${listing.id}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoModelCalls() {
  const [selectedListing, setSelectedListing] = useState<ModelCallListing | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const filteredListings = DEMO_MODEL_CALLS.filter((l) => {
    if (activeCategory !== "All" && l.category !== activeCategory) return false;
    if (searchText && !l.service.toLowerCase().includes(searchText.toLowerCase()) &&
        !l.stylist.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light">
              <GraduationCap className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark">
                Model Calls
              </h1>
              <p className="text-body/70 mt-0.5 text-sm sm:text-base">
                Find free and low-cost beauty appointments from students, emerging professionals, and artists seeking models for practice, demos, and portfolio work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-surface border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search model calls..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-dark placeholder:text-muted"
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Disclaimer */}
        <div className="mb-5 rounded-xl border border-blue-200/60 bg-blue-50/50 px-4 py-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-700 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-blue-800">
              Model Call services may be performed in a practice, training, or demo setting and can vary by provider experience and service type. BeautyLink will officially launch in May 2026.
            </p>
          </div>
        </div>

        {/* Cards */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((listing) => (
              <ModelCallCard
                key={listing.id}
                listing={listing}
                onSelect={setSelectedListing}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <GraduationCap className="h-10 w-10 text-muted/30 mx-auto mb-3" />
            <p className="text-muted text-sm">No model calls for this category yet.</p>
          </div>
        )}
      </div>

      {/* Waitlist CTA */}
      <div className="border-t border-border bg-gradient-to-b from-accent-light/50 to-background">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-sm font-semibold text-accent mb-3 tracking-wide uppercase">
            For Trainees
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-3">
            Are You A Beauty Student?
          </h2>
          <p className="text-body/70 mb-8 max-w-md mx-auto">
            List your training services for free and find practice models in your area. Build your portfolio and gain real experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pro/apply"
              className="inline-flex items-center gap-2 rounded-full bg-dark px-7 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
            >
              Apply As A Trainee
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8">
            <p className="text-sm text-muted mb-3">Or join the waitlist for updates</p>
            <WaitlistForm source="model-calls" />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <ModelCallDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
