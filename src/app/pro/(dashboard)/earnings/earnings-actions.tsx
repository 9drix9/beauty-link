"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Zap,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { INSTANT_PAYOUT_FEE_RATE } from "@/lib/constants";

interface EarningsActionsProps {
  availableBalance: number;
  payoutEnabled: boolean;
  stripeConnected: boolean;
  bankLast4: string | null;
}

export function EarningsActions({
  availableBalance,
  payoutEnabled,
  stripeConnected,
  bankLast4,
}: EarningsActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleConnectSetup() {
    setLoading("connect");
    setError(null);
    try {
      const res = await fetch("/api/stripe-connect", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set up");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  async function handlePayout(type: "STANDARD" | "INSTANT") {
    setLoading(type);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payout failed");

      const amount = data.payout.transferAmount || data.payout.amount;
      setSuccess(
        `${formatPrice(amount)} has been sent to your bank account${bankLast4 ? ` ending in ${bankLast4}` : ""}.`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  // Not connected yet — show setup CTA
  if (!stripeConnected || !payoutEnabled) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="rounded-lg bg-cta-light p-3">
              <Banknote className="h-6 w-6 text-cta" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-dark">
                {stripeConnected
                  ? "Complete your payment setup"
                  : "Set up payouts to get paid"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {stripeConnected
                  ? "Your Stripe account needs additional information before payouts can be enabled."
                  : "Connect your bank account through Stripe to receive payouts for completed bookings."}
              </p>
            </div>
            <Button
              variant="cta"
              onClick={handleConnectSetup}
              disabled={loading === "connect"}
            >
              {loading === "connect" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Setting up...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  {stripeConnected ? "Continue Setup" : "Set Up Payouts"}
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-error-light px-4 py-3 text-sm text-error">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Connected — show payout options
  const instantFee = Math.round(availableBalance * INSTANT_PAYOUT_FEE_RATE);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Available to withdraw</p>
            <p className="text-2xl font-bold text-dark">
              {formatPrice(availableBalance)}
            </p>
          </div>
          {bankLast4 && (
            <p className="text-sm text-muted">
              Bank account ending in <span className="font-medium">{bankLast4}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-error-light px-4 py-3 text-sm text-error">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-success-light px-4 py-3 text-sm text-success">
            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {success}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="cta"
            className="flex-1"
            onClick={() => handlePayout("STANDARD")}
            disabled={availableBalance <= 0 || loading !== null}
          >
            {loading === "STANDARD" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Processing...
              </>
            ) : (
              <>
                <Banknote className="mr-2 h-4 w-4" aria-hidden="true" />
                Withdraw {availableBalance > 0 ? formatPrice(availableBalance) : ""}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handlePayout("INSTANT")}
            disabled={availableBalance <= 0 || loading !== null}
          >
            {loading === "INSTANT" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
                Instant{" "}
                {availableBalance > 0
                  ? `${formatPrice(availableBalance - instantFee)} (${formatPrice(instantFee)} fee)`
                  : ""}
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted text-center">
          Standard payouts arrive in 2-3 business days. Instant payouts have a 1.5% fee.
        </p>
      </CardContent>
    </Card>
  );
}
