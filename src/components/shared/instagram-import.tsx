"use client";

import { useState } from "react";
import {
  Instagram,
  ExternalLink,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstagramImportProps {
  handle: string;
  currentPhotos: string[];
  maxPhotos?: number;
  onImport: (urls: string[]) => void;
}

export function InstagramImport({
  handle,
  maxPhotos = 10,
  currentPhotos,
}: InstagramImportProps) {
  const [open, setOpen] = useState(false);
  const username = handle.replace(/^@/, "").trim();
  const remainingSlots = maxPhotos - currentPhotos.length;

  if (remainingSlots <= 0) return null;

  if (!open) {
    return (
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-accent-light/30 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shrink-0">
            <Instagram className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-dark text-sm">Import from Instagram</p>
            <p className="text-xs text-muted truncate">
              {username ? `Save photos from @${username} and upload them` : "Save photos from Instagram and upload them"}
            </p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shrink-0">
            <Instagram className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-dark text-sm">Import from Instagram</span>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="p-1 text-muted hover:text-dark">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Step-by-step */}
      <div className="rounded-lg bg-background p-4 space-y-3">
        <p className="text-xs font-semibold text-dark">Save your best photos from Instagram:</p>
        <ol className="space-y-2.5">
          {[
            { step: "1", text: "Open your Instagram profile" },
            { step: "2", text: "Tap a post you want to use" },
            { step: "3", text: "Tap the three dots (···) then \"Save to Camera Roll\"" },
            { step: "4", text: "Repeat for your best photos" },
            { step: "5", text: "Upload them using the uploader below" },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-2.5 text-xs text-body">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-bold shrink-0">
                {item.step}
              </span>
              <span className="pt-0.5">{item.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Open Instagram button */}
      {username && (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            Open @{username} on Instagram
          </a>
        </Button>
      )}

      <div className="flex items-center gap-2 text-xs text-muted">
        <Upload className="h-3.5 w-3.5 shrink-0" />
        <span>Then use the photo uploader below to add them to your portfolio.</span>
      </div>
    </div>
  );
}
