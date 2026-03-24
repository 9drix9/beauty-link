"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Instagram,
  Download,
  Loader2,
  Check,
  AlertCircle,
  Link2,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InstagramImportProps {
  handle: string;
  currentPhotos: string[];
  maxPhotos?: number;
  onImport: (urls: string[]) => void;
}

interface FetchedPhoto {
  url: string;
  selected: boolean;
  importing: boolean;
  imported: boolean;
  importedUrl?: string;
}

export function InstagramImport({
  handle,
  currentPhotos,
  maxPhotos = 10,
  onImport,
}: InstagramImportProps) {
  const [mode, setMode] = useState<"idle" | "fetching" | "fetched" | "url-paste">("idle");
  const [photos, setPhotos] = useState<FetchedPhoto[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [pasteUrls, setPasteUrls] = useState("");
  const [fetchingUrls, setFetchingUrls] = useState(false);

  const username = handle.replace(/^@/, "").trim();
  const remainingSlots = maxPhotos - currentPhotos.length;

  async function handleFetchProfile() {
    if (!username) return;

    setMode("fetching");
    setError(null);
    setPhotos([]);

    try {
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: username }),
      });

      const data = await res.json();
      if (data.profileImage) setProfileImage(data.profileImage);

      if (data.photos && data.photos.length > 0) {
        setPhotos(
          data.photos.map((url: string) => ({
            url,
            selected: false,
            importing: false,
            imported: false,
          }))
        );
        setMode("fetched");
      } else {
        // No photos found — show paste UI
        setMode("url-paste");
        setError(
          "Couldn't load photos automatically. Paste post links below, or save photos from Instagram and upload them directly."
        );
      }
    } catch {
      setMode("url-paste");
      setError("Couldn't connect. Paste post links below or upload photos directly.");
    }
  }

  function togglePhoto(index: number) {
    setPhotos((prev) =>
      prev.map((p, i) => {
        if (i !== index || p.imported) return p;
        const selectedCount = prev.filter((pp) => pp.selected && !pp.imported).length;
        if (!p.selected && selectedCount >= remainingSlots) return p;
        return { ...p, selected: !p.selected };
      })
    );
  }

  async function handleImportSelected() {
    const toImport = photos.filter((p) => p.selected && !p.imported);
    if (toImport.length === 0) return;

    setImporting(true);
    const importedUrls: string[] = [];

    for (const photo of toImport) {
      const photoIndex = photos.indexOf(photo);
      setPhotos((prev) =>
        prev.map((p, idx) => (idx === photoIndex ? { ...p, importing: true } : p))
      );

      try {
        const res = await fetch("/api/instagram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: photo.url, upload: true }),
        });
        const data = await res.json();
        if (data.url) {
          importedUrls.push(data.url);
          setPhotos((prev) =>
            prev.map((p, idx) =>
              idx === photoIndex ? { ...p, importing: false, imported: true, importedUrl: data.url } : p
            )
          );
        } else {
          setPhotos((prev) =>
            prev.map((p, idx) => (idx === photoIndex ? { ...p, importing: false, selected: false } : p))
          );
        }
      } catch {
        setPhotos((prev) =>
          prev.map((p, idx) => (idx === photoIndex ? { ...p, importing: false, selected: false } : p))
        );
      }
    }

    if (importedUrls.length > 0) {
      onImport([...currentPhotos, ...importedUrls]);
    }
    setImporting(false);
  }

  async function handlePasteImport() {
    const urls = pasteUrls
      .split(/[\n,\s]+/)
      .map((u) => u.trim())
      .filter((u) => u.includes("instagram.com"));

    if (urls.length === 0) {
      setError("Paste at least one Instagram post URL.");
      return;
    }

    setFetchingUrls(true);
    setError(null);

    try {
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();

      if (data.photos) {
        const valid = data.photos.filter((p: { imageUrl: string | null }) => p.imageUrl);
        if (valid.length > 0) {
          setPhotos(
            valid.map((p: { imageUrl: string }) => ({
              url: p.imageUrl,
              selected: false,
              importing: false,
              imported: false,
            }))
          );
          setMode("fetched");
          setPasteUrls("");
          setError(null);
          return;
        }
      }
      setError("Couldn't extract images. Posts may be private. Try saving photos to your camera roll and uploading directly.");
    } catch {
      setError("Failed to fetch. Try uploading photos directly.");
    } finally {
      setFetchingUrls(false);
    }
  }

  const selectedCount = photos.filter((p) => p.selected && !p.imported).length;

  // ── Idle ──
  if (mode === "idle") {
    return (
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <button
          type="button"
          onClick={handleFetchProfile}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-accent-light/30 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shrink-0">
            <Instagram className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-dark text-sm">Import from Instagram</p>
            <p className="text-xs text-muted truncate">
              {username ? `Pull photos from @${username}` : "Import portfolio photos from Instagram"}
            </p>
          </div>
          <Download className="h-4 w-4 text-muted shrink-0 ml-auto" />
        </button>
      </div>
    );
  }

  // ── Fetching ──
  if (mode === "fetching") {
    return (
      <div className="rounded-xl border border-border bg-white p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
        <p className="text-sm text-muted mt-3">Fetching photos from @{username}...</p>
      </div>
    );
  }

  // ── URL Paste (fallback when auto-fetch fails) ──
  if (mode === "url-paste") {
    return (
      <div className="rounded-xl border border-border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-accent" />
            <span className="font-semibold text-dark text-sm">Import from Instagram</span>
          </div>
          <button type="button" onClick={() => { setMode("idle"); setError(null); setPasteUrls(""); }} className="p-1 text-muted hover:text-dark">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-warning/10 border border-warning/20 p-3">
            <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-body">{error}</p>
          </div>
        )}

        {username && (
          <a
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-sm text-accent hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open @{username} on Instagram
          </a>
        )}

        <div className="space-y-2">
          <p className="text-xs text-muted">
            Paste Instagram post URLs (one per line):
          </p>
          <textarea
            value={pasteUrls}
            onChange={(e) => { setPasteUrls(e.target.value); setError(null); }}
            placeholder={"https://www.instagram.com/p/ABC123/\nhttps://www.instagram.com/p/DEF456/"}
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <Button variant="primary" size="sm" onClick={handlePasteImport} disabled={fetchingUrls || !pasteUrls.trim()}>
            {fetchingUrls ? (
              <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Fetching...</>
            ) : (
              <><Download className="mr-1.5 h-3.5 w-3.5" />Fetch Photos</>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted">
          <strong>Tip:</strong> Open a post on Instagram, tap share, copy the link, and paste above. Or save photos to your camera roll and upload directly.
        </p>
      </div>
    );
  }

  // ── Fetched — photo grid ──
  return (
    <div className="rounded-xl border border-border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Instagram className="h-4 w-4 text-accent" />
          <span className="font-semibold text-dark text-sm">Select photos to import</span>
        </div>
        <button type="button" onClick={() => { setMode("idle"); setPhotos([]); setError(null); }} className="p-1 text-muted hover:text-dark">
          <X className="h-4 w-4" />
        </button>
      </div>

      {profileImage && (
        <div className="flex items-center gap-3 rounded-lg bg-background px-3 py-2">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-border shrink-0">
            <Image src={profileImage} alt={`@${username}`} width={32} height={32} className="h-full w-full object-cover" unoptimized />
          </div>
          <span className="text-sm font-medium text-dark">@{username}</span>
        </div>
      )}

      <p className="text-xs text-muted">
        Tap photos to select ({remainingSlots} slot{remainingSlots !== 1 ? "s" : ""} remaining). Selected photos will be saved to your portfolio.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <button
            key={index}
            type="button"
            onClick={() => togglePhoto(index)}
            disabled={photo.importing}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
              photo.imported ? "border-success" : photo.selected ? "border-accent ring-2 ring-accent/20" : "border-transparent hover:border-accent/30"
            )}
          >
            <Image src={photo.url} alt={`Photo ${index + 1}`} fill className="object-cover" unoptimized />
            {(photo.selected || photo.imported) && (
              <div className={cn("absolute inset-0 flex items-center justify-center", photo.imported ? "bg-success/20" : "bg-accent/20")}>
                {photo.importing ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin drop-shadow" />
                ) : (
                  <div className={cn("flex h-7 w-7 items-center justify-center rounded-full", photo.imported ? "bg-success" : "bg-accent")}>
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedCount > 0 && (
        <Button variant="cta" size="sm" className="w-full" onClick={handleImportSelected} disabled={importing}>
          {importing ? (
            <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Importing...</>
          ) : (
            <><Download className="mr-1.5 h-3.5 w-3.5" />Import {selectedCount} Photo{selectedCount !== 1 ? "s" : ""}</>
          )}
        </Button>
      )}

      <div className="border-t border-border pt-2">
        <button type="button" onClick={() => setMode("url-paste")} className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors">
          <Link2 className="h-3 w-3" />
          Import from specific post URLs instead
        </button>
      </div>
    </div>
  );
}
