"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/shared/image-upload";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  User,
  Briefcase,
  Camera,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";

const STEPS = [
  { num: 1, label: "About You", icon: User },
  { num: 2, label: "Services", icon: Briefcase },
  { num: 3, label: "Portfolio", icon: Camera },
];

interface FormData {
  fullName: string;
  instagramHandle: string;
  phone: string;
  email: string;
  serviceCategories: string[];
  portfolioPhotos: string[];
  agreedToTerms: boolean;
}

export function ApplyForm() {
  const STORAGE_KEY = "beautylink_apply_draft";
  const { user: clerkUser } = useUser();
  const accountEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(() => {
    // Restore from sessionStorage on mount
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            fullName: parsed.fullName || "",
            instagramHandle: parsed.instagramHandle || "",
            phone: parsed.phone || "",
            email: parsed.email || "",
            serviceCategories: parsed.serviceCategories || [],
            portfolioPhotos: parsed.portfolioPhotos || [],
            agreedToTerms: false, // Always re-confirm terms
          };
        }
      } catch {
        // Ignore corrupted data
      }
    }
    return {
      fullName: "",
      instagramHandle: "",
      phone: "",
      email: "",
      serviceCategories: [],
      portfolioPhotos: [],
      agreedToTerms: false,
    };
  });

  // Pre-fill email and name from Clerk account
  useEffect(() => {
    if (!clerkUser) return;
    setFormData((prev) => {
      const updates: Partial<FormData> = {};
      if (!prev.email && accountEmail) updates.email = accountEmail;
      if (!prev.fullName) {
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ");
        if (name) updates.fullName = name;
      }
      if (Object.keys(updates).length === 0) return prev;
      return { ...prev, ...updates };
    });
  }, [clerkUser, accountEmail]);

  // Restore step from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed._step) setStep(parsed._step);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Auto-save to sessionStorage on every change
  const saveToSession = useCallback((data: FormData, currentStep: number) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, _step: currentStep }));
    } catch {
      // Storage full or unavailable
    }
  }, []);

  useEffect(() => {
    saveToSession(formData, step);
  }, [formData, step, saveToSession]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function toggleCategory(value: string) {
    setFormData((prev) => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(value)
        ? prev.serviceCategories.filter((c) => c !== value)
        : [...prev.serviceCategories, value],
    }));
  }

  function validateStep(s: number): string | null {
    switch (s) {
      case 1:
        if (!formData.fullName.trim()) return "Your name is required.";
        if (formData.fullName.trim().length < 2) return "Name must be at least 2 characters.";
        return null;
      case 2:
        if (formData.serviceCategories.length === 0) return "Select at least one service category.";
        return null;
      case 3:
        if (!formData.agreedToTerms) return "You must agree to the terms to continue.";
        return null;
      default:
        return null;
    }
  }

  function handleNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const validationError = validateStep(3);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const body = {
        businessName: formData.fullName.trim(),
        bio: `Beauty professional specializing in ${formData.serviceCategories
          .map((v) => SERVICE_CATEGORIES.find((c) => c.value === v)?.label)
          .filter(Boolean)
          .join(", ")}.`,
        serviceCategories: formData.serviceCategories,
        yearsExperience: "ONE_TO_THREE",
        workSetting: "SALON_SUITE",
        instagramUrl: formData.instagramHandle.trim() || "",
        websiteUrl: "",
        portfolioPhotos: formData.portfolioPhotos,
        city: "",
        state: "CA",
        serviceRadius: "",
        pricingRange: "",
        availabilityType: "",
        currentPlatform: "",
        clientVolume: "",
        isStudent: false,
        school: "",
        phone: formData.phone.trim(),
      };

      const res = await fetch("/api/providers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      sessionStorage.removeItem(STORAGE_KEY);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <Card className="text-center">
        <CardContent className="py-12 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
            <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Application received</h2>
            <p className="text-muted max-w-md mx-auto mt-2">
              We&apos;ve received your application and will review it shortly.
            </p>
            <p className="text-muted max-w-md mx-auto mt-2">
              If approved, you&apos;ll be able to finish your profile and start setting up your listings ahead of our May launch.
            </p>
            <p className="text-sm text-muted max-w-md mx-auto mt-3">
              We&apos;ll follow up with next steps soon.
            </p>
          </div>

          <div className="rounded-xl bg-accent-light/50 border border-accent/10 p-5 max-w-sm mx-auto text-left space-y-3">
            <p className="text-sm font-semibold text-dark">What happens next</p>
            <div className="space-y-2.5">
              {[
                { icon: Clock, text: "We review your application" },
                { icon: User, text: "You complete your profile" },
                { icon: Briefcase, text: "You set up your first listings" },
                { icon: Sparkles, text: "Your openings go live in May" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-body">
                  <item.icon className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Button variant="primary" asChild>
            <Link href="/">Back to homepage</Link>
          </Button>

          <p className="text-xs text-muted">
            Questions? <Link href="/contact" className="text-accent hover:underline">Reach out anytime.</Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  const progress = (step / 3) * 100;

  return (
    <div className="space-y-6">
      {/* Concierge messaging */}
      <div className="text-center space-y-1">
        <p className="text-sm text-accent font-medium">Takes less than 2 minutes</p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-dark">
            Step {step} of 3
          </span>
          <span className="text-sm text-muted">
            {STEPS[step - 1].label}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (isCompleted) {
                  setStep(s.num);
                  setError(null);
                }
              }}
              disabled={!isCompleted && !isActive}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                isActive && "bg-accent text-white",
                isCompleted && "bg-accent-light text-accent cursor-pointer hover:bg-accent hover:text-white",
                !isActive && !isCompleted && "bg-background text-muted cursor-not-allowed"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-error/20 bg-error-light px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Step 1: About You — Lightweight */}
      {step === 1 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Tell us about yourself</h2>
              <p className="text-sm text-muted mt-1">
                Just the basics — we&apos;ll help you set up the rest later.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="e.g. Maria Santos"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                maxLength={100}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramHandle">Instagram Handle</Label>
              <Input
                id="instagramHandle"
                placeholder="@yourusername"
                value={formData.instagramHandle}
                onChange={(e) => updateField("instagramHandle", e.target.value)}
              />
              <p className="text-xs text-muted">
                We&apos;ll use this to help set up your profile and portfolio.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(310) 555-1234"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  readOnly={!!accountEmail}
                  className={accountEmail ? "bg-background text-body/70 cursor-default" : ""}
                />
                {accountEmail && (
                  <p className="text-xs text-muted">
                    From your BeautyLink account
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Services */}
      {step === 2 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">What services do you offer?</h2>
              <p className="text-sm text-muted mt-1">Select all that apply. You can add more details later.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SERVICE_CATEGORIES.map((cat) => {
                const isSelected = formData.serviceCategories.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => toggleCategory(cat.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-accent bg-accent-light text-accent"
                        : "border-border hover:border-accent/30 text-body"
                    )}
                  >
                    <Checkbox checked={isSelected} className="pointer-events-none" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Portfolio + Agreement */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-dark">Show off your work</h2>
                <p className="text-sm text-muted mt-1">
                  Upload photos of your best work. These will appear on your profile and can be used in future listings.
                </p>
              </div>

              <ImageUpload
                value={formData.portfolioPhotos}
                onChange={(val) => updateField("portfolioPhotos", val as string[])}
                multiple
                maxImages={10}
                folder="portfolio"
                placeholder="Add portfolio photos (optional — you can add later)"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => updateField("agreedToTerms", checked === true)}
                />
                <Label htmlFor="terms" className="text-sm leading-snug">
                  I confirm that all information is accurate and I agree to BeautyLink&apos;s{" "}
                  <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Privacy Policy</Link>.
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button variant="primary" onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            variant="cta"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.agreedToTerms}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Submitting...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                Submit Application
              </>
            )}
          </Button>
        )}
      </div>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted pt-2">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Reviewed in &lt; 48 hours
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
          Your info is secure
        </span>
      </div>
    </div>
  );
}
