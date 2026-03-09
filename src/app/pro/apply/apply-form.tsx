"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SERVICE_CATEGORIES,
  WORK_SETTINGS,
  YEARS_EXPERIENCE_OPTIONS,
  LICENSE_TYPES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  Loader2,
} from "lucide-react";

const STEPS = ["Business Info", "License & Verification", "Review & Submit"];

interface FormData {
  businessName: string;
  bio: string;
  serviceCategories: string[];
  yearsExperience: string;
  workSetting: string;
  instagramUrl: string;
  websiteUrl: string;
  licenseType: string;
  licenseNumber: string;
  licenseState: string;
  licenseDoc: File | null;
  selfie: File | null;
  agreedToTerms: boolean;
}

export function ApplyForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    bio: "",
    serviceCategories: [],
    yearsExperience: "",
    workSetting: "",
    instagramUrl: "",
    websiteUrl: "",
    licenseType: "",
    licenseNumber: "",
    licenseState: "",
    licenseDoc: null,
    selfie: null,
    agreedToTerms: false,
  });

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
    if (s === 1) {
      if (!formData.businessName.trim()) return "Business name is required.";
      if (formData.bio.length < 50)
        return "Bio must be at least 50 characters.";
      if (formData.serviceCategories.length === 0)
        return "Select at least one service category.";
      if (!formData.yearsExperience) return "Years of experience is required.";
      if (!formData.workSetting) return "Work setting is required.";
    }
    if (s === 2) {
      if (!formData.licenseType) return "License type is required.";
      if (formData.licenseNumber.length < 3)
        return "License number must be at least 3 characters.";
      if (formData.licenseState.length !== 2)
        return "License state must be 2 characters (e.g. CA).";
    }
    return null;
  }

  function handleNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  }

  function handleBack() {
    setError(null);
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (!formData.agreedToTerms) {
      setError("You must agree to the terms to continue.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const body = {
        businessName: formData.businessName.trim(),
        bio: formData.bio.trim(),
        serviceCategories: formData.serviceCategories,
        yearsExperience: formData.yearsExperience,
        workSetting: formData.workSetting,
        licenseType: formData.licenseType,
        licenseNumber: formData.licenseNumber.trim(),
        licenseState: formData.licenseState.toUpperCase().trim(),
        instagramUrl: formData.instagramUrl.trim() || "",
        websiteUrl: formData.websiteUrl.trim() || "",
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

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success state
  if (isSubmitted) {
    return (
      <Card className="text-center">
        <CardContent className="py-12 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold">Application Submitted!</h2>
          <p className="text-muted max-w-md mx-auto">
            Thank you for applying to BeautyLink. You&apos;ll hear from us
            within 48 hours.
          </p>
          <Button variant="primary" asChild>
            <Link href="/browse">Browse Appointments</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <div key={label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isActive && "bg-purple-primary text-white",
                    isCompleted && "bg-purple-primary text-white",
                    !isActive && !isCompleted && "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1 hidden sm:block",
                    isActive ? "text-purple-primary font-medium" : "text-muted"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2",
                    step > stepNum ? "bg-purple-primary" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Business Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business / Display Name *</Label>
              <Input
                id="businessName"
                placeholder="e.g. Hair by Maria"
                value={formData.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                placeholder="Tell clients about yourself, your style, and what makes you unique..."
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p
                className={cn(
                  "text-xs text-right",
                  formData.bio.length < 50
                    ? "text-muted"
                    : "text-green-600"
                )}
              >
                {formData.bio.length}/500
                {formData.bio.length < 50 && ` (min 50)`}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Service Categories *</Label>
              <p className="text-xs text-muted">
                Select all that apply.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = formData.serviceCategories.includes(
                    cat.value
                  );
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                        isSelected
                          ? "border-purple-primary bg-purple-50 text-purple-primary"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="pointer-events-none"
                      />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Years of Experience *</Label>
                <Select
                  value={formData.yearsExperience}
                  onValueChange={(v) => updateField("yearsExperience", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Work Setting *</Label>
                <Select
                  value={formData.workSetting}
                  onValueChange={(v) => updateField("workSetting", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_SETTINGS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram Handle (optional)</Label>
                <Input
                  id="instagramUrl"
                  placeholder="@yourusername"
                  value={formData.instagramUrl}
                  onChange={(e) => updateField("instagramUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL (optional)</Label>
                <Input
                  id="websiteUrl"
                  placeholder="https://yoursite.com"
                  value={formData.websiteUrl}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: License & Verification */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>License & Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>License Type *</Label>
              <Select
                value={formData.licenseType}
                onValueChange={(v) => updateField("licenseType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select license type..." />
                </SelectTrigger>
                <SelectContent>
                  {LICENSE_TYPES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  placeholder="e.g. CO-123456"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    updateField("licenseNumber", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseState">License State *</Label>
                <Input
                  id="licenseState"
                  placeholder="CA"
                  maxLength={2}
                  value={formData.licenseState}
                  onChange={(e) =>
                    updateField(
                      "licenseState",
                      e.target.value.toUpperCase()
                    )
                  }
                />
              </div>
            </div>

            <Separator />

            {/* License Document Upload Placeholder */}
            <div className="space-y-2">
              <Label>License Document</Label>
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
                  formData.licenseDoc
                    ? "border-purple-primary bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-3" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {formData.licenseDoc
                    ? formData.licenseDoc.name
                    : "Upload your license document"}
                </p>
                <p className="text-xs text-muted mb-3">
                  PDF, JPG, or PNG up to 10MB
                </p>
                <label className="cursor-pointer">
                  <span className="text-sm font-medium text-purple-primary hover:underline">
                    Choose file
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      updateField("licenseDoc", e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
            </div>

            {/* Selfie Upload Placeholder */}
            <div className="space-y-2">
              <Label>Selfie for Verification</Label>
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
                  formData.selfie
                    ? "border-purple-primary bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-3" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {formData.selfie
                    ? formData.selfie.name
                    : "Upload a clear selfie"}
                </p>
                <p className="text-xs text-muted mb-3">
                  JPG or PNG up to 10MB
                </p>
                <label className="cursor-pointer">
                  <span className="text-sm font-medium text-purple-primary hover:underline">
                    Choose file
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) =>
                      updateField("selfie", e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Info Summary */}
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                Business Information
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Display Name</dt>
                  <dd className="font-medium">{formData.businessName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Bio</dt>
                  <dd className="font-medium text-right max-w-xs truncate">
                    {formData.bio.slice(0, 80)}
                    {formData.bio.length > 80 ? "..." : ""}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Categories</dt>
                  <dd className="font-medium">
                    {formData.serviceCategories
                      .map(
                        (v) =>
                          SERVICE_CATEGORIES.find((c) => c.value === v)?.label
                      )
                      .join(", ")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Experience</dt>
                  <dd className="font-medium">
                    {
                      YEARS_EXPERIENCE_OPTIONS.find(
                        (o) => o.value === formData.yearsExperience
                      )?.label
                    }
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Work Setting</dt>
                  <dd className="font-medium">
                    {
                      WORK_SETTINGS.find(
                        (o) => o.value === formData.workSetting
                      )?.label
                    }
                  </dd>
                </div>
                {formData.instagramUrl && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Instagram</dt>
                    <dd className="font-medium">{formData.instagramUrl}</dd>
                  </div>
                )}
                {formData.websiteUrl && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Website</dt>
                    <dd className="font-medium">{formData.websiteUrl}</dd>
                  </div>
                )}
              </dl>
            </div>

            <Separator />

            {/* License Info Summary */}
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                License & Verification
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">License Type</dt>
                  <dd className="font-medium">
                    {
                      LICENSE_TYPES.find(
                        (o) => o.value === formData.licenseType
                      )?.label
                    }
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">License Number</dt>
                  <dd className="font-medium">{formData.licenseNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">License State</dt>
                  <dd className="font-medium">{formData.licenseState}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">License Document</dt>
                  <dd className="font-medium">
                    {formData.licenseDoc ? formData.licenseDoc.name : "Not uploaded"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Selfie</dt>
                  <dd className="font-medium">
                    {formData.selfie ? formData.selfie.name : "Not uploaded"}
                  </dd>
                </div>
              </dl>
            </div>

            <Separator />

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) =>
                  updateField("agreedToTerms", checked === true)
                }
              />
              <Label htmlFor="terms" className="text-sm leading-snug">
                I confirm that all information is accurate and I agree to
                BeautyLink&apos;s Terms of Service
              </Label>
            </div>
          </CardContent>
        </Card>
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
              "Submit Application"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
