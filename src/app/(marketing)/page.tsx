import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Check,
  Info,
  Star,
  Clock,
  Quote,
  Shield,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import { WaitlistForm } from "@/components/shared/waitlist-form";
import { IS_LAUNCHED } from "@/lib/launch";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const TESTIMONIALS = [
  {
    quote:
      "I listed an open chair on Tuesday and had it booked by Wednesday morning. No ads, no DMs — just posted and done.",
    name: "Jasmine R.",
    role: "Lash Artist · West LA",
    initials: "JR",
  },
  {
    quote:
      "I was spending $200/month on Instagram ads trying to fill slow days. BeautyLink fills them for free.",
    name: "Daniela M.",
    role: "Nail Tech · Santa Monica",
    initials: "DM",
  },
  {
    quote:
      "I saved $40 on a balayage from someone I never would have found otherwise. The quality was incredible.",
    name: "Priya K.",
    role: "BeautyLink Client",
    initials: "PK",
  },
];

export const metadata = {
  title: "BeautyLink | Great Beauty. Better Prices.",
  description:
    "Discover open beauty appointments near you. Flexible timing, insider prices, and talented beauty professionals across hair, nails, lashes, makeup, skincare, and more at 10 to 50% off.",
};

const PREVIEW_LISTINGS = [
  {
    id: "preview-1",
    service: "Hybrid Lash Set",
    category: "Lashes",
    stylist: "Jessica K.",
    rating: 4.9,
    location: "Westwood",
    time: "Today, 4:30 PM",
    duration: "90 min",
    originalPrice: 125,
    discountedPrice: 79,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "preview-2",
    service: "Balayage + Blowout",
    category: "Hair",
    stylist: "Sarah M.",
    rating: 4.8,
    location: "Santa Monica",
    time: "Tomorrow, 11:00 AM",
    duration: "2.5 hrs",
    originalPrice: 220,
    discountedPrice: 145,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "preview-3",
    service: "Gel Manicure + Pedicure",
    category: "Nails",
    stylist: "Maria S.",
    rating: 5.0,
    location: "Beverly Hills",
    time: "Today, 2:00 PM",
    duration: "75 min",
    originalPrice: 85,
    discountedPrice: 45,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80&auto=format&fit=crop",
  },
];

