"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ImageUpload } from "@/components/shared/image-upload";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  User,
  Briefcase,
  Award,
  FileCheck,
  Camera,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  Users,
  GraduationCap,
  Shield,
} from "lucide-react";

const STEPS = [
  { num: 1, label: "Basic Info", icon: User },
  { num: 2, label: "Services", icon: Briefcase },
  { num: 3, label: "Experience", icon: Award },
  { num: 4, label: "License", icon: FileCheck },
  { num: 5, label: "Portfolio", icon: Camera },
  { num: 6, label: "Location", icon: MapPin },
  { num: 7, label: "Pricing", icon: DollarSign },
  { num: 8, label: "Availability", icon: Calendar },
  { num: 9, label: "Booking", icon: Star },
  { num: 10, label: "Clients", icon: Users },
  { num: 11, label: "Student", icon: GraduationCap },
  { num: 12, label: "Agreement", icon: Shield },
];

const PRICING_RANGES = [
  { value: "under_50", label: "Under $50" },
  { value: "50_100", label: "$50 – $100" },
  { value: "100_200", label: "$100 – $200" },
  { value: "200_plus", label: "$200+" },
];

const AVAILABILITY_TYPES = [
  { value: "last_minute", label: "Last-minute / same-day openings" },
  { value: "weekly", label: "Weekly recurring open slots" },
  { value: "flexible", label: "Flexible — I'll post when I have availability" },
];

const BOOKING_PLATFORMS = [
  { value: "none", label: "I don't use one" },
  { value: "square", label: "Square Appointments" },
  { value: "vagaro", label: "Vagaro" },
  { value: "fresha", label: "Fresha" },
  { value: "booksy", label: "Booksy" },
  { value: "styleseat", label: "StyleSeat" },
  { value: "other", label: "Other" },
];

const CLIENT_VOLUME = [
  { value: "building", label: "Just getting started, building my clientele" },
  { value: "growing", label: "Growing, I have some regulars but want more" },
  { value: "steady", label: "Steady, I mostly want to fill gaps" },
  { value: "full", label: "Fully booked, occasional openings only" },
];

