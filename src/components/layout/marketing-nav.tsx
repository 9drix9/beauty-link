"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Browse Appointments", href: "/browse" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Professionals", href: "/pro/join", accent: true },
];

const authedLinks = [
  { label: "Dashboard", href: "/my-bookings" },
  { label: "My Listings", href: "/pro/appointments" },
];

export function MarketingNav() {
  const { isSignedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allLinks = isSignedIn ? [...navLinks, ...authedLinks] : navLinks;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-border/40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold shrink-0 text-gradient">
          BeautyLink
        </Link>

        {/* Desktop nav links — centered */}
        <ul className="hidden items-center gap-8 lg:flex">
          {allLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  "accent" in link && link.accent
                    ? "text-accent"
                    : "text-body"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 lg:flex shrink-0">
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button variant="primary" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-body transition-colors hover:bg-white/50 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/20 bg-white/90 backdrop-blur-lg lg:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent-light/50 ${
                    "accent" in link && link.accent
                      ? "text-accent"
                      : "text-body hover:text-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-3 mt-2">
                {isSignedIn ? (
                  <div className="flex items-center gap-3 px-3">
                    <UserButton />
                    <span className="text-sm text-muted">Account</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                      >
                        Log In
                      </Link>
                    </Button>
                    <Button variant="primary" asChild>
                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
