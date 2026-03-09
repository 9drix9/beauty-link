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
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-white to-white" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - copy */}
            <div className="animate-fade-in-up">
              <Badge variant="premium" className="mb-6">
                Now live in West Los Angeles
              </Badge>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08]">
                Last-minute beauty,{" "}
                <span className="text-gradient">unbeatable prices</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-lg leading-relaxed">
                Book discounted beauty appointments from verified professionals
                near you. Real-time inventory. Real savings.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link href="/appointments">
                  <Button size="lg" className="w-full sm:w-auto text-[15px]">
                    Browse appointments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-[15px]"
                  >
                    I&apos;m a professional
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[
                    "from-pink-400 to-rose-400",
                    "from-violet-400 to-purple-400",
                    "from-amber-400 to-orange-400",
                    "from-emerald-400 to-teal-400",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} border-2 border-white`}
                    />
                  ))}
                </div>
                <p className="text-[13px] text-gray-400">
                  <span className="font-semibold text-gray-600">200+</span>{" "}
                  appointments booked in West LA
                </p>
              </div>
            </div>

            {/* Right - 3D Scene */}
            <div className="hidden lg:block relative h-[520px]">
              <Hero3DScene />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
              Categories
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Find your service
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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
                  className={`group flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br ${
                    gradients[cat.value] || ""
                  } p-8 transition-all duration-300 hover:shadow-premium hover:-translate-y-1`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {icons[cat.value] || "✨"}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works - 3D tilt cards */}
      <HowItWorksTilt />

      {/* Trust section with 3D */}
      <TrustSection />

      {/* Provider CTA */}
      <section className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-brand-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/20 via-transparent to-transparent" />

            <div className="relative p-10 sm:p-16 lg:p-20">
              <div className="max-w-xl">
                <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm">
                  For Professionals
                </Badge>
                <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Turn empty chairs into revenue
                </h2>
                <p className="mt-4 text-gray-400 text-lg leading-relaxed">
                  List your open slots at a discount, reach new clients, and earn
                  from time that would otherwise go to waste.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start listing your slots
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-6">
                  {[
                    { icon: MapPin, label: "West LA launch zone" },
                    { icon: Shield, label: "Secure Stripe payouts" },
                    { icon: Clock, label: "Paid within 24 hours" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-brand-400 flex-shrink-0" />
                      <span className="text-[12px] text-gray-400">
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