interface FormData {
  // Step 1 — Basic Info
  businessName: string;
  bio: string;
  // Step 2 — Services
  serviceCategories: string[];
  // Step 3 — Experience
  yearsExperience: string;
  workSetting: string;
  // Step 4 — License
  licenseType: string;
  licenseNumber: string;
  licenseState: string;
  // Step 5 — Portfolio
  instagramUrl: string;
  websiteUrl: string;
  portfolioPhotos: string[];
  licenseDoc: File | null;
  // Step 6 — Location
  city: string;
  state: string;
  serviceRadius: string;
  // Step 7 — Pricing
  pricingRange: string;
  // Step 8 — Availability
  availabilityType: string;
  // Step 9 — Booking
  currentPlatform: string;
  // Step 10 — Client Volume
  clientVolume: string;
  // Step 11 — Student
  isStudent: boolean;
  school: string;
  // Step 12 — Agreement
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
    licenseType: "",
    licenseNumber: "",
    licenseState: "",
    instagramUrl: "",
    websiteUrl: "",
    portfolioPhotos: [],
    licenseDoc: null,
    city: "",
    state: "CA",
    serviceRadius: "",
    pricingRange: "",
    availabilityType: "",
    currentPlatform: "",
    clientVolume: "",
    isStudent: false,
    school: "",
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
    switch (s) {
      case 1:
        if (!formData.businessName.trim()) return "Business or display name is required.";
        if (formData.bio.length < 50) return "Bio must be at least 50 characters.";
        return null;
      case 2:
        if (formData.serviceCategories.length === 0) return "Select at least one service category.";
        return null;
      case 3:
        if (!formData.yearsExperience) return "Please select your experience level.";
        if (!formData.workSetting) return "Please select your work setting.";
        return null;
      case 5:
        if (formData.portfolioPhotos.length < 3) return "Please upload at least 3 portfolio photos to showcase your work.";
        return null;
      case 12:
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
    setStep((s) => Math.min(s + 1, 12));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const validationError = validateStep(12);
    if (validationError) {
      setError(validationError);
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
        portfolioPhotos: formData.portfolioPhotos,
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        serviceRadius: formData.serviceRadius,
        pricingRange: formData.pricingRange,
        availabilityType: formData.availabilityType,
        currentPlatform: formData.currentPlatform,
        clientVolume: formData.clientVolume,
        isStudent: formData.isStudent,
        school: formData.school.trim(),
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

  if (isSubmitted) {
    return (
      <Card className="text-center">
        <CardContent className="py-12 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
            <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold">Application Submitted!</h2>
          <p className="text-muted max-w-md mx-auto">
            Thank you for applying to BeautyLink. We&apos;ll review your application and get back to you within 48 hours.
          </p>
          <Button variant="primary" asChild>
            <Link href="/browse">Browse Appointments</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress = (step / 12) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-dark">
            Step {step} of 12
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

      {/* Step indicators — horizontal scroll on mobile */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
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
                "flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                isActive && "bg-accent text-white",
                isCompleted && "bg-accent-light text-accent cursor-pointer hover:bg-accent hover:text-white",
                !isActive && !isCompleted && "bg-background text-muted cursor-not-allowed"
              )}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.num}</span>
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

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Basic Info</h2>
              <p className="text-sm text-muted mt-1">Tell us about yourself and your business.</p>
            </div>
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
              <p className={cn("text-xs text-right", formData.bio.length < 50 ? "text-muted" : "text-success")}>
                {formData.bio.length}/500{formData.bio.length < 50 && " (min 50)"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Services Offered */}
      {step === 2 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Services Offered</h2>
              <p className="text-sm text-muted mt-1">Select all service categories that apply to you.</p>
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

      {/* Step 3: Experience Level */}
      {step === 3 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Experience Level</h2>
              <p className="text-sm text-muted mt-1">Help us understand your background.</p>
            </div>
            <div className="space-y-2">
              <Label>Years of Experience *</Label>
              <Select value={formData.yearsExperience} onValueChange={(v) => updateField("yearsExperience", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level..." />
                </SelectTrigger>
                <SelectContent>
                  {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Work Setting *</Label>
              <Select value={formData.workSetting} onValueChange={(v) => updateField("workSetting", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Where do you work?" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_SETTINGS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: License Info */}
      {step === 4 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">License Info</h2>
              <p className="text-sm text-muted mt-1">
                License details are optional but help you get approved faster. Your info is stored securely and only visible to our review team.
              </p>
            </div>
            <div className="space-y-2">
              <Label>License Type</Label>
              <Select value={formData.licenseType} onValueChange={(v) => updateField("licenseType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select license type..." />
                </SelectTrigger>
                <SelectContent>
                  {LICENSE_TYPES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="e.g. CO-123456"
                  value={formData.licenseNumber}
                  onChange={(e) => updateField("licenseNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseState">License State</Label>
                <Input
                  id="licenseState"
                  placeholder="CA"
                  maxLength={2}
                  value={formData.licenseState}
                  onChange={(e) => updateField("licenseState", e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Portfolio */}
      {step === 5 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Portfolio</h2>
              <p className="text-sm text-muted mt-1">Share your work so clients can see your style. You can also link your Instagram or website.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram Handle</Label>
                <Input
                  id="instagramUrl"
                  placeholder="@yourusername"
                  value={formData.instagramUrl}
                  onChange={(e) => updateField("instagramUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  placeholder="https://yoursite.com"
                  value={formData.websiteUrl}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload Portfolio Photos</Label>
              <ImageUpload
                value={formData.portfolioPhotos}
                onChange={(val) => updateField("portfolioPhotos", val as string[])}
                multiple
                maxImages={10}
                folder="portfolio"
                placeholder="Show off your best work"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Location & Service Area */}
      {step === 6 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Location & Service Area</h2>
              <p className="text-sm text-muted mt-1">Where are you based? This helps clients find you.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g. Los Angeles"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Service Radius</Label>
              <Select value={formData.serviceRadius} onValueChange={(v) => updateField("serviceRadius", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="How far are you willing to travel?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio_only">Studio / salon only</SelectItem>
                  <SelectItem value="5_miles">Within 5 miles</SelectItem>
                  <SelectItem value="10_miles">Within 10 miles</SelectItem>
                  <SelectItem value="25_miles">Within 25 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 7: Typical Service Pricing */}
      {step === 7 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Typical Service Pricing</h2>
              <p className="text-sm text-muted mt-1">
                What&apos;s your typical price range? On BeautyLink, you&apos;ll list at a discounted rate — at least 15% off your regular price.
              </p>
            </div>
            <div className="space-y-3">
              {PRICING_RANGES.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => updateField("pricingRange", range.value)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                    formData.pricingRange === range.value
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border hover:border-accent/30 text-body"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 8: Availability Type */}
      {step === 8 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Availability Type</h2>
              <p className="text-sm text-muted mt-1">How do you plan to use BeautyLink?</p>
            </div>
            <div className="space-y-3">
              {AVAILABILITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateField("availabilityType", type.value)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                    formData.availabilityType === type.value
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border hover:border-accent/30 text-body"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 9: Booking Experience */}
      {step === 9 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Booking Experience</h2>
              <p className="text-sm text-muted mt-1">Do you currently use a booking platform?</p>
            </div>
            <div className="space-y-3">
              {BOOKING_PLATFORMS.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => updateField("currentPlatform", platform.value)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                    formData.currentPlatform === platform.value
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border hover:border-accent/30 text-body"
                  )}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 10: Client Volume */}
      {step === 10 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Client Volume</h2>
              <p className="text-sm text-muted mt-1">Where are you at with your client base?</p>
            </div>
            <div className="space-y-3">
              {CLIENT_VOLUME.map((volume) => (
                <button
                  key={volume.value}
                  type="button"
                  onClick={() => updateField("clientVolume", volume.value)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                    formData.clientVolume === volume.value
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border hover:border-accent/30 text-body"
                  )}
                >
                  {volume.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 11: Student Status */}
      {step === 11 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Student Status</h2>
              <p className="text-sm text-muted mt-1">Are you currently a student? BeautyLink partners with beauty schools and universities.</p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => updateField("isStudent", true)}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                  formData.isStudent
                    ? "border-accent bg-accent-light text-accent"
                    : "border-border hover:border-accent/30 text-body"
                )}
              >
                Yes, I&apos;m a student
              </button>
              <button
                type="button"
                onClick={() => { updateField("isStudent", false); updateField("school", ""); }}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                  !formData.isStudent
                    ? "border-accent bg-accent-light text-accent"
                    : "border-border hover:border-accent/30 text-body"
                )}
              >
                No, I&apos;m not a student
              </button>
            </div>
            {formData.isStudent && (
              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <Input
                  id="school"
                  placeholder="e.g. UCLA, LMU, Marinello..."
                  value={formData.school}
                  onChange={(e) => updateField("school", e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 12: Agreement */}
      {step === 12 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-dark">Review & Submit</h2>
              <p className="text-sm text-muted mt-1">Almost there! Review your info and submit your application.</p>
            </div>

            {/* Quick Summary */}
            <div className="rounded-lg bg-background p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Display Name</span>
                <span className="font-medium">{formData.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Services</span>
                <span className="font-medium">
                  {formData.serviceCategories
                    .map((v) => SERVICE_CATEGORIES.find((c) => c.value === v)?.label)
                    .join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Experience</span>
                <span className="font-medium">
                  {YEARS_EXPERIENCE_OPTIONS.find((o) => o.value === formData.yearsExperience)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Work Setting</span>
                <span className="font-medium">
                  {WORK_SETTINGS.find((o) => o.value === formData.workSetting)?.label}
                </span>
              </div>
              {formData.licenseType && (
                <div className="flex justify-between">
                  <span className="text-muted">License</span>
                  <span className="font-medium">
                    {LICENSE_TYPES.find((o) => o.value === formData.licenseType)?.label} — {formData.licenseNumber || "No #"}
                  </span>
                </div>
              )}
              {formData.instagramUrl && (
                <div className="flex justify-between">
                  <span className="text-muted">Instagram</span>
                  <span className="font-medium">{formData.instagramUrl}</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => updateField("agreedToTerms", checked === true)}
              />
              <Label htmlFor="terms" className="text-sm leading-snug">
                I confirm that all information is accurate and I agree to BeautyLink&apos;s{" "}
                <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
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

        {step < 12 ? (
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
