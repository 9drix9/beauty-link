"use client";

import { PLATFORM_NAME } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import { FloatingElement } from "@/components/ui/floating-element";
import { TiltCard } from "@/components/ui/tilt-card";

const trustItems = [
  "ID and selfie verification",
  "Professional license verification",
  "Secure payment held until completion",
  "Verified reviews from real bookings only",
  "24/7 support for disputes",
];

export function TrustSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
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
              Every beauty professional on {PLATFORM_NAME} goes through a
              rigorous verification process before they can list a single
              appointment.
            </p>
            <ul className="mt-8 space-y-4">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-[15px] text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3D trust visual */}
          <div className="relative h-[450px] perspective-2000">
            {/* Main shield card */}
            <TiltCard
              className="absolute inset-0 flex items-center justify-center"
              tiltAmount={12}
              scaleOnHover={1.02}
            >
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-brand-50 via-purple-50/50 to-violet-50 flex items-center justify-center relative overflow-hidden">
                {/* Animated rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[250px] h-[250px] rounded-full border border-brand-100/60 animate-pulse-ring" />
                  <div
                    className="absolute w-[350px] h-[350px] rounded-full border border-purple-100/40 animate-pulse-ring"
                    style={{ animationDelay: "1s" }}
                  />
                  <div
                    className="absolute w-[450px] h-[450px] rounded-full border border-violet-100/20 animate-pulse-ring"
                    style={{ animationDelay: "2s" }}
                  />
                </div>

                {/* Center shield */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow-lg flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
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
            </TiltCard>

            {/* Floating verification badge */}
            <FloatingElement
              className="absolute -bottom-2 -left-4 z-20"
              duration={6}
              delay={0}
              distance={12}
              rotation={3}
            >
              <div className="bg-white rounded-2xl shadow-premium-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">
                    Verified Provider
                  </p>
                  <p className="text-[11px] text-gray-400">
                    License + ID confirmed
                  </p>
                </div>
              </div>
            </FloatingElement>

            {/* Floating star rating */}
            <FloatingElement
              className="absolute -top-2 -right-2 z-20"
              duration={7}
              delay={1.5}
              distance={15}
              rotation={5}
            >
              <div className="bg-white rounded-2xl shadow-premium-lg p-3 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[13px] font-bold text-gray-900">4.9</span>
              </div>
            </FloatingElement>

            {/* Floating secure badge */}
            <FloatingElement
              className="absolute top-[40%] -right-6 z-20"
              duration={8}
              delay={0.8}
              distance={10}
              rotation={4}
            >
              <div className="bg-white rounded-2xl shadow-premium-lg p-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-brand-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>
                <span className="text-[12px] font-semibold text-gray-700">
                  Secure Pay
                </span>
              </div>
            </FloatingElement>
          </div>
        </div>
      </div>
    </section>
  );
}
