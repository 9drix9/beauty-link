"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  DollarSign,
  UserCircle,
  Menu,
  X,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { BeautyLinkLogo } from "@/components/ui/beautylink-logo";

const sidebarLinks = [
  { label: "Dashboard", href: "/pro/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/pro/appointments", icon: Calendar },
  { label: "Templates", href: "/pro/templates", icon: FileText },
  { label: "Messages", href: "/pro/messages", icon: MessageSquare },
  { label: "Earnings", href: "/pro/earnings", icon: DollarSign },
  { label: "Edit Profile", href: "/pro/settings", icon: UserCircle },
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
          "hidden flex-col border-r border-border bg-white transition-all duration-300 md:flex",
          sidebarCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!sidebarCollapsed && (
            <Link href="/pro/dashboard">
              <BeautyLinkLogo className="text-lg text-accent" badge="Pro" />
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-dark"
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
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent-light text-accent"
                    : "text-muted hover:bg-background hover:text-dark",
                  sidebarCollapsed && "justify-center px-0"
                )}
                title={sidebarCollapsed ? link.label : undefined}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-accent" />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border p-4 space-y-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-dark",
              sidebarCollapsed && "justify-center px-0"
            )}
            title={sidebarCollapsed ? "Back to main site" : undefined}
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Back to main site</span>}
          </Link>
          <div
            className={cn(
              "flex items-center gap-3",
              sidebarCollapsed && "justify-center"
            )}
          >
            <UserButton
                           appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
            {!sidebarCollapsed && (
              <span className="text-sm text-muted">Account</span>
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
            className="rounded-lg p-2 text-body transition-colors hover:bg-background"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/pro/dashboard">
            <BeautyLinkLogo className="text-lg text-accent" />
          </Link>

          <UserButton />
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
                className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white md:hidden"
              >
                <div className="flex h-14 items-center justify-between border-b border-border px-4">
                  <BeautyLinkLogo className="text-lg text-accent" badge="Pro" />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-dark"
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
                          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-accent-light text-accent"
                            : "text-muted hover:bg-background hover:text-dark"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-accent" />
                        )}
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t border-border p-4 space-y-3">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-dark"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <span>Back to main site</span>
                  </Link>
                  <div className="flex items-center gap-3">
                    <UserButton
                                           appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                        },
                      }}
                    />
                    <span className="text-sm text-muted">Account</span>
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
