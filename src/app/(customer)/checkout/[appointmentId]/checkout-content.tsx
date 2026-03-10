"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Clock,
  MapPin,
  Calendar,
  Shield,
  ArrowLeft,
  CreditCard,
  Timer,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  formatDuration,
  cn,
} from "@/lib/utils";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { SLOT_HOLD_MINUTES } from "@/lib/constants";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface SerializedListing {
  id: string;
  serviceName: string;
  serviceCategory: string;
  description: string | null;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  originalPrice: number;
  discountedPrice: number;
  maxClients: number;
  bookedCount: number;
  locationAddress: string | null;
  launchZone: string | null;
  professional: {
    id: string;
    displayName: string | null;
    avgRating: number;
    user: {
      firstName: string;
      lastName: string;
      profilePhotoUrl: string | null;
    };
  };
}

interface CheckoutContentProps {
  listing: SerializedListing;
  userId: string;
  userEmail: string;
}

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function CheckoutContent({
  listing,
}: CheckoutContentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    SLOT_HOLD_MINUTES * 60
  );
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const priceBreakdown = calculatePriceBreakdown(
    listing.originalPrice,
    listing.discountedPrice,
    promoDiscount
  );

  const proName =
    listing.professional.displayName ||
    `${listing.professional.user.firstName} ${listing.professional.user.lastName}`;

  // Initialize checkout: create payment intent + hold
  useEffect(() => {
    async function initCheckout() {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: listing.id }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to initialize checkout");
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
        setHoldExpiresAt(new Date(data.holdExpiresAt));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize checkout"
        );
      } finally {
        setIsInitializing(false);
      }
    }

    initCheckout();
  }, [listing.id]);

  // Countdown timer
  useEffect(() => {
    if (!holdExpiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(
        0,
        Math.floor((holdExpiresAt.getTime() - now.getTime()) / 1000)
      );

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setApplyingPromo(true);

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode,
          listingId: listing.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid promo code");
      }

      const data = await res.json();
      setPromoDiscount(data.discountCents);
      setPromoApplied(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to apply promo code"
      );
    } finally {
      setApplyingPromo(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isExpired) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center space-y-4">
        <Timer className="mx-auto h-12 w-12 text-error" aria-hidden="true" />
        <h1 className="text-xl font-bold text-dark">Your hold has expired</h1>
        <p className="text-muted">
          The slot hold has expired. You can try booking again if the appointment
          is still available.
        </p>
        <Button variant="primary" asChild>
          <Link href={`/appointment/${listing.id}`}>Return to Listing</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link
        href={`/appointment/${listing.id}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to listing
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Column - Payment Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-dark">
              Complete Your Booking
            </h1>
            {holdExpiresAt && !isInitializing && (
              <div
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium",
                  timeRemaining <= 60
                    ? "text-error"
                    : timeRemaining <= 180
                      ? "text-warning"
                      : "text-muted"
                )}
              >
                <Timer className="h-4 w-4" aria-hidden="true" />
                <span>{formatCountdown(timeRemaining)}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-error-light p-3 text-sm text-error">
              <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {isInitializing ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                  <p className="text-sm text-muted">
                    Setting up secure payment...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#6A1B9A",
                    fontFamily: "Inter, system-ui, sans-serif",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <PaymentForm
                listingId={listing.id}
                totalCents={priceBreakdown.totalCharged}
                promoCode={promoApplied ? promoCode : undefined}
              />
            </Elements>
          ) : null}

          {/* Promo Code */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleApplyPromo}
                  disabled={promoApplied || applyingPromo || !promoCode.trim()}
                  loading={applyingPromo}
                >
                  {promoApplied ? "Applied" : "Apply"}
                </Button>
              </div>
              {promoApplied && (
                <p className="mt-2 text-sm text-success">
                  Promo code applied! You save an extra{" "}
                  {formatPrice(promoDiscount)}.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Your payment is secured by Stripe</span>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-2">
          <Card variant="elevated" className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Info */}
              <div className="min-w-0">
                <h3 className="font-semibold text-dark line-clamp-1">
                  {listing.serviceName}
                </h3>
                <p className="text-sm text-muted truncate">with {proName}</p>
              </div>

              {/* Appointment Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted" aria-hidden="true" />
                  <span>
                    {format(
                      new Date(listing.appointmentDate),
                      "EEEE, MMMM d, yyyy"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted" aria-hidden="true" />
                  <span>
                    {formatTime(listing.appointmentTime)} &middot;{" "}
                    {formatDuration(listing.durationMinutes)}
                  </span>
                </div>
                {listing.locationAddress && (
                  <div className="flex items-start gap-2 text-sm min-w-0">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted" aria-hidden="true" />
                    <span className="truncate">{listing.locationAddress}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Original price</span>
                  <span className="line-through text-muted">
                    {formatPrice(priceBreakdown.originalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">
                    Discounted price
                  </span>
                  <span>{formatPrice(priceBreakdown.discountedPrice)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>
                    You save ({priceBreakdown.savingsPercent}%)
                  </span>
                  <span>-{formatPrice(priceBreakdown.savingsAmount)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Promo discount</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted group relative cursor-help">
                    Service fee (5%)
                    <span className="invisible group-hover:visible absolute bottom-full left-0 mb-1 w-56 rounded-lg bg-dark px-3 py-2 text-xs text-white shadow-lg z-10">
                      This fee helps keep BeautyLink running and does not reduce the professional&apos;s earnings.
                    </span>
                  </span>
                  <span>{formatPrice(priceBreakdown.platformFee)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-base font-bold text-dark">
                  <span>Total</span>
                  <span>{formatPrice(priceBreakdown.totalCharged)}</span>
                </div>
              </div>

              <p className="text-xs text-center text-muted">
                Free cancellation up to 24 hours before appointment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Inner payment form component that uses Stripe hooks
function PaymentForm({
  listingId,
  totalCents,
  promoCode,
}: {
  listingId: string;
  totalCents: number;
  promoCode?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/my-bookings`,
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(
          error.message || "An error occurred while processing your payment."
        );
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Create the booking
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId,
            paymentIntentId: paymentIntent.id,
            promoCode,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create booking");
        }

        const booking = await res.json();
        router.push(`/my-bookings/${booking.id}?confirmed=true`);
      }
    } catch (err) {
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentElement />

          {paymentError && (
            <div className="flex items-center gap-2 rounded-lg bg-error-light p-3 text-sm text-error">
              <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>{paymentError}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="w-full"
            disabled={!stripe || !elements || isProcessing}
            loading={isProcessing}
          >
            Pay {formatPrice(totalCents)}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
