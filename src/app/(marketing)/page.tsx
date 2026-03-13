import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Check,
} from "lucide-react";
import { LiveFeedPreview } from "@/components/shared/live-feed-preview";
import { WaitlistForm } from "@/components/shared/waitlist-form";
import { IS_LAUNCHED } from "@/lib/launch";

export const metadata = {
  title: "BeautyLink | Great Beauty. Better Prices.",
  description:
    "Discover open beauty appointments near you. Flexible timing, insider prices, and talented beauty professionals across hair, nails, lashes, makeup, skincare, and more at 10–50% off.",
};

export default function HomePage() {
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

            <h1 className="text-[2.75rem] leading-[1.05] md:text-[4.25rem] lg:text-[5rem] font-bold tracking-tight text-dark">
              Great Beauty.
              <br />
              <span className="text-accent">
                Better Prices.
              </span>
            </h1>

            <p className="mt-5 text-lg text-body/70 max-w-md mx-auto md:mx-0 leading-relaxed">
              Discover open beauty appointments near you. Flexible timing, insider prices, and talented beauty professionals across hair, nails, lashes, makeup, skincare, and more.
            </p>
            <p className="mt-2 text-lg text-body/70 max-w-md mx-auto md:mx-0 font-semibold">
              10–50% off all appointments.
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
                    href="/pro/apply"
                    className="inline-flex items-center gap-2.5 rounded-full bg-dark px-7 py-3.5 text-[15px] font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
                  >
                    Become a Founding Stylist
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/pro/join"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-7 py-3.5 text-[15px] font-semibold text-body transition-all hover:bg-white hover:-translate-y-0.5"
                  >
                    Learn More
                  </Link>
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F5] via-transparent to-transparent" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(235,160,110,0.4) 0%, rgba(196,97,74,0.18) 60%, rgba(160,90,60,0.1) 100%)", mixBlendMode: "multiply" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Deals (launched) or Waitlist (pre-launch) ── */}
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

            <LiveFeedPreview />

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/browse"
                className="text-sm font-semibold text-accent hover:underline"
              >
                View all appointments &rarr;
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-accent mb-3">
              Launching April 2026
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-dark mb-3">
              Client Bookings Open April 2026
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

      {/* ── How it works ── */}
      <section className="py-14 md:py-20 bg-background">
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
                Book a Discounted Appointment in Under a Minute
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
                    <p className="font-semibold text-dark">Book & pay</p>
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
                    <p className="font-semibold text-dark">Show up & save</p>
                    <p className="text-sm text-muted mt-0.5">
                      Get the same quality service at 10-50% off. Leave a review after.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Professionals ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: copy */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <p className="text-sm font-semibold text-accent mb-3">
                {IS_LAUNCHED ? "For beauty professionals" : "Now Onboarding Founding Stylists"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                Turn Your Empty Slots Into Income
              </h2>
              <p className="text-body/70 leading-relaxed mb-6">
                Had a cancellation? Slow afternoon? List your open time at a discounted rate and let new clients find you. You set the price, you keep every dollar.
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
                  {IS_LAUNCHED ? "Apply to list" : "Apply as Founding Stylist"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/pro/join"
                  className="inline-flex items-center rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-body transition-all hover:bg-background hover:-translate-y-0.5"
                >
                  Learn more
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

      {/* ── Final CTA ── */}
      <section className="py-16 md:py-24 bg-dark text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Great Beauty Shouldn&apos;t Cost Full Price
          </h2>
          <p className="text-white/60 mb-8">
            {IS_LAUNCHED
              ? "New appointments added daily from verified professionals across Los Angeles."
              : "Launching April 2026 with verified professionals across Los Angeles."}
          </p>
          <Link
            href={IS_LAUNCHED ? "/browse" : "/pro/apply"}
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-dark shadow-elevated transition-all hover:bg-white/90 hover:-translate-y-0.5"
          >
            {IS_LAUNCHED ? "Browse Appointments" : "Apply as Founding Stylist"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
