import { PLATFORM_FEE_RATE, MIN_DISCOUNT_PERCENT } from "./constants";

/**
 * BeautyLink Pricing Engine
 * 
 * Business model:
 * - Professional sets original_price and discounted_price
 * - Discounted must be >= 10% below original
 * - Platform charges 5% fee ON TOP of discounted price (customer pays)
 * - Professional receives 100% of discounted_price (no deductions)
 * - Platform revenue = platform_fee = discounted_price * 0.05
 */

export interface PriceBreakdown {
  originalPrice: number;       // cents
  discountedPrice: number;     // cents
  savingsAmount: number;       // cents
  savingsPercent: number;      // integer percentage
  platformFee: number;         // cents
  totalCharged: number;        // cents (what customer pays)
  providerPayout: number;      // cents (what pro receives)
  promoDiscount: number;       // cents
}

export function calculatePriceBreakdown(
  originalPriceCents: number,
  discountedPriceCents: number,
  promoDiscountCents: number = 0
): PriceBreakdown {
  const effectiveDiscounted = Math.max(0, discountedPriceCents - promoDiscountCents);
  const platformFee = Math.round(effectiveDiscounted * PLATFORM_FEE_RATE);
  
  return {
    originalPrice: originalPriceCents,
    discountedPrice: discountedPriceCents,
    savingsAmount: originalPriceCents - discountedPriceCents,
    savingsPercent: originalPriceCents > 0
      ? Math.round(((originalPriceCents - discountedPriceCents) / originalPriceCents) * 100)
      : 0,
    platformFee,
    totalCharged: effectiveDiscounted + platformFee,
    providerPayout: effectiveDiscounted, // Pro gets full discounted price
    promoDiscount: promoDiscountCents,
  };
}

/** Validate that discounted price meets minimum discount requirement */
export function validateDiscount(originalCents: number, discountedCents: number): {
  valid: boolean;
  error?: string;
} {
  if (discountedCents >= originalCents) {
    return { valid: false, error: "Discounted price must be less than original price" };
  }
  
  const discountPercent = ((originalCents - discountedCents) / originalCents) * 100;
  if (discountPercent < MIN_DISCOUNT_PERCENT) {
    return {
      valid: false,
      error: `BeautyLink listings must be discounted at least ${MIN_DISCOUNT_PERCENT}% from your normal price.`,
    };
  }
  
  return { valid: true };
}
