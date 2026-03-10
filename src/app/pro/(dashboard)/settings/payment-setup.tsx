"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Banknote,
  CheckCircle,
  ExternalLink,
  Loader2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaymentSetupProps {
  stripeConnected: boolean;
  payoutEnabled: boolean;
  bankLast4: string | null;
}

export function PaymentSetup({
  stripeConnected: initialConnected,
  payoutEnabled: initialEnabled,
  bankLast4: initialLast4,
}: PaymentSetupProps) {
  const searchParams = useSearchParams();
  const stripeParam = searchParams.get("stripe");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(stripeParam === "success");
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(initialConnected);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [bankLast4, setBankLast4] = useState(initialLast4);

  // When returning from Stripe onboarding, check account status
  useEffect(() => {
    if (stripeParam === "success") {
      checkStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeParam]);

  async function checkStatus() {
    setChecking(true);
    try {
      const res = await fetch("/api/stripe-connect");
      const data = await res.json();
      if (res.ok) {
        setConnected(data.connected);
        setEnabled(data.payoutEnabled);
        setBankLast4(data.bankLast4);
      }
    } catch {
      // Silently fail — user can refresh
    } finally {
      setChecking(false);
    }
  }

  async function handleSetup() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe-connect", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set up");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-3 p-8">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <span className="text-sm text-muted">
            Checking your payment account status...
          </span>
        </CardContent>
      </Card>
    );
  }

  // Fully set up
  if (connected && enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Banknote className="h-5 w-5 text-accent" aria-hidden="true" />
            Payment Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-success-light p-4">
            <CheckCircle className="h-5 w-5 text-success shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium text-success">
                Payouts enabled
              </p>
              <p className="text-sm text-success">
                {bankLast4
                  ? `Bank account ending in ${bankLast4}`
                  : "Your bank account is connected"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Payouts are automatically sent 24 hours after each booking is
              completed. You can also request manual payouts from the Earnings page.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetup}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Update Bank Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Not set up or incomplete
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Banknote className="h-5 w-5 text-cta" aria-hidden="true" />
          Payment Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-cta-light p-4">
          <p className="font-medium text-dark">
            {connected
              ? "Almost there! Complete your payment setup"
              : "Set up payouts to get paid for your bookings"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {connected
              ? "Your Stripe account needs additional information before you can receive payouts."
              : "We use Stripe to securely send earnings directly to your bank account. Setup takes about 5 minutes."}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-error-light px-4 py-3 text-sm text-error">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <Button
          variant="cta"
          onClick={handleSetup}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Setting up...
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
              {connected ? "Continue Setup" : "Set Up Payouts"}
            </>
          )}
        </Button>

        <ul className="space-y-2 text-sm text-muted">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
            Secure bank account linking via Stripe
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
            Automatic payouts 24h after completed bookings
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
            Instant payout option available (1.5% fee)
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
