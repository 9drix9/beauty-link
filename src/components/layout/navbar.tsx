"use client";

import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass glass-border shadow-sm" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-bold">B</span>
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
                {PLATFORM_NAME}
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-7">
              <Link
                href="/appointments"
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/how-it-works"
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                How it works
              </Link>
              <Link
                href="/auth/signup"
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                For professionals
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100/50 py-4 space-y-1 animate-fade-in">
            <Link
              href="/appointments"
              className="block text-[15px] font-medium text-gray-700 py-2.5 px-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse appointments
            </Link>
            <Link
              href="/how-it-works"
              className="block text-[15px] font-medium text-gray-700 py-2.5 px-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="/auth/signup"
              className="block text-[15px] font-medium text-gray-700 py-2.5 px-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              For professionals
            </Link>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Link href="/auth/signin" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button size="sm" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
