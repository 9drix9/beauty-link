import Link from "next/link";
import {
  Scissors,
  ArrowRight,
  Shield,
  Percent,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveFeedPreview } from "@/components/shared/live-feed-preview";

export const metadata = {
  title: "BeautyLink | Premium Beauty. Fraction of the Price.",
  description:
    "Save 15 to 50% on last-minute beauty appointments from verified professionals in Greater Los Angeles. Hair, nails, lashes, makeup, skincare. Book instantly.",
};

/* ── Floating cards that orbit the hero ── */
const floatingCards = [
  {
    title: "Gel Manicure",
    pro: "Jessica C.",
    detail: "Los Angeles",
    save: 27,
    color: "bg-accent-light",
    emoji: "💅",
    position: "top-[18%] left-[3%] md:left-[6%]",
    delay: "0s",
  },
  {
    title: "Hybrid Lash Set",
    pro: "Sofia R.",
    detail: "Today 2PM",
    save: 31,
    color: "bg-accent-muted",
    emoji: "✨",
    position: "top-[12%] right-[3%] md:right-[5%]",
    delay: "1s",
  },
  {
    title: "Full Color + Style",
    pro: "Marcus W.",
    detail: "Tomorrow",
    save: 28,
    color: "bg-cta-light",
    emoji: "💇",
    position: "bottom-[28%] left-[2%] md:left-[4%]",
    delay: "2s",
  },
  {
    title: "5.0 · 62 reviews",
    pro: "Verified Pro",
    detail: "LA",
    save: 0,
    color: "bg-success-light",
    emoji: "⭐",
    position: "bottom-[24%] right-[2%] md:right-[4%]",
    delay: "3s",
    isReview: true,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24">
        {/* Warm gradient background */}
        <div
          className="absolute inset-0 -z-10 gradient-hero-page"
          aria-hidden="true"
        />
        {/* Subtle radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Floating appointment cards — hidden on small mobile */}
        {floatingCards.map((card) => (
          <div
            key={card.title}
            className={`absolute ${card.position} hidden sm:flex items-center gap-3 rounded-xl bg-white/95 backdrop-blur-md px-4 py-3 shadow-elevated border border-white/80`}
            style={{
              animation: `float 6s ease-in-out infinite`,
              animationDelay: card.delay,
            }}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color} text-lg`}
            >
              {card.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-dark leading-tight">
                {card.title}
              </p>
              <p className="text-xs text-muted">
                {card.pro} &middot; {card.detail}
              </p>
            </div>
            {card.save > 0 && (
              <span className="ml-1 rounded-full bg-success px-2.5 py-0.5 text-[11px] font-bold text-white whitespace-nowrap">
                Save {card.save}%
              </span>
            )}
          </div>
        ))}

        {/* Center content */}
        <div className="relative max-w-3xl mx-auto text-center z-10">
          {/* Location pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 backdrop-blur-md px-4 py-2 text-sm text-body mb-8 shadow-card">
            <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
            Now Serving the Greater Los Angeles Area
          </div>

          {/* Heading — serif italic style */}
          <h1 className="text-[2.5rem] leading-[1.05] md:text-[4rem] lg:text-[4.5rem] font-bold tracking-tight text-dark">
            Great Beauty.
            <br />
            <span
              className="text-accent italic font-serif"
            >
              Better Prices.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base md:text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Book exclusive discounted appointments from trusted beauty
            professionals near you.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2.5 rounded-full bg-dark px-8 py-4 text-base font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:shadow-cardHover hover:-translate-y-0.5"
            >
              Browse Available Appointments
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Secondary link */}
          <p className="mt-5">
            <Link
              href="/pro/join"
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Are you a beauty pro? Join free &rarr;
            </Link>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="relative z-10 mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Verified professionals only
          </span>
          <span className="hidden sm:block h-5 w-px bg-border" />
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Up to 50% off standard rates
          </span>
          <span className="hidden sm:block h-5 w-px bg-border" />
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cta" />
            Pros keep 100% of their price
          </span>
        </div>
      </section>

      {/* ── Live Feed Preview ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                Available now
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-dark">
                Deals going fast
              </h2>
            </div>
            <Link
              href="/browse"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              View all deals
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <LiveFeedPreview />

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="primary" size="md">
              <Link href="/browse">Browse all deals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-3">
            Why BeautyLink
          </h2>
          <p className="text-center text-muted mb-12 max-w-md mx-auto">
            Real discounts. Real professionals. No gimmicks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: Percent,
                title: "Save 15 to 50%",
                body: "Every listing is a real discount on a real open slot. No inflated prices, no fake sales.",
              },
              {
                icon: Shield,
                title: "Reviewed pros",
                body: "Every professional is reviewed and approved. Licensed providers earn a verified badge.",
              },
              {
                icon: Star,
                title: "Book in seconds",
                body: "See the price, pick your slot, pay securely. No DMs, no back-and-forth.",
              },
              {
                icon: MapPin,
                title: "Hyperlocal",
                body: "Appointments from professionals in your neighborhood. Currently live across Greater LA.",
              },
            ].map((vp) => (
              <div key={vp.title} className="rounded-xl bg-white border border-border p-6 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-light">
                  <vp.icon
                    className="h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-base font-semibold text-dark">
                  {vp.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {vp.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stylist Promo Banner ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div
            className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-6 py-14 md:px-16 md:py-20 text-center gradient-card-warm"
          >
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-accent mb-6">
              <Scissors className="h-3 w-3" aria-hidden="true" />
              For Beauty Professionals
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-dark leading-tight">
              Your talent deserves
              <br />
              <span
                className="text-accent italic font-serif"
              >
                a full calendar.
              </span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-lg mx-auto">
              Turn empty slots into income. List your open appointments at a
              discounted rate, attract new clients in your area, and keep 100%
              of what you charge.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/pro/apply"
                className="inline-flex items-center gap-2 rounded-full bg-dark px-7 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
              >
                Start Listing Appointments
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/pro/join"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur-sm px-7 py-3.5 text-sm font-semibold text-body transition-all hover:bg-white hover:-translate-y-0.5"
              >
                Learn More
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">
                  100%
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Your price, your earnings
                </p>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">
                  24hr
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Fast payouts after service
                </p>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">
                  60s
                </p>
                <p className="text-xs text-muted mt-0.5">
                  List a deal in seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
