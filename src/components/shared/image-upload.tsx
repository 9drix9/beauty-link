"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Camera, ImagePlus, X, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  /** Current image URL(s) */
  value: string | string[];
  /** Called when images change */
  onChange: (value: string | string[]) => void;
  /** Allow multiple images */
  multiple?: boolean;
  /** Maximum number of images (for multiple mode) */
  maxImages?: number;
  /** Folder for storage organization */
  folder?: string;
  /** Aspect ratio class (e.g. "aspect-square", "aspect-video") */
  aspectRatio?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Disable upload */
  disabled?: boolean;
  /** Custom class for the container */
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxImages = 10,
  folder = "uploads",
  aspectRatio = "aspect-video",
  placeholder = "Upload a photo",
  disabled = false,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  const canUpload = multiple ? images.length < maxImages : images.length === 0;

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      return data.url as string;
    },
    [folder]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      setError(null);
      setUploading(true);

      try {
        const filesToUpload = multiple
          ? fileArray.slice(0, maxImages - images.length)
          : [fileArray[0]];

        const urls: string[] = [];
        for (const file of filesToUpload) {
          const url = await uploadFile(file);
          urls.push(url);
        }

        if (multiple) {
          onChange([...images, ...urls]);
        } else {
          onChange(urls[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, multiple, maxImages, onChange, uploadFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || uploading || !canUpload) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = async (index: number) => {
    const urlToRemove = images[index];

    // Remove from state immediately
    if (multiple) {
      const updated = images.filter((_, i) => i !== index);
      onChange(updated);
    } else {
      onChange("");
    }

    // Try to delete from storage (non-blocking)
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToRemove }),
      });
    } catch {
      // Ignore deletion errors
    }
  };

  // Single image mode
  if (!multiple) {
    const imageUrl = images[0];

    return (
      <div className={cn("space-y-2", className)}>
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors",
            !disabled && !uploading && "cursor-pointer hover:border-accent hover:bg-accent-light/30",
            uploading && "opacity-60",
            aspectRatio
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt="Uploaded"
                fill
                unoptimized
                className="object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(0);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  <p className="text-sm text-muted">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="flex gap-3">
                    <div className="rounded-full bg-accent-light p-3">
                      <ImagePlus className="h-6 w-6 text-accent" />
                    </div>
                    <div className="rounded-full bg-accent-light p-3 sm:hidden">
                      <Camera className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-body text-center">
                    {placeholder}
                  </p>
                  <p className="text-xs text-muted text-center">
                    Tap to upload or take a photo
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || uploading}
        />

        {error && (
          <div className="flex items-center gap-2 text-sm text-error">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </div>
    );
  }

  // Multiple images mode
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border"
          >
            <Image
              src={url}
              alt={`Photo ${index + 1}`}
              fill
              unoptimized
              className="object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-0 active:opacity-100"
                style={{ opacity: undefined }}
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {/* Always-visible delete on mobile */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white sm:hidden"
              aria-label={`Remove photo ${index + 1}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {canUpload && (
          <div
            className={cn(
              "relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors",
              !disabled && !uploading && "cursor-pointer hover:border-accent hover:bg-accent-light/30",
              uploading && "opacity-60"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              ) : (
                <>
                  <div className="flex gap-2">
                    <ImagePlus className="h-6 w-6 text-muted" />
                    <Camera className="h-6 w-6 text-muted sm:hidden" />
                  </div>
                  <p className="text-xs text-muted text-center">
                    {images.length}/{maxImages}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        capture="environment"
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {error && (
        <div className="flex items-center gap-2 text-sm text-error">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <p className="text-xs text-muted">
        {images.length} of {maxImages} photos. Tap to upload or take a photo. JPEG, PNG, or WebP up to 10MB.
      </p>
    </div>
  );
}
