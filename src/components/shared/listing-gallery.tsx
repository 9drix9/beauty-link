"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ListingGalleryProps {
  images: string[];
  serviceName: string;
  savingsPercent: number;
}

export function ListingGallery({
  images,
  serviceName,
  savingsPercent,
}: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-xl bg-gradient-to-br from-background to-border">
        <span className="text-lg text-accent/60">No photo available</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
        <Image
          src={images[activeIndex]}
          alt={`${serviceName} photo ${activeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority={activeIndex === 0}
        />

        {savingsPercent > 0 && (
          <div className="absolute top-3 left-3">
            <Badge variant="success" size="md">
              Save {savingsPercent}%
            </Badge>
          </div>
        )}

        {/* Arrow navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Photo counter */}
            <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-1">
          {images.slice(0, 6).map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ring-2 transition-all focus:outline-none focus-visible:ring-accent",
                idx === activeIndex
                  ? "ring-accent opacity-100"
                  : "ring-transparent opacity-60 hover:opacity-100 hover:ring-border"
              )}
            >
              <Image
                src={src}
                alt={`${serviceName} photo ${idx + 1}`}
                fill
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
