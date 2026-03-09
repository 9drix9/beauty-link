import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { Shield, Clock, MapPin, ArrowRight } from "lucide-react";
import { Hero3DScene } from "@/components/ui/hero-3d";
import { HowItWorksTilt } from "@/components/home/how-it-works-tilt";
import { TrustSection } from "@/components/home/trust-section";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-white to-white" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-brand-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Copy */}
            <div className="animate-fade-in-up text-center lg:text-left">
              <Badge variant="premium" className="mb-5">
                Now live in West Los Angeles
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Last-minute beauty,{" "}
                <span className="text-gradient">unbeatable prices</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Book discounted beauty appointments from verified professionals
                near you. Real-time inventory. Real savings.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center lg:justify-start">
                <Link href="/appointments">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse appointments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    I&apos;m a professional
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[
                    "from-pink-400 to-rose-400",
                    "from-violet-400 to-purple-400",
                    "from-amber-400 to-orange-400",
                    "from-emerald-400 to-teal-400",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-white`}
                    />
                  ))}
                </div>
                <p className="text-[13px] text-gray-400">
                  <span className="font-semibold text-gray-600">200+</span>{" "}
                  booked in West LA
                </p>
              </div>
            </div>

            {/* 3D Scene - visible on mobile too, just smaller */}
            <div className="relative h-[280px] sm:h-[350px] lg:h-[480px] mx-auto w-full max-w-[400px] lg:max-w-none">
              <Hero3DScene />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
              Categories
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Find your service
            </h2>
          </div>
          <div className="mt-8 sm:mt-12 grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
            {SERVICE_CATEGORIES.map((cat) => {
              const icons: Record<string, string> = {
                HAIR: "✂️",
                NAILS: "💅",
                LASHES: "👁️",
                MAKEUP: "💄",
                SKINCARE_FACIALS: "✨",
              };
              const gradients: Record<string, string> = {
                HAIR: "from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100",
                NAILS: "from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100",
                LASHES: "from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100",
                MAKEUP: "from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100",
                SKINCARE_FACIALS:
                  "from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100",
              };

              return (
                <Link
                  key={cat.value}
                  href={`/appointments?category=${cat.value}`}
                  className={`group flex flex-col items-center gap-2 sm:gap-4 rounded-2xl bg-gradient-to-br ${
                    gradients[cat.value] || ""
                  } p-4 sm:p-8 transition-all duration-300 hover:shadow-premium hover:-translate-y-1`}
                >
                  <span className="text-2xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">
                    {icons[cat.value] || "✨"}
                  </span>
                  <span className="text-[11px] sm:text-sm font-medium text-gray-700">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorksTilt />

      {/* Trust */}
      <TrustSection />

      {/* Provider CTA */}
      <section className="py-16 sm:py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-brand-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/20 via-transparent to-transparent" />

            <div className="relative p-6 sm:p-12 lg:p-20">
              <div className="max-w-xl mx-auto text-center lg:text-left lg:mx-0">
                <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm">
                  For Professionals
                </Badge>
                <h2 className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  Turn empty chairs into revenue
                </h2>
                <p className="mt-3 text-gray-400 text-base sm:text-lg leading-relaxed">
                  List your open slots at a discount, reach new clients, and earn
                  from time that would otherwise go to waste.
                </p>
                <div className="mt-6 sm:mt-8">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start listing your slots
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                  {[
                    { icon: MapPin, label: "West LA launch zone" },
                    { icon: Shield, label: "Secure Stripe payouts" },
                    { icon: Clock, label: "Paid within 24 hours" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 justify-center lg:justify-start">
                      <item.icon className="h-4 w-4 text-brand-400 flex-shrink-0" />
                      <span className="text-[12px] sm:text-[13px] text-gray-400">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
