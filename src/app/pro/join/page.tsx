import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Users,
  Layers,
  DollarSign,
  Ban,
  Briefcase,
  Scissors,
  GraduationCap,
  MapPin,
  Star,
  Megaphone,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { IS_LAUNCHED } from "@/lib/launch";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "For Professionals",
  description:
    "Join BeautyLink as a beauty professional. Fill your empty chair, keep 100% of your listed price, and reach new clients in Los Angeles. Apply as a founding stylist today.",
  alternates: { canonical: "/pro/join" },
};

export default async function JoinPage() {
  let proCount = 0;
  try {
    proCount = await db.professionalProfile.count();
  } catch {
    // DB unavailable during build
  }
  const displayCount = Math.max(proCount, 12);

  return (
    <>
    <MarketingNav />
    <main className="min-h-screen">
      {/* Hero — asymmetric, editorial */}
      <section className="gradient-hero-pro">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 px-4 py-16 md:py-24">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-accent mb-3">
              {IS_LAUNCHED ? "For Beauty Professionals" : "Now Onboarding a Curated Group of Founding Stylists"}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-dark mb-6 leading-[1.1]">
              Fill your empty chair.
              <br />
              Keep every dollar.
            </h1>
            <p className="text-[17px] text-body/70 max-w-[460px] mx-auto md:mx-0 mb-2 leading-relaxed">
              Had a cancellation or a slow day? List your open appointments at a discounted rate and let new clients discover you.
            </p>
            <p className="text-[15px] text-body/60 max-w-[460px] mx-auto md:mx-0 mb-10">
              You set the price. You keep 100%.
            </p>
            <Link
              href="/pro/apply"
              className="inline-flex items-center gap-2 rounded-full bg-dark px-7 py-3.5 text-[15px] font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
            >
              {IS_LAUNCHED ? "Apply Now" : "Apply as Founding Stylist"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {!IS_LAUNCHED && (
              <p className="mt-4 text-xs text-body/50">
                Founding perks available to the first 100 stylists
              </p>
            )}
          </div>
          <div className="relative hidden md:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop"
                alt="Beauty professional styling a client's hair in a modern salon"
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        {/* Mobile image */}
        <div className="px-4 pb-10 md:hidden">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop"
              alt="Beauty professional at work"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Founding Stylist Perks (pre-launch only) */}
      {!IS_LAUNCHED && (
        <section className="py-14 px-4 bg-white border-b border-border/40">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-2">
              Founding Stylist Perks
            </h2>
            <p className="text-sm text-body/60 mb-10">
              The first 100 stylists who join BeautyLink will receive:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              {[
                {
                  icon: Star,
                  title: "Priority placement at launch",
                  body: "Your listings appear first when clients start browsing in May.",
                },
                {
                  icon: Megaphone,
                  title: "Early access to new clients",
                  body: "Be visible from day one as demand builds across Los Angeles.",
                },
                {
                  icon: BadgeCheck,
                  title: "Featured exposure on BeautyLink",
                  body: "Founding stylists receive highlighted placement and a profile badge.",
                },
                {
                  icon: ShieldCheck,
                  title: "Lifetime free membership",
                  body: "No platform fees, no monthly charges — now or ever.",
                },
              ].map((perk) => (
                <div
                  key={perk.title}
                  className="flex gap-3.5 rounded-xl border border-border bg-background/50 p-5"
                >
                  <perk.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-dark text-sm">{perk.title}</p>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{perk.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-body/50">
              Available to the first 100 stylists who join before launch.
            </p>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-10">
            How It Works
          </h2>
          <div className="space-y-6">
            {(IS_LAUNCHED
              ? [
                  { step: "1", title: "Apply", body: "Submit your info, portfolio, and service details. We review applications within 48 hours." },
                  { step: "2", title: "List Your Open Slots", body: "Post discounted appointments whenever you have availability. Set your own price, minimum 10% off your regular rate." },
                  { step: "3", title: "Get Booked and Paid", body: "Clients book and pay instantly. You receive your full listed price within 24 hours of the appointment." },
                ]
              : [
                  { step: "1", title: "Sign up and create your profile", body: "Tell us about yourself, your services, and where you work. Takes under 2 minutes." },
                  { step: "2", title: "Add your services, pricing, and photos", body: "Set up your service details, portfolio, and default pricing so everything is ready." },
                  { step: "3", title: "Set up your first listings", body: "Draft your opening listings now so they\u2019re ready to go live at launch." },
                  { step: "4", title: "Go live and start getting bookings", body: "When BeautyLink launches in May, your listings go live and clients can start booking." },
                ]
            ).map((item, i, arr) => (
              <div key={item.step}>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dark text-white text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{item.title}</p>
                    <p className="text-sm text-muted mt-0.5">{item.body}</p>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="border-l-2 border-border ml-4 h-4 mt-2" />}
              </div>
            ))}
          </div>
          {!IS_LAUNCHED && (
            <p className="mt-8 text-xs text-muted text-center">
              Join early to get set up before clients go live
            </p>
          )}
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-10 px-4 bg-background border-y border-border/40">
        <div className="max-w-3xl mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            {[
              { value: `${displayCount}+`, label: IS_LAUNCHED ? "Stylists Applied" : "Founding Stylists Applied", icon: Users },
              { value: "3,000+", label: "LA Clients on the Waitlist", icon: Users },
              { value: "8", label: "Service Categories", icon: Layers },
              { value: "100%", label: "Earnings Kept", icon: DollarSign },
              { value: "$0", label: "Monthly Fees", icon: Ban },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-5 w-5 text-accent mx-auto mb-1.5" aria-hidden="true" />
                <p className="text-xl font-bold text-dark">{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* What you get */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop"
              alt="Stylist working on client hair"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
              Built for beauty professionals at every stage
            </h2>
            <p className="text-sm text-body/70 mb-6">
              We&apos;re onboarding a curated group of Los Angeles-based professionals across all stages, from students to established stylists.
            </p>
            <ul className="space-y-4">
              {[
                { title: "Keep 100% of your listed price", body: "We charge clients a small service fee. Your earnings are yours." },
                { title: "Payouts within 24 hours", body: "Funds released the day after your appointment. Deposited via Stripe." },
                { title: "List a deal in under 60 seconds", body: "Pick your service, set a price, choose a time. You're live." },
                { title: "Build your reputation", body: "Collect verified reviews. Earn badges. Grow your repeat clientele." },
                { title: "Secure payments", body: "Stripe handles all transactions. PCI compliant. No chargebacks on your end." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Check className="h-5 w-5 text-success mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-dark text-sm">{item.title}</p>
                    <p className="text-sm text-muted mt-0.5">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Who's Joining */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-dark mb-2">
              {IS_LAUNCHED
                ? "Stylists across Los Angeles are signing up"
                : "Onboarding the first 100 founding stylists"}
            </h2>
            <p className="text-sm text-muted">
              {IS_LAUNCHED
                ? "Currently serving the Los Angeles area. More locations coming soon."
                : "Founding stylist spots are limited. Currently serving the Los Angeles area."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Scissors,
                title: "Independent stylists",
                body: "Fill empty slots between regulars without discounting on your main page.",
              },
              {
                icon: Briefcase,
                title: "Suite renters",
                body: "Turn dead hours into income — list openings in 30 seconds.",
              },
              {
                icon: GraduationCap,
                title: "Beauty students",
                body: "Build your portfolio with Model Calls and get real client experience.",
              },
              {
                icon: MapPin,
                title: "Mobile pros",
                body: "Post availability in any zone and get booked where you want to work.",
              },
            ].map((persona) => (
              <div
                key={persona.title}
                className="flex gap-3.5 rounded-xl border border-border bg-white p-5"
              >
                <persona.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-dark text-sm">{persona.title}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{persona.body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted mt-6">
            No contracts. No monthly fees. Apply in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-dark text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Your Empty Chair Is Costing You Money
          </h2>
          <p className="text-white/60 mb-8">
            {IS_LAUNCHED
              ? "Join beauty professionals across LA who are filling open slots and reaching new clients."
              : `${displayCount}+ founding stylists across LA are already filling open slots and reaching new clients.`}
          </p>
          <Link
            href="/pro/apply"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-dark transition-all hover:bg-white/90 hover:-translate-y-0.5"
          >
            {IS_LAUNCHED ? "Apply Now" : "Apply as Founding Stylist"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
