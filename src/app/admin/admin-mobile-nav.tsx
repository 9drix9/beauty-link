"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMobileNavProps {
  links: { label: string; href: string }[];
}

export function AdminMobileNav({ links }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-white border-b border-border px-4 md:hidden">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-accent">Beauty</span>
          <span className="text-cta">Link</span>
          <span className="rounded-full bg-accent/10 text-accent text-xs font-medium px-2 py-0.5">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-gray-50"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-border shadow-elevated px-4 py-3 space-y-1 md:hidden">
            {links.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent-light text-accent border-l-[3px] border-accent"
                      : "text-muted hover:bg-gray-50 hover:text-dark"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-border pt-2 mt-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-gray-50 hover:text-dark"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                Back to main site
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
