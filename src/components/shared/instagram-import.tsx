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
  /** The IG handle (with or without @) */
  handle: string;
  /** Currently uploaded photos */
  currentPhotos: string[];
  /** Max total photos allowed */
  maxPhotos?: number;
  /** Called when new photos are imported */
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
  const [mode, setMode] = useState<"idle" | "active" | "fetched">("idle");
  const [photos, setPhotos] = useState<FetchedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [pasteUrls, setPasteUrls] = useState("");
  const [fetchingUrls, setFetchingUrls] = useState(false);

  const username = handle.replace(/^@/, "").trim();
  const remainingSlots = maxPhotos - currentPhotos.length;

  function togglePhoto(index: number) {
    setPhotos((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        if (p.imported) return p;

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

    for (let i = 0; i < toImport.length; i++) {
      const photo = toImport[i];
      const photoIndex = photos.indexOf(photo);

      setPhotos((prev) =>
        prev.map((p, idx) =>
          idx === photoIndex ? { ...p, importing: true } : p
        )
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
              idx === photoIndex
                ? { ...p, importing: false, imported: true, importedUrl: data.url }
                : p
            )
          );
        } else {
          setPhotos((prev) =>
            prev.map((p, idx) =>
              idx === photoIndex
                ? { ...p, importing: false, selected: false }
                : p
            )
          );
        }
      } catch {
        setPhotos((prev) =>
          prev.map((p, idx) =>
            idx === photoIndex
              ? { ...p, importing: false, selected: false }
              : p
          )
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
      setError("Please paste at least one Instagram post URL.");
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

      if (data.photos && data.photos.length > 0) {
        const validPhotos = data.photos.filter(
          (p: { imageUrl: string | null }) => p.imageUrl
        );

        if (validPhotos.length > 0) {
          setPhotos(
            validPhotos.map((p: { imageUrl: string }) => ({
              url: p.imageUrl,
              selected: false,
              importing: false,
              imported: false,
            }))
          );
          setMode("fetched");
          setPasteUrls("");
          setError(null);
        } else {
          setError(
            "Couldn't extract images from those URLs. The posts may be private or Instagram is blocking the request. Try saving the photos to your camera roll and uploading them directly below."
          );
        }
      }
    } catch {
      setError("Failed to fetch post images. Try saving photos from Instagram and uploading them directly.");
    } finally {
      setFetchingUrls(false);
    }
  }

  const selectedCount = photos.filter((p) => p.selected && !p.imported).length;

  // Idle state — show the import button
  if (mode === "idle") {
    return (
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setMode("active")}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-accent-light/30 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shrink-0">
            <Instagram className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-dark text-sm">
              Import from Instagram
            </p>
            <p className="text-xs text-muted truncate">
              {username
                ? `Import photos from @${username}`
                : "Import portfolio photos from Instagram"}
            </p>
          </div>
          <Download className="h-4 w-4 text-muted shrink-0 ml-auto" />
        </button>
      </div>
    );
  }

  // Active state — URL paste (the only reliable method)
  if (mode === "active") {
    return (
      <div className="rounded-xl border border-border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shrink-0">
              <Instagram className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-dark text-sm">
              Import from Instagram
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode("idle");
              setError(null);
              setPasteUrls("");
            }}
            className="p-1 text-muted hover:text-dark"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-warning/10 border border-warning/20 p-3">
            <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-body">{error}</p>
          </div>
        )}

        {/* Step-by-step instructions */}
        <div className="rounded-lg bg-background p-3.5 space-y-2.5">
          <p className="text-xs font-semibold text-dark">How to import your photos:</p>
          <ol className="text-xs text-muted space-y-1.5 list-none">
            <li className="flex items-start gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <span>Open your Instagram and go to a post you want to import</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <span>Tap the three dots (<strong>&middot;&middot;&middot;</strong>) or share button, then tap <strong>&quot;Copy Link&quot;</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <span>Paste the link(s) below — you can add multiple</span>
            </li>
          </ol>
        </div>

        {/* Quick link to their IG */}
        {username && (
          <a
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-accent hover:bg-accent-light/30 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open @{username} on Instagram to copy links
          </a>
        )}

        {/* URL paste area */}
        <div className="space-y-2">
          <textarea
            value={pasteUrls}
            onChange={(e) => {
              setPasteUrls(e.target.value);
              setError(null);
            }}
            placeholder={"Paste Instagram post links here...\nhttps://www.instagram.com/p/ABC123/\nhttps://www.instagram.com/p/DEF456/"}
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder:text-muted/50"
          />
          <Button
            variant="cta"
            size="sm"
            className="w-full"
            onClick={handlePasteImport}
            disabled={fetchingUrls || !pasteUrls.trim()}
          >
            {fetchingUrls ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Fetching photos...
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Import Photos
              </>
            )}
          </Button>
        </div>

        <p className="text-[11px] text-muted text-center">
          Or save photos from Instagram to your camera roll and use the uploader below.
        </p>
      </div>
    );
  }

  // Fetched state — show photo grid for selection
  return (
    <div className="rounded-xl border border-border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Instagram className="h-4 w-4 text-accent" />
          <span className="font-semibold text-dark text-sm">
            Select photos to import
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setMode("active");
            setPhotos([]);
            setError(null);
          }}
          className="p-1 text-muted hover:text-dark"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-muted">
        Tap photos to select them ({remainingSlots} slot{remainingSlots !== 1 ? "s" : ""} remaining).
        Selected photos will be saved to your BeautyLink portfolio.
      </p>

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <button
            key={index}
            type="button"
            onClick={() => togglePhoto(index)}
            disabled={photo.importing}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
              photo.imported
                ? "border-success"
                : photo.selected
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-transparent hover:border-accent/30"
            )}
          >
            <Image
              src={photo.url}
              alt={`Instagram photo ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />

            {/* Selection overlay */}
            {(photo.selected || photo.imported) && (
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  photo.imported ? "bg-success/20" : "bg-accent/20"
                )}
              >
                {photo.importing ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin drop-shadow" />
                ) : (
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full",
                      photo.imported ? "bg-success" : "bg-accent"
                    )}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Import button */}
      {selectedCount > 0 && (
        <Button
          variant="cta"
          size="sm"
          className="w-full"
          onClick={handleImportSelected}
          disabled={importing}
        >
          {importing ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Import {selectedCount} Photo{selectedCount !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      )}

      {/* Add more */}
      <div className="border-t border-border pt-2">
        <button
          type="button"
          onClick={() => setMode("active")}
          className="flex items-center gap-1.5 text-xs text-accent hover:underline transition-colors"
        >
          <Link2 className="h-3 w-3" />
          Import more photos
        </button>
      </div>
    </div>
  );
}
