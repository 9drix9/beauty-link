import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICE_CATEGORIES, PLATFORM_NAME } from "@/lib/constants";
import { Sparkles, Shield, Clock, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-white to-white" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-36 lg:py-44">
          <div className="max-w-2xl animate-fade-in-up">
            <Badge variant="premium" className="mb-6">
              Now live in West Los Angeles
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08]">
              Last-minute beauty,{" "}
              <span className="text-gradient">unbeatable prices</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-lg leading-relaxed">
              Book discounted beauty appointments from verified professionals near you. Real-time inventory. Real savings.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href="/appointments">
                <Button size="lg" className="w-full sm:w-auto text-[15px]">
                  Browse appointments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-[15px]">
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
                <span className="font-semibold text-gray-600">200+</span> appointments booked in West LA
              </p>
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
                SKINCARE_FACIALS: "from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100",
              };

              return (
                <Link
                  key={cat.value}
                  href={`/appointments?category=${cat.value}`}
                  className={`group flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br ${
                    gradients[cat.value] || ""
                  } p-8 transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5`}
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

      {/* How it works */}
      <section className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
              Simple process
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              How {PLATFORM_NAME} works
            </h2>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Clock,
                title: "Browse open slots",
                description:
                  "See real-time discounted appointments from beauty professionals near you, sorted by soonest availability.",
                step: "01",
              },
              {
                icon: Sparkles,
                title: "Book instantly",
                description:
                  "Pay securely through the platform. Get confirmed in seconds with all the details you need.",
                step: "02",
              },
              {
                icon: Shield,
                title: "Trust guaranteed",
                description:
                  "Every provider is ID-verified and license-checked. Payment is held until your appointment is complete.",
                step: "03",
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.2em] text-gray-300 uppercase">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-[14px] text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
                Trust & Safety
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Your safety is non-negotiable
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Every beauty professional on {PLATFORM_NAME} goes through a rigorous verification process before they can list a single appointment.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "ID and selfie verification",
                  "Professional license verification",
                  "Secure payment held until completion",
                  "Verified reviews from real bookings only",
                  "24/7 support for disputes",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-[15px] text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand-100 via-purple-50 to-violet-100 flex items-center justify-center">
                <Shield className="h-24 w-24 text-brand-300" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-premium-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">Verified Provider</p>
                  <p className="text-[11px] text-gray-400">License + ID confirmed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient background */}
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
                  List your open slots at a discount, reach new clients, and earn from time that would otherwise go to waste.
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
                      <span className="text-[12px] text-gray-400">{item.label}</span>
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
