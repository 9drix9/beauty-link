"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Browse", href: "/browse" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "Messages", href: "/messages" },
];

export function CustomerNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-xl font-bold text-purple-primary">
          BeautyLink
        </Link>

        {/* Search bar - center */}
        <div className="mx-4 hidden flex-1 md:block">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search services, salons..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-body placeholder:text-muted transition-colors focus:border-purple-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/20"
            />
          </div>
        </div>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-primary",
                  pathname.startsWith(link.href)
                    ? "text-purple-primary"
                    : "text-body"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop user button */}
        <div className="hidden md:block">
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Mobile hamburger */}
        <button
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-body transition-colors hover:bg-gray-100 md:hidden"
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
              {/* Mobile search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search services, salons..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-body placeholder:text-muted focus:border-purple-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/20"
                />
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                    pathname.startsWith(link.href)
                      ? "text-purple-primary"
                      : "text-body"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-3">
                <div className="flex items-center gap-3 px-3">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm text-muted">Account</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
