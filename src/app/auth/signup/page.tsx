"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PLATFORM_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Search, Scissors } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [role, setRole] = useState<"CLIENT" | "PROFESSIONAL">("CLIENT");

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
              <span className="text-white text-lg font-bold">B</span>
            </div>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-1.5 text-[14px] text-gray-400">
            Join {PLATFORM_NAME} today
          </p>
        </div>

        <Card className="shadow-premium-lg">
          <CardContent className="space-y-5 pt-6">
            {/* Role toggle */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2.5">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("CLIENT")}
                  className={cn(
                    "rounded-xl border-2 p-4 text-center transition-all duration-200",
                    role === "CLIENT"
                      ? "border-brand-500 bg-brand-50/50 shadow-glow"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  )}
                >
                  <Search
                    className={cn(
                      "h-5 w-5 mx-auto mb-2 transition-colors",
                      role === "CLIENT" ? "text-brand-500" : "text-gray-300"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[13px] font-medium transition-colors",
                      role === "CLIENT" ? "text-brand-700" : "text-gray-500"
                    )}
                  >
                    Book appointments
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("PROFESSIONAL")}
                  className={cn(
                    "rounded-xl border-2 p-4 text-center transition-all duration-200",
                    role === "PROFESSIONAL"
                      ? "border-brand-500 bg-brand-50/50 shadow-glow"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  )}
                >
                  <Scissors
                    className={cn(
                      "h-5 w-5 mx-auto mb-2 transition-colors",
                      role === "PROFESSIONAL" ? "text-brand-500" : "text-gray-300"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[13px] font-medium transition-colors",
                      role === "PROFESSIONAL" ? "text-brand-700" : "text-gray-500"
                    )}
                  >
                    List my services
                  </span>
                </button>
              </div>
            </div>

            <Button variant="outline" className="w-full h-11" type="button">
              <svg className="h-4 w-4 mr-2.5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] uppercase tracking-wider font-medium text-gray-300">
                  or
                </span>
              </div>
            </div>

            <form className="space-y-4">
              <Input id="name" label="Full name" placeholder="Your name" />
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
              />
              <Input
                id="phone"
                label="Phone number"
                type="tel"
                placeholder="(310) 555-0123"
              />
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="At least 8 characters"
              />
              <Button className="w-full h-11" type="submit">
                {role === "CLIENT"
                  ? "Create account"
                  : "Create professional account"}
              </Button>
            </form>

            {role === "PROFESSIONAL" && (
              <p className="text-[12px] text-gray-400 text-center leading-relaxed">
                You&apos;ll need to complete verification (ID + license) before
                listing appointments.
              </p>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-[13px] text-center text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
