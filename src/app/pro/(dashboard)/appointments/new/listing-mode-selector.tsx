"use client";

import Link from "next/link";
import { Zap, FileText, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingModeSelectorProps {
  mode: string;
  templateCount: number;
}

export function ListingModeSelector({ mode, templateCount }: ListingModeSelectorProps) {
  const modes = [
    {
      key: "quick",
      label: "Quick Post",
      description: "Post in seconds from a template",
      icon: Zap,
      href: "/pro/appointments/new?mode=quick",
    },
    {
      key: "choose",
      label: "From Template",
      description: `Choose from ${templateCount} saved template${templateCount !== 1 ? "s" : ""}`,
      icon: FileText,
      href: "/pro/appointments/new?mode=choose",
    },
    {
      key: "scratch",
      label: "From Scratch",
      description: "Create a new listing manually",
      icon: PenLine,
      href: "/pro/appointments/new?mode=scratch",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = mode === m.key;
        return (
          <Link
            key={m.key}
            href={m.href}
            className={cn(
              "rounded-xl border-2 p-3 sm:p-4 text-center transition-all hover:shadow-sm",
              isActive
                ? "border-accent bg-accent-light"
                : "border-border hover:border-accent/30"
            )}
          >
            <Icon
              className={cn(
                "mx-auto h-5 w-5 mb-1.5",
                isActive ? "text-accent" : "text-muted"
              )}
              aria-hidden="true"
            />
            <p className={cn(
              "font-semibold text-sm",
              isActive ? "text-accent" : "text-dark"
            )}>
              {m.label}
            </p>
            <p className="text-[11px] text-muted mt-0.5 hidden sm:block">
              {m.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
