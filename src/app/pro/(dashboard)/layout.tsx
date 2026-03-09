"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  DollarSign,
  UserCircle,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { label: "Dashboard", href: "/pro/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/pro/appointments", icon: Calendar },
  { label: "Messages", href: "/pro/messages", icon: MessageSquare },
  { label: "Earnings", href: "/pro/earnings", icon: DollarSign },
  { label: "Profile", href: "/pro/profile", icon: UserCircle },
];

export default function ProDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden flex-col border-r border-border bg-accent text-white transition-all duration-300 md:flex",
          sidebarCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          {!sidebarCollapsed && (
            <Link href="/pro/dashboard" className="text-lg font-bold">
              BeautyLink
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                sidebarCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Sidebar nav */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                  sidebarCollapsed && "justify-center px-0"
                )}
                title={sidebarCollapsed ? link.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/10 p-4">
          <div
            className={cn(
              "flex items-center gap-3",
              sidebarCollapsed && "justify-center"
            )}
          >
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
            {!sidebarCollapsed && (
              <span className="text-sm text-white/70">Account</span>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top nav */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-body transition-colors hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/pro/dashboard" className="text-lg font-bold text-accent">
            BeautyLink
          </Link>

          <UserButton afterSignOutUrl="/" />
        </header>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black md:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-accent text-white md:hidden"
              >
                <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
                  <span className="text-lg font-bold">BeautyLink</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 space-y-1 px-2 py-4">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                        },
                      }}
                    />
                    <span className="text-sm text-white/70">Account</span>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
