import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  DollarSign,
  Calendar,
  Users,
  Shield,
  Star,
  Zap,
} from "lucide-react";

export const metadata = { title: "For Professionals | BeautyLink" };

const requirements = [
  "Professional license recommended but not required (cosmetology, esthetics, nail tech, barbering, etc.)",
  "At least 3 portfolio photos showcasing your work",
  "Professional workspace (salon, suite, home studio, or mobile)",
  "Located in Greater Los Angeles (expanding soon)",
];

const benefits = [
  {
    icon: DollarSign,
    title: "Keep 100% of your price",
    body: "You set your discounted rate. Your earnings stay yours. We never take a cut from professionals.",
  },
  {
    icon: Calendar,
    title: "Fill your open slots",
    body: "Turn empty chairs into income. List last-minute or underbooked appointments and let new clients find you.",
  },
  {
    icon: Users,
    title: "Reach new clients",
    body: "Get discovered by clients in your area who are ready to book right now. No marketing budget needed.",
  },
  {
    icon: Shield,
    title: "Secure & reliable payments",
    body: "Payments processed through Stripe. Payouts released 24 hours after appointment completion.",
  },
  {
    icon: Star,
    title: "Build your reputation",
    body: "Collect verified reviews from real clients. Build trust and grow your repeat clientele over time.",
  },
  {
    icon: Zap,
    title: "Simple to use",
    body: "List a deal in under 60 seconds. Manage bookings, earnings, and messages from one dashboard.",
  },
];

export default function JoinPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero-pro">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-8 px-4 py-16 md:py-24">
          <div className="text-center md:text-left">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-accent mb-6">
              For Beauty Professionals
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-dark mb-4">
              Fill your empty chair.
              <br />
              Keep every dollar.
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-xl mx-auto md:mx-0 mb-8">
              List your open slots at a discount. Reach new clients in your area. You keep 100% of your listed price. Every dollar is yours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <Button variant="primary" size="xl" asChild>
                <Link href="/pro/apply">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop"
                alt="Beauty professional styling a client's hair in a modern salon"
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-white px-5 py-3 shadow-lg">
              <p className="text-xs text-muted">Turn open slots into</p>
              <p className="text-xl font-bold text-dark">Extra income</p>
            </div>
          </div>
        </div>
        {/* Mobile image — shown only on small screens */}
        <div className="px-4 pb-10 md:hidden">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop"
              alt="Beauty professional styling a client's hair in a modern salon"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-10">
            How it works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-semibold text-dark">Apply</h3>
                <p className="text-body mt-0.5">Submit your info and portfolio. We review applications within 48 hours.</p>
              </div>
            </div>
            <div className="border-l-2 border-accent/20 ml-5 h-4" />
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-semibold text-dark">List your deals</h3>
                <p className="text-body mt-0.5">Post discounted appointments anytime you have open slots. Set your own price, minimum 15% off your regular rate.</p>
              </div>
            </div>
            <div className="border-l-2 border-accent/20 ml-5 h-4" />
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="text-base font-semibold text-dark">Get booked & paid</h3>
                <p className="text-body mt-0.5">Clients book and pay instantly. You get paid within 24 hours after the appointment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-10">
            Why professionals love BeautyLink
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl bg-white p-6 shadow-card"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-light">
                  <benefit.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-dark">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-dark mb-6 text-center">
            Requirements
          </h2>
          <ul className="space-y-3">
            {requirements.map((req) => (
              <li key={req} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-body">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-accent text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to grow your business?
          </h2>
          <p className="text-accent-light/90 mb-8">
            Join beauty professionals across Greater LA who are filling their empty slots and reaching new clients with BeautyLink.
          </p>
          <Button variant="cta" size="xl" asChild>
            <Link href="/pro/apply">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
