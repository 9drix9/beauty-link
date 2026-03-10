import Link from "next/link";
import {
  Scissors,
  Paintbrush,
  Sparkles,
  Eye,
  PenTool,
  Droplets,
  Grid,
  ArrowRight,
  Shield,
  Clock,
  Percent,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/shared/hero-search";
import { LiveFeedPreview } from "@/components/shared/live-feed-preview";

export const metadata = {
  title: "BeautyLink — Discounted Beauty Appointments Near You",
  description:
    "Save 15–50% on last-minute beauty appointments from beauty professionals in Greater Los Angeles. Hair, nails, lashes, makeup, skincare — book instantly.",
};

const categories = [
  { label: "Hair", value: "HAIR", icon: Scissors, color: "text-accent", bg: "bg-accent-light" },
  { label: "Nails", value: "NAILS", icon: Paintbrush, color: "text-cta", bg: "bg-cta-light" },
  { label: "Makeup", value: "MAKEUP", icon: Sparkles, color: "text-pink-600", bg: "bg-pink-50" },
  { label: "Lashes", value: "LASHES", icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Brows", value: "BROWS", icon: PenTool, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Spa", value: "SKINCARE", icon: Droplets, color: "text-green-600", bg: "bg-green-50" },
  { label: "All Services", value: "", icon: Grid, color: "text-gray-600", bg: "bg-gray-100" },
];

const valueProps = [
  {
    icon: Percent,
    title: "Save 15–50%",
    body: "Every listing is a real discount on a real open slot. No inflated prices, no fake sales.",
  },
  {
    icon: Shield,
    title: "Reviewed pros",
    body: "Every professional is reviewed and approved before they can list on BeautyLink. Licensed providers earn a verified badge.",
  },
  {
    icon: Clock,
    title: "Book in seconds",
    body: "See the price, pick your slot, pay securely. No DMs, no back-and-forth, no surprises.",
  },
  {
    icon: MapPin,
    title: "Hyperlocal",
    body: "Appointments from professionals in your neighborhood. Currently live across Greater LA.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-white pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-light/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cta-light/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" aria-hidden="true" />

        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Live deals near you
            </p>

            <h1 className="text-[2.5rem] leading-[1.1] md:text-[3.5rem] font-bold text-dark tracking-tight">
              Last-minute beauty,
              <br />
              <span className="text-accent">first-class savings</span>
            </h1>

            <p className="mt-5 text-lg text-muted max-w-md mx-auto leading-relaxed">
              Discounted appointments from beauty pros in Greater Los Angeles. Book open slots before they&apos;re gone.
            </p>

            <div className="mt-8">
              <HeroSearch />
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                Reviewed pros
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <Percent className="h-3.5 w-3.5 text-cta" aria-hidden="true" />
                15–50% off
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Instant booking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Filter Navigation ── */}
      <section className="py-3 bg-white border-b border-border sticky top-[57px] z-40">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-center gap-2 px-4 min-w-max mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.value ? `/browse?category=${cat.value}` : "/browse"}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-4 py-2 text-sm font-medium text-body transition-all hover:border-accent hover:text-accent hover:bg-accent-light/50"
              >
                <cat.icon className={`h-4 w-4 ${cat.color}`} aria-hidden="true" />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Feed Preview ── */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cta mb-1">Available now</p>
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
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-3">
            Why BeautyLink
          </h2>
          <p className="text-center text-muted mb-10 max-w-md mx-auto">
            Real discounts. Real professionals. No gimmicks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {valueProps.map((vp) => (
              <div key={vp.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-card">
                  <vp.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-dark">{vp.title}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{vp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stylist Promo Banner ── */}
      <section className="py-12 md:py-16 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-accent-light via-white to-cta-light border border-border/60 shadow-card">
            {/* Decorative blobs */}
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-accent/5 blur-2xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cta/5 blur-2xl pointer-events-none" aria-hidden="true" />

            <div className="relative grid md:grid-cols-5 items-center gap-6 md:gap-0">
              {/* Content */}
              <div className="md:col-span-3 px-6 pt-10 pb-6 md:px-10 md:py-12">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-4">
                  <Scissors className="h-3 w-3" aria-hidden="true" />
                  For Professionals
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-dark leading-tight">
                  Fill your empty chair.
                  <br />
                  <span className="text-accent">Keep every dollar.</span>
                </h2>
                <p className="mt-3 text-muted leading-relaxed max-w-md">
                  List open slots at a discount, reach new clients nearby, and keep 100% of your listed price. We only charge customers a 5% service fee.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-start gap-3">
                  <Button asChild variant="cta" size="lg">
                    <Link href="/pro/apply">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/pro/join">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Stats side */}
              <div className="md:col-span-2 flex md:flex-col items-center justify-center gap-4 px-6 pb-8 md:px-8 md:py-12 md:border-l md:border-border/60">
                <div className="flex-1 md:flex-none text-center rounded-xl bg-white/80 shadow-soft px-5 py-4 w-full">
                  <p className="text-2xl md:text-3xl font-bold text-accent">100%</p>
                  <p className="text-xs text-muted mt-0.5">Your price, your earnings</p>
                </div>
                <div className="flex-1 md:flex-none text-center rounded-xl bg-white/80 shadow-soft px-5 py-4 w-full">
                  <p className="text-2xl md:text-3xl font-bold text-cta">24hr</p>
                  <p className="text-xs text-muted mt-0.5">Fast payouts after service</p>
                </div>
                <div className="hidden sm:block flex-1 md:flex-none text-center rounded-xl bg-white/80 shadow-soft px-5 py-4 w-full">
                  <p className="text-2xl md:text-3xl font-bold text-success">60s</p>
                  <p className="text-xs text-muted mt-0.5">List a deal in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
