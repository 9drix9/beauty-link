import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
} from "lucide-react";
import { IS_LAUNCHED } from "@/lib/launch";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "For Professionals",
  description:
    "Join BeautyLink as a beauty professional. Fill your empty chair, keep 100% of your listed price, and reach new clients in Los Angeles. Apply as a founding stylist today.",
  alternates: { canonical: "/pro/join" },
};

export default function JoinPage() {
  return (
    <>
    <MarketingNav />
    <main className="min-h-screen">
      {/* Hero — asymmetric, editorial */}
      <section className="gradient-hero-pro">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 px-4 py-16 md:py-24">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-accent mb-3">
              {IS_LAUNCHED ? "For beauty professionals" : "Now onboarding a curated group of founding stylists"}
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

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-10">
            How It Works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Apply",
                body: "Submit your info, portfolio, and service details. We review applications within 48 hours.",
              },
              {
                step: "2",
                title: "List Your Open Slots",
                body: "Post discounted appointments whenever you have availability. Set your own price, minimum 10% off your regular rate.",
              },
              {
                step: "3",
                title: "Get Booked and Paid",
                body: "Clients book and pay instantly. You receive your full listed price within 24 hours of the appointment.",
              },
            ].map((item, i) => (
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
                {i < 2 && <div className="border-l-2 border-border ml-4 h-4 mt-2" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 px-4 bg-background">
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

      {/* Requirements — brief */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-dark mb-6">
            Who Can Join
          </h2>
          <p className="text-body text-sm mb-4">
            If the services you provide help clients look or feel their best, you belong on BeautyLink. We welcome professionals across the beauty and self care industry including hair, nails, skincare, makeup, lashes, brows, and more.
          </p>
          <p className="text-body text-sm">
            Currently serving the Los Angeles area. More locations coming soon.
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
              : "Join founding stylists across LA who are filling open slots and reaching new clients."}
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
