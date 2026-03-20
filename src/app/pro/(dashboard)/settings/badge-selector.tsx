"use client";

import { useState } from "react";
import { Shield, CheckCircle, Loader2 } from "lucide-react";
import { PROFILE_BADGES } from "@/lib/constants";

interface BadgeSelectorProps {
  currentBadges: string[];
  licensedBadge: boolean;
  licenseStatus: string;
}

export function BadgeSelector({
  currentBadges,
  licensedBadge,
  licenseStatus,
}: BadgeSelectorProps) {
  const [selectedBadges, setSelectedBadges] = useState<Set<string>>(
    new Set(currentBadges)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleBadge(value: string) {
    const next = new Set(selectedBadges);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setSelectedBadges(next);
    setSaved(false);
  }

  async function saveBadges() {
    setIsSaving(true);
    try {
      await fetch("/api/providers/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileBadges: Array.from(selectedBadges) }),
      });
      setSaved(true);
    } catch {
      // silently fail
    }
    setIsSaving(false);
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="text-lg font-semibold text-dark mb-1">Profile Badges</h2>
      <p className="text-sm text-muted mb-4">
        Select badges to display on your profile and listings. These help clients understand your experience level.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PROFILE_BADGES.map((badge) => {
          const isSelected = selectedBadges.has(badge.value);
          return (
            <button
              key={badge.value}
              type="button"
              onClick={() => toggleBadge(badge.value)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                isSelected
                  ? "border-accent bg-accent-light"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <p className="font-semibold text-dark text-sm">{badge.label}</p>
              <p className="text-xs text-muted mt-0.5">{badge.description}</p>
            </button>
          );
        })}

        {/* Licensed badge (admin-controlled) */}
        <div
          className={`rounded-xl border-2 p-3 text-left ${
            licensedBadge
              ? "border-success/30 bg-success-light"
              : "border-border opacity-60"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-success" />
            <p className="font-semibold text-dark text-sm">Licensed</p>
          </div>
          <p className="text-xs text-muted mt-0.5">
            {licensedBadge
              ? "Verified by BeautyLink"
              : licenseStatus === "PENDING"
                ? "License under review"
                : "Submit your license for verification"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={saveBadges}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-dark/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Save Badges
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
