"use client";

import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
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
        scrolled
          ? "glass glass-border shadow-sm"
          : "bg-white/0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                {PLATFORM_NAME}
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
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

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100/50 py-6 space-y-4 animate-fade-in">
            <Link
              href="/appointments"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Browse
            </Link>
            <Link
              href="/how-it-works"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              How it works
            </Link>
            <Link
              href="/auth/signup"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              For professionals
            </Link>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Link href="/auth/signin" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button size="sm" className="w-full">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
