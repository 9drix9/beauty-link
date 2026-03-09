"use client";

import { TiltCard } from "@/components/ui/tilt-card";
import { PLATFORM_NAME } from "@/lib/constants";
import { Clock, Sparkles, Shield } from "lucide-react";

const steps = [
  {
    icon: Clock,
    title: "Browse open slots",
    description:
      "See real-time discounted appointments from beauty professionals near you, sorted by soonest availability.",
    step: "01",
    gradient: "from-brand-500 to-rose-500",
  },
  {
    icon: Sparkles,
    title: "Book instantly",
    description:
      "Pay securely through the platform. Get confirmed in seconds with all the details you need.",
    step: "02",
    gradient: "from-violet-500 to-brand-500",
  },
  {
    icon: Shield,
    title: "Trust guaranteed",
    description:
      "Every provider is ID-verified and license-checked. Payment is held until your appointment is complete.",
    step: "03",
    gradient: "from-brand-500 to-purple-600",
  },
];

export function HowItWorksTilt() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-lg mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
            Simple process
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            How {PLATFORM_NAME} works
          </h2>
        </div>
        <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 lg:gap-10 md:grid-cols-3">
          {steps.map((item) => (
            <TiltCard
              key={item.step}
              tiltAmount={8}
              scaleOnHover={1.03}
              glareEnabled={true}
            >
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-premium h-full relative overflow-hidden">
                {/* Background number */}
                <span className="absolute -top-2 -right-1 text-[80px] sm:text-[120px] font-black text-gray-50 leading-none select-none pointer-events-none">
                  {item.step}
                </span>

                <div className="relative">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-glow flex-shrink-0`}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.2em] text-gray-300 uppercase">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] sm:text-[14px] text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
