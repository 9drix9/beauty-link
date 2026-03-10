"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";


const navLinks = [
  { label: "Browse", href: "/browse" },
  { label: "For Professionals", href: "/pro/join" },
];

export function MarketingNav() {
  const { isSignedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-dark">
          BeautyLink
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-body transition-colors hover:text-dark"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          {isSignedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/browse">Dashboard</Link>
              </Button>
              <UserButton />
            </>
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
          className="inline-flex items-center justify-center rounded-lg p-2 text-body transition-colors hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-body transition-colors hover:bg-gray-100 hover:text-dark"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-3">
                {isSignedIn ? (
                  <div className="flex items-center gap-3 px-3">
                    <Link
                      href="/browse"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-accent"
                    >
                      Dashboard
                    </Link>
                    <UserButton />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button variant="primary" asChild>
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
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
