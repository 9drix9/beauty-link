"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISCOUNT_SUGGESTIONS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { calculatePriceBreakdown } from "@/lib/pricing";
import {
  Zap,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";

interface SerializedTemplate {
  id: string;
  name: string;
  serviceCategory: string;
  title: string;
  durationMinutes: number;
  originalPriceCents: number | null;
  discountedPriceCents: number | null;
  isModelCall: boolean;
  maxClients: number;
  coverPhotoUrl: string | null;
  [key: string]: unknown;
}

interface QuickPostModalProps {
  templates: SerializedTemplate[];
}

export function QuickPostModal({ templates }: QuickPostModalProps) {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    templates[0]?.id || ""
  );
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [discountedPriceDollars, setDiscountedPriceDollars] = useState("");
  const [maxClients, setMaxClients] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const effectiveDiscountedCents = useMemo(() => {
    if (discountedPriceDollars) {
      return Math.round(parseFloat(discountedPriceDollars) * 100);
    }
    return selectedTemplate?.discountedPriceCents || 0;
  }, [discountedPriceDollars, selectedTemplate]);

  const priceBreakdown = useMemo(() => {
    if (!selectedTemplate?.originalPriceCents || !effectiveDiscountedCents) return null;
    return calculatePriceBreakdown(selectedTemplate.originalPriceCents, effectiveDiscountedCents);
  }, [selectedTemplate, effectiveDiscountedCents]);

  // Min date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  async function handleQuickPost() {
    if (!selectedTemplateId) {
      setError("Please select a template.");
      return;
    }
    if (!appointmentDate) {
      setError("Please select a date.");
      return;
    }
    if (!appointmentTime) {
      setError("Please select a time.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        templateId: selectedTemplateId,
        appointmentDate,
        appointmentTime,
      };

      if (discountedPriceDollars) {
        body.discountedPriceCents = Math.round(parseFloat(discountedPriceDollars) * 100);
      }

      if (maxClients) {
        body.maxClients = parseInt(maxClients);
      }

      const res = await fetch("/api/providers/listings/quick-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post.");
      }

      router.push("/pro/appointments?posted=true");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function applySuggestion(percent: number) {
    if (!selectedTemplate?.originalPriceCents) return;
    const suggested = Math.round(
      selectedTemplate.originalPriceCents * (1 - percent / 100)
    );
    setDiscountedPriceDollars((suggested / 100).toFixed(2));
  }

  return (
    <Card className="border-accent/20 bg-accent-light/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" aria-hidden="true" />
          Quick Post
        </CardTitle>
        <p className="text-sm text-muted">
          Pick a template, set date & time, and you&apos;re live.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-error/20 bg-error-light p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Template selector */}
        <div className="space-y-2">
          <Label>Service Template</Label>
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} — {t.title}
                  {t.originalPriceCents
                    ? ` (${formatPrice(t.originalPriceCents)})`
                    : " (Model Call)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
              Date
            </Label>
            <Input
              type="date"
              min={minDate}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
              Time
            </Label>
            <Input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </div>
        </div>

        {/* Optional price adjustment + suggestions */}
        {selectedTemplate && !selectedTemplate.isModelCall && selectedTemplate.originalPriceCents && (
          <div className="space-y-2">
            <Label>
              Discounted Price
              <span className="text-muted font-normal ml-1">
                — preset from template: {formatPrice(selectedTemplate.discountedPriceCents || 0)}
              </span>
            </Label>
            <Input
              type="number"
              min="1"
              step="0.01"
              placeholder={((selectedTemplate.discountedPriceCents || 0) / 100).toFixed(2)}
              value={discountedPriceDollars}
              onChange={(e) => setDiscountedPriceDollars(e.target.value)}
            />
            <p className="text-xs text-muted">
              This template already includes a BeautyLink discount. You can keep this price or adjust it, but it must be at least 10% below your original price.
            </p>
            {/* Price suggestions */}
            <div className="flex flex-wrap gap-2">
              {DISCOUNT_SUGGESTIONS.map((s) => {
                const suggestedCents = Math.round(
                  (selectedTemplate.originalPriceCents || 0) * (1 - s.percent / 100)
                );
                return (
                  <button
                    key={s.percent}
                    type="button"
                    onClick={() => applySuggestion(s.percent)}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-body hover:border-accent hover:text-accent transition-colors"
                  >
                    {s.label} = {formatPrice(suggestedCents)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Max clients override */}
        <div className="space-y-2">
          <Label>
            Max Clients
            <span className="text-muted font-normal ml-1">
              — default: {selectedTemplate?.maxClients || 1}
            </span>
          </Label>
          <Select value={maxClients} onValueChange={setMaxClients}>
            <SelectTrigger>
              <SelectValue placeholder={`${selectedTemplate?.maxClients || 1} client${(selectedTemplate?.maxClients || 1) !== 1 ? "s" : ""}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 client</SelectItem>
              <SelectItem value="2">2 clients</SelectItem>
              <SelectItem value="3">3 clients</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price preview */}
        {priceBreakdown && (
          <div className="rounded-lg border border-success/20 bg-success-light p-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success shrink-0" />
            <p className="text-sm text-success">
              Customer pays: <strong>{formatPrice(priceBreakdown.totalCharged)}</strong>
              <span className="ml-1 text-xs">({priceBreakdown.savingsPercent}% off)</span>
            </p>
          </div>
        )}

        <Button
          variant="cta"
          size="lg"
          className="w-full"
          onClick={handleQuickPost}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Publishing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
              Publish Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
