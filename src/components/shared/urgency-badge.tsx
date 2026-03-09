"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface UrgencyBadgeProps {
  appointmentDate: Date;
  spotsLeft: number;
}

export function UrgencyBadge({ appointmentDate, spotsLeft }: UrgencyBadgeProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const diffMs = new Date(appointmentDate).getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffMins = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  function getTimeLabel(): { text: string; className: string } | null {
    if (diffMs < 0) return null;

    if (diffHours < 0.001) {
      return { text: "Starting now!", className: "bg-red-100 text-red-700 animate-pulse" };
    }
    if (diffHours < 6) {
      const h = Math.floor(diffHours);
      const m = diffMins % 60;
      const countdown = h > 0 ? `${h}h ${m}m left` : `${m}m left`;
      return { text: countdown, className: "bg-red-100 text-red-700 animate-pulse" };
    }

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const apptDay = new Date(appointmentDate);
    apptDay.setHours(0, 0, 0, 0);
    const dayDiff = Math.round(
      (apptDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 0) {
      return { text: "Today!", className: "bg-red-100 text-red-700 animate-pulse" };
    }
    if (dayDiff === 1) {
      return { text: "Tomorrow", className: "bg-orange-100 text-orange-700" };
    }
    return null;
  }

  const timeLabel = getTimeLabel();

  if (!timeLabel && spotsLeft > 2) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {timeLabel && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
            timeLabel.className
          )}
        >
          {timeLabel.text}
        </span>
      )}
      {spotsLeft <= 2 && spotsLeft > 0 && (
        <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
          Only {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left!
        </span>
      )}
    </div>
  );
}
