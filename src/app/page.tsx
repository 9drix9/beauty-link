"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICE_CATEGORIES, LAUNCH_ZONES } from "@/lib/constants";
import {
  Search,
  MapPin,
  ArrowRight,
  Star,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const STATS = [
  { value: "10,000+", label: "Appointments booked" },
  { value: "200+", label: "Verified professionals" },
  { value: "50+", label: "Neighborhoods" },
  { value: "4.9", label: "Average rating", icon: Star },
];

const REVIEWS = [
  {
    name: "Ashley M.",
    location: "UCLA / Westwood",
    rating: 5,
    text: "Found an amazing colorist with 30% off her normal price. The whole booking process took 30 seconds. Obsessed with this app.",
    service: "Balayage Highlights",
  },
  {
    name: "Jordan K.",
    location: "LMU / Westchester",
    rating: 5,
    text: "I got a gel mani for $35 that would normally cost $55. The salon was gorgeous and the artist was so talented. Will definitely book again.",
    service: "Gel Manicure",
  },
  {
    name: "Priya S.",
    location: "West Los Angeles",
    rating: 5,
    text: "Last-minute lash appointment before my event. Saved $50 and the results were incredible. This is the future of beauty booking.",
    service: "Lash Extensions",
  },
  {
    name: "Taylor R.",
    location: "UCLA / Westwood",
    rating: 5,
    text: "As a student on a budget, BeautyLink is a game-changer. Professional quality services at prices I can actually afford.",
    service: "Silk Press",
  },
];

const POPULAR_SERVICES = [
  { name: "Hair Salons", icon: "✂️", count: "80+ slots" },
  { name: "Nail Studios", icon: "💅", count: "65+ slots" },
  { name: "Lash Artists", icon: "👁️", count: "40+ slots" },
  { name: "Makeup Artists", icon: "💄", count: "35+ slots" },
  { name: "Facials & Skincare", icon: "✨", count: "30+ slots" },
  { name: "Brow Specialists", icon: "🪒", count: "20+ slots" },
];

export default function HomePage() {
  const [reviewIndex, setReviewIndex] = useState(0);

  const nextReview = () =>
    setReviewIndex((i) => (i + 1) % (REVIEWS.length - 1));
  const prevReview = () =>
    setReviewIndex((i) => (i === 0 ? REVIEWS.length - 2 : i - 1));

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-50/60 via-white to-white" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold tracking-tight text-gray-900 leading-[1.08]">
              Book local beauty services,{" "}
              <span className="text-gradient">for less</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-gray-500 max-w-xl mx-auto">
              Discover discounted, last-minute appointments from verified beauty
              professionals near you.
            </p>

            {/* Search bar */}
            <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 bg-white rounded-2xl sm:rounded-full border border-gray-200 shadow-premium-lg p-2 sm:p-1.5">
                <div className="flex items-center gap-2 flex-1 px-3 sm:px-4 py-2.5 sm:py-0">
                  <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Hair, nails, lashes, makeup..."
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <div className="hidden sm:block w-px bg-gray-200 my-2" />
                <div className="flex items-center gap-2 flex-1 px-3 sm:px-4 py-2.5 sm:py-0">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="West Los Angeles"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <Link href="/appointments">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto sm:rounded-full"
                  >
                    Search
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick category links */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {SERVICE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/appointments?category=${cat.value}`}
                  className="text-[13px] text-gray-500 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-full transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {stat.icon && (
                    <stat.icon className="h-5 w-5 fill-amber-400 text-amber-400" />
                  )}
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POPULAR SERVICES ============ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
                Popular near you
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Browse by service
              </h2>
            </div>
            <Link
              href="/appointments"
              className="hidden sm:flex items-center gap-1 text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {POPULAR_SERVICES.map((service) => (
              <Link
                key={service.name}
                href="/appointments"
                className="group relative bg-gray-50 hover:bg-white rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 border border-transparent hover:border-gray-100"
              >
                <span className="text-3xl sm:text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </span>
                <h3 className="text-sm font-semibold text-gray-900">
                  {service.name}
                </h3>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {service.count}
                </p>
              </Link>
            ))}
          </div>

          <Link
            href="/appointments"
            className="sm:hidden flex items-center justify-center gap-1 text-[13px] font-semibold text-brand-600 mt-6"
          >
            View all services
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-16 sm:py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto mb-10 sm:mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
              How it works
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Book in three simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            {[
              {
                step: "01",
                icon: Search,
                title: "Discover",
                desc: "Browse real-time discounted appointments from beauty professionals near you. Filter by service, price, and time.",
                gradient: "from-brand-500 to-rose-500",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "Book instantly",
                desc: "Choose your appointment, pay securely through the app, and get confirmed in seconds. No calls, no waiting.",
                gradient: "from-violet-500 to-brand-500",
              },
              {
                step: "03",
                icon: Shield,
                title: "Enjoy with confidence",
                desc: "Every provider is verified. Your payment is protected until the appointment is complete. Leave a review after.",
                gradient: "from-brand-500 to-purple-600",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-premium"
              >
                <span className="absolute -top-3 -right-1 text-[80px] sm:text-[100px] font-black text-gray-50 leading-none select-none pointer-events-none">
                  {item.step}
                </span>
                <div className="relative">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-glow mb-4 sm:mb-5`}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] sm:text-[14px] text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
                What clients say
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Loved by thousands
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={prevReview}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={nextReview}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Review cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {REVIEWS.slice(reviewIndex, reviewIndex + 3).map((review, i) => (
              <div
                key={`${review.name}-${i}`}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 animate-fade-in"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-5 pt-5 border-t border-gray-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center text-white text-sm font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">
                        {review.name}
                      </p>
                      <p className="text-[12px] text-gray-400">
                        {review.service} &middot; {review.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile nav */}
          <div className="flex sm:hidden items-center justify-center gap-2 mt-6">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ TRUST ============ */}
      <section className="py-16 sm:py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
                Trust & safety
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Every provider is verified
              </h2>
              <p className="mt-3 text-gray-500 text-[15px] leading-relaxed">
                We take trust seriously. Every beauty professional completes our
                verification process before listing their first appointment.
              </p>
              <ul className="mt-6 sm:mt-8 space-y-3">
                {[
                  "Government ID verification",
                  "Professional license check",
                  "Secure payment protection",
                  "Verified client reviews only",
                  "Dispute resolution support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-[14px] sm:text-[15px] text-gray-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/appointments">
                  <Button size="lg">
                    Browse verified professionals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-50 via-purple-50/50 to-violet-50 p-8 sm:p-12 aspect-square sm:aspect-auto sm:h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow-lg flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <p className="mt-4 text-lg sm:text-xl font-bold text-gray-900">
                    100% Verified
                  </p>
                  <p className="text-[13px] text-gray-400 mt-1">
                    ID + License confirmed
                  </p>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white rounded-xl shadow-premium-lg p-3 flex items-center gap-2 animate-fade-in">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[12px] font-bold text-gray-900">
                    4.9
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-white rounded-xl shadow-premium-lg p-3 flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-[12px] font-semibold text-gray-900">
                    Verified Provider
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BROWSE BY AREA ============ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto mb-8 sm:mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
              Local to you
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Browse by area
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LAUNCH_ZONES.map((zone) => (
              <Link
                key={zone}
                href={`/appointments?zone=${encodeURIComponent(zone)}`}
                className="group flex items-center justify-between bg-gray-50 hover:bg-white rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-premium border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                    <MapPin className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900">
                      {zone}
                    </h3>
                    <p className="text-[12px] text-gray-400">
                      Open appointments available
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROVIDER CTA ============ */}
      <section className="py-16 sm:py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-brand-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/20 via-transparent to-transparent" />

            <div className="relative grid lg:grid-cols-2 gap-8 p-6 sm:p-12 lg:p-16 items-center">
              <div className="text-center lg:text-left">
                <Badge className="bg-white/10 text-white border-0">
                  For Professionals
                </Badge>
                <h2 className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  Turn your empty slots into income
                </h2>
                <p className="mt-3 text-gray-400 text-base sm:text-lg leading-relaxed">
                  Join hundreds of beauty professionals already earning more on
                  BeautyLink. List your open appointments and reach new clients
                  instantly.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start listing for free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Clock,
                    title: "Paid in 24h",
                    desc: "Fast, reliable payouts via Stripe",
                  },
                  {
                    icon: Shield,
                    title: "Secure payments",
                    desc: "Protected by Stripe Connect",
                  },
                  {
                    icon: MapPin,
                    title: "Local clients",
                    desc: "Reach people in your area",
                  },
                  {
                    icon: Star,
                    title: "Build reputation",
                    desc: "Verified reviews build trust",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                  >
                    <item.icon className="h-5 w-5 text-brand-400 mb-2" />
                    <p className="text-[14px] font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
