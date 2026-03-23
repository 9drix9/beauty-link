"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Scissors } from "lucide-react";

export function RoleSelector() {
  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-dark">
          Welcome to BeautyLink
        </h1>
        <p className="text-sm text-muted">
          How would you like to use BeautyLink?
        </p>
      </div>

      <div className="space-y-3">
        {/* Customer Card */}
        <Link
          href="/signup"
          className="group flex items-center gap-4 rounded-2xl border-2 border-border bg-white p-5 transition-all hover:border-accent hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-light shrink-0">
            <Sparkles className="h-6 w-6 text-accent" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-dark text-base">
              BeautyLink for customers
            </p>
            <p className="text-sm text-muted mt-0.5">
              Book beauty appointments near you
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted group-hover:text-accent transition-colors shrink-0" aria-hidden="true" />
        </Link>

        {/* Professional Card */}
        <Link
          href="/signup?intent=pro"
          className="group flex items-center gap-4 rounded-2xl border-2 border-border bg-white p-5 transition-all hover:border-accent hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-light shrink-0">
            <Scissors className="h-6 w-6 text-accent" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-dark text-base">
              BeautyLink for professionals
            </p>
            <p className="text-sm text-muted mt-0.5">
              Fill open slots &amp; grow your business
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted group-hover:text-accent transition-colors shrink-0" aria-hidden="true" />
        </Link>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
