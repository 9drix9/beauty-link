"use client";

import { PLATFORM_NAME } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import { FloatingElement } from "@/components/ui/floating-element";

const trustItems = [
  "ID and selfie verification",
  "Professional license verification",
  "Secure payment held until completion",
  "Verified reviews from real bookings only",
  "24/7 support for disputes",
];

export function TrustSection() {
  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Copy - shown first on mobile */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
              Trust & Safety
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Your safety is non-negotiable
            </h2>
            <p className="mt-3 text-gray-500 leading-relaxed text-[15px]">
              Every beauty professional on {PLATFORM_NAME} goes through a
              rigorous verification process before they can list a single
              appointment.
            </p>
            <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-left max-w-sm mx-auto lg:mx-0">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-[14px] sm:text-[15px] text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual - shown second on mobile (below copy) */}
          <div className="relative h-[280px] sm:h-[350px] lg:h-[420px] order-1 lg:order-2">
            {/* Background shape */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-50 via-purple-50/50 to-violet-50 flex items-center justify-center overflow-hidden">
              {/* Animated rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] rounded-full border border-brand-100/50 animate-pulse-ring" />
                <div
                  className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full border border-purple-100/30 animate-pulse-ring"
                  style={{ animationDelay: "1.5s" }}
                />
              </div>

              {/* Center shield */}
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating badge - bottom left */}
            <FloatingElement
              className="absolute -bottom-3 left-2 sm:left-4 z-20"
              duration={6}
              delay={0}
              distance={10}
              rotation={2}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-premium-lg p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[12px] sm:text-[13px] font-semibold text-gray-900">
                    Verified Provider
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400">
                    License + ID confirmed
                  </p>
                </div>
              </div>
            </FloatingElement>

            {/* Floating stars - top right */}
            <FloatingElement
              className="absolute -top-2 right-2 sm:right-4 z-20"
              duration={7}
              delay={1.5}
              distance={12}
              rotation={3}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-premium-lg p-2.5 sm:p-3 flex items-center gap-1.5 sm:gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[12px] sm:text-[13px] font-bold text-gray-900">4.9</span>
              </div>
            </FloatingElement>
          </div>
        </div>
      </div>
    </section>
  );
}
