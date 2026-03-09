"use client";

import { formatPrice, calcSavingsPercent } from "@/lib/utils";

interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice: number;
  showSavings?: boolean;
}

export function PriceDisplay({
  originalPrice,
  discountedPrice,
  showSavings = false,
}: PriceDisplayProps) {
  const savingsPercent = calcSavingsPercent(originalPrice, discountedPrice);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-lg font-bold text-accent">
        {formatPrice(discountedPrice)}
      </span>
      <span className="text-sm text-muted line-through">
        {formatPrice(originalPrice)}
      </span>
      {showSavings && savingsPercent > 0 && (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          Save {savingsPercent}%
        </span>
      )}
    </div>
  );
}
