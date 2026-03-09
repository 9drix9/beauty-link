"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Browse", href: "/browse", icon: Search },
  { label: "Bookings", href: "/my-bookings", icon: Calendar },
  { label: "Profile", href: "/profile", icon: User },
];

export function MobileBottomTabs() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden safe-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors",
                active ? "text-dark" : "text-muted"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