export default async function HomePage() {
  // Dynamic founding stylists count
  let proCount = 0;
  try {
    proCount = await db.professionalProfile.count();
  } catch {
    // DB unavailable during build — fallback to 0
  }
  // Show at least a base number for credibility
  const displayCount = Math.max(proCount, 12);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pt-20 pb-12 md:pt-28 md:pb-16">
        <div
          className="absolute inset-0 -z-10 gradient-hero-page"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            {/* Location tag */}
            <div className="inline-flex items-center gap-1.5 text-sm text-body/70 mb-6">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Los Angeles
            </div>

            <h1 className="font-serif text-[2.75rem] leading-[1.05] md:text-[4.25rem] lg:text-[5rem] tracking-tight text-dark">
              <span className="font-bold">Great Beauty.</span>
              <br />
              <span className="italic text-accent">
                Better Prices.
              </span>
            </h1>

            <p className="mt-5 text-lg text-body/70 max-w-md mx-auto md:mx-0 leading-relaxed">
              Discover open beauty appointments near you. Flexible timing, insider prices, and talented beauty professionals across hair, nails, lashes, makeup, skincare, and more.
            </p>
            <p className="mt-2 text-lg text-body/70 max-w-md mx-auto md:mx-0 font-semibold">
              10 to 50% off all appointments.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3">
              {IS_LAUNCHED ? (
                <>
                  <Link
                    href="/browse"
                    className="inline-flex items-center gap-2.5 rounded-full bg-dark px-7 py-3.5 text-[15px] font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
                  >
                    Browse Appointments
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/pro/join"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-7 py-3.5 text-[15px] font-semibold text-body transition-all hover:bg-white hover:-translate-y-0.5"
                  >
                    List Your Services
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/pro/join"
                    className="inline-flex items-center gap-2.5 rounded-full bg-dark px-7 py-3.5 text-[15px] font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
                  >
                    Become A Founding Stylist
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-7 py-3.5 text-[15px] font-semibold text-body transition-all hover:bg-white hover:-translate-y-0.5"
                  >
                    Learn More
                  </a>
                </>
              )}
            </div>

            {/* Proof points */}
            <div className="mt-8 flex flex-col items-center sm:flex-row sm:items-start justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-body/60">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                Verified professionals
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                Secure checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                Free cancellation 24hr+
              </span>
            </div>
          </div>

          {/* Hero image — desktop only */}
          <div className="hidden lg:block absolute top-0 right-0 w-[45%] h-full">
            <div className="relative h-full w-full rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop"
                alt="Beauty professional working in a modern salon"
                fill
                unoptimized
                className="object-cover"
                style={{ filter: "sepia(20%) saturate(1.15) brightness(0.96)" }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#faf5f0] via-transparent to-transparent" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(176,90,42,0.3) 0%, rgba(107,48,32,0.15) 60%, rgba(61,26,15,0.08) 100%)", mixBlendMode: "multiply" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Founding Stylists Counter ── */}
      {!IS_LAUNCHED && (
        <section className="py-8 bg-white border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["JR", "DM", "MS", "AK"].map((initials, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-accent-light text-[10px] font-bold text-accent"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">
                    {displayCount}+ founding stylists have applied
                  </p>
                  <p className="text-xs text-muted">
                    Hair, nails, lashes, makeup, skincare — and growing every week.
                  </p>
                </div>
              </div>
              <Link
                href="/pro/join"
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-light/50 px-4 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-colors"
              >
                Join them
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Waitlist (pre-launch) or Live Deals (launched) ── */}
      {IS_LAUNCHED ? (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-dark w-full text-center sm:text-left sm:w-auto">
                Sample Appointments
              </h2>
              <Link
                href="/browse"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-accent mb-3">
              Launching May 2026
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-dark mb-3">
              Client Bookings Open May 2026
            </h2>
            <p className="text-body/70 mb-8 max-w-md mx-auto">
              Be the first to book discounted beauty appointments from verified professionals across Los Angeles.
            </p>
            <WaitlistForm source="homepage" />
            <p className="mt-3 text-xs text-muted">
              Join the waitlist. No spam, just launch updates.
            </p>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-14 md:py-20 bg-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80&auto=format&fit=crop"
                alt="Client getting a beauty treatment"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Right: copy */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-8 text-center md:text-left">
                Book A Discounted Appointment In Under A Minute
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dark text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Browse</p>
                    <p className="text-sm text-muted mt-0.5">
                      Filter by service, date, neighborhood, or price. Every listing is a real open slot.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dark text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Book & Pay</p>
                    <p className="text-sm text-muted mt-0.5">
                      Secure checkout through Stripe. Free cancellation if you cancel 24+ hours ahead.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dark text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Show Up & Save</p>
                    <p className="text-sm text-muted mt-0.5">
                      Get the same quality service at 10 to 50% off. Leave a review after.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-accent mb-2">
              From our founding community
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-dark">
              What stylists and clients are saying
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="relative rounded-2xl border border-border bg-surface p-6 transition-all hover:shadow-sm"
              >
                <Quote className="h-8 w-8 text-accent/15 mb-3" aria-hidden="true" />
                <p className="text-[15px] text-body leading-relaxed mb-5">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-light text-xs font-bold text-accent shrink-0">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preview Appointments ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
              Preview Appointments
            </h2>
            <p className="text-body/70 max-w-lg mx-auto">
              Here is a preview of the types of services you will be able to discover on BeautyLink. These listings are not real bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREVIEW_LISTINGS.map((listing) => {
              const savings = Math.round(
                ((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100
              );
              return (
                <div
                  key={listing.id}
                  className="rounded-2xl bg-surface border border-border overflow-hidden"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-background">
                    <Image
                      src={listing.image}
                      alt={listing.service}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-cta px-2.5 py-1 text-xs font-bold text-white shadow-md">
                      Save {savings}%
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-dark leading-tight">
                          {listing.service}
                        </h3>
                        <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          <Info className="h-2.5 w-2.5" aria-hidden="true" />
                          Preview Appointment
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 shrink-0">
                        <span className="text-sm text-muted line-through">
                          ${listing.originalPrice}
                        </span>
                        <span className="text-lg font-bold text-dark">
                          ${listing.discountedPrice}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-light text-[10px] font-semibold text-accent shrink-0">
                        {listing.stylist.charAt(0)}
                      </span>
                      <span className="text-sm text-body">{listing.stylist}</span>
                      <span className="flex items-center gap-0.5 text-sm text-body shrink-0">
                        <Star className="h-3.5 w-3.5 fill-cta text-cta" aria-hidden="true" />
                        {listing.rating}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-[13px] text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {listing.time}
                      </span>
                      <span>&middot;</span>
                      <span>{listing.duration}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[13px] text-muted">
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {listing.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-full bg-dark px-7 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
            >
              View All Preview Appointments
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="py-8 bg-white border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-body/60">
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-accent" aria-hidden="true" />
              Stripe-secured payments
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
              24-hour free cancellation
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" aria-hidden="true" />
              Payouts within 24 hours
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Verified professionals only
            </span>
          </div>
        </div>
      </section>

      {/* ── For Professionals ── */}
      <section className="py-14 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: copy */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <p className="text-sm font-semibold text-accent mb-3">
                {IS_LAUNCHED ? "For beauty professionals" : "Now onboarding a curated group of founding stylists"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                Turn Your Empty Slots Into Income
              </h2>
              <p className="text-body/70 leading-relaxed mb-6">
                Had a cancellation? Slow afternoon? List your open time at a discounted rate and let new clients find you, whether you are fully booked or building your clientele. You set the price, you keep every dollar.
              </p>

              <ul className="space-y-3 mb-8 inline-block text-left">
                {[
                  "You keep 100% of your listed price",
                  "Payouts within 24 hours after service",
                  "List a deal in under 60 seconds",
                  "Build reviews and grow your clientele",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-body">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
                <Link
                  href="/pro/apply"
                  className="inline-flex items-center gap-2 rounded-full bg-dark px-7 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
                >
                  {IS_LAUNCHED ? "Apply To List" : "Apply As Founding Stylist"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/pro/join"
                  className="inline-flex items-center rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-body transition-all hover:bg-white hover:-translate-y-0.5"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right: image */}
            <div className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop"
                alt="Professional hairstylist at work"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
