"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  FileText,
  Zap,
  Save,
} from "lucide-react";
import { ImageUpload } from "@/components/shared/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  SUB_CATEGORIES,
  DURATION_OPTIONS,
  LAUNCH_ZONES,
  MAX_WHATS_INCLUDED,
  SKILL_LEVELS,
  DISCOUNT_SUGGESTIONS,
} from "@/lib/constants";
import { calculatePriceBreakdown, validateDiscount } from "@/lib/pricing";
import { formatPrice, calcSavingsPercent } from "@/lib/utils";
import { createListingSchema, createModelCallSchema } from "@/lib/validators";

interface SerializedTemplate {
  id: string;
  name: string;
  serviceCategory: string;
  subCategory: string | null;
  title: string;
  description: string | null;
  whatsIncluded: string[];
  durationMinutes: number;
  coverPhotoUrl: string | null;
  originalPriceCents: number | null;
  discountedPriceCents: number | null;
  isModelCall: boolean;
  skillLevel: string | null;
  modelRequirements: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  launchZone: string | null;
  maxClients: number;
  [key: string]: unknown;
}

interface ProfileDefaults {
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  launchZone: string;
  durationMinutes: number | null;
  portfolioPhotos: string[];
}

interface SourceListing {
  id: string;
  serviceCategory: string;
  serviceName: string;
  description: string | null;
  whatsIncluded: string[];
  durationMinutes: number;
  originalPrice: number;
  discountedPrice: number;
  listingPhotoUrl: string | null;
  locationAddress: string | null;
  launchZone: string | null;
  maxClients: number;
  isModelCall: boolean;
  skillLevel: string | null;
  modelRequirements: string | null;
  templateId: string | null;
  [key: string]: unknown;
}

interface RecentListing {
  id: string;
  serviceName: string;
  serviceCategory: string;
  appointmentDate: string;
  appointmentTime: string;
  originalPrice: number;
  discountedPrice: number;
  durationMinutes: number;
  isModelCall: boolean;
}

interface CreateListingFormProps {
  templates: SerializedTemplate[];
  profileDefaults: ProfileDefaults;
  selectedTemplateId?: string;
  sourceListing: SourceListing | null;
  recentListings: RecentListing[];
  mode: string;
}

export function CreateListingForm({
  templates,
  profileDefaults,
  selectedTemplateId: initialTemplateId,
  sourceListing,
  recentListings,
  mode,
}: CreateListingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(
    initialTemplateId || null
  );

  // Listing Type
  const [isModelCall, setIsModelCall] = useState(sourceListing?.isModelCall || false);
  const [skillLevel, setSkillLevel] = useState(sourceListing?.skillLevel || "");
  const [modelRequirements, setModelRequirements] = useState(
    sourceListing?.modelRequirements || ""
  );

  // Service Details
  const [serviceCategory, setServiceCategory] = useState(
    sourceListing?.serviceCategory || ""
  );
  const [subCategory, setSubCategory] = useState("");
  const [title, setTitle] = useState(sourceListing?.serviceName || "");
  const [description, setDescription] = useState(
    sourceListing?.description || ""
  );
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(
    sourceListing?.whatsIncluded?.length ? sourceListing.whatsIncluded : [""]
  );
  const [durationMinutes, setDurationMinutes] = useState(
    sourceListing?.durationMinutes?.toString() ||
      profileDefaults.durationMinutes?.toString() ||
      ""
  );

  // Pricing
  const [originalPriceDollars, setOriginalPriceDollars] = useState(
    sourceListing ? (sourceListing.originalPrice / 100).toFixed(2) : ""
  );
  const [discountedPriceDollars, setDiscountedPriceDollars] = useState(
    sourceListing ? (sourceListing.discountedPrice / 100).toFixed(2) : ""
  );

  // Appointment Details
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [maxClients, setMaxClients] = useState(
    sourceListing?.maxClients?.toString() || "1"
  );

  // Photo
  const [listingPhoto, setListingPhoto] = useState(
    sourceListing?.listingPhotoUrl || ""
  );

  // Location (auto-fill from profile defaults)
  const [addressLine1, setAddressLine1] = useState(
    profileDefaults.addressLine1
  );
  const [city, setCity] = useState(profileDefaults.city);
  const [state, setState] = useState(profileDefaults.state);
  const [zipCode, setZipCode] = useState(profileDefaults.zipCode);
  const [launchZone, setLaunchZone] = useState(profileDefaults.launchZone);

  // Auto-save draft state
  const [lastAutoSave, setLastAutoSave] = useState<string | null>(null);

  // Apply template
  function applyTemplate(template: SerializedTemplate) {
    setAppliedTemplateId(template.id);
    setIsModelCall(template.isModelCall);
    setSkillLevel(template.skillLevel || "");
    setModelRequirements(template.modelRequirements || "");
    setServiceCategory(template.serviceCategory);
    setSubCategory(template.subCategory || "");
    setTitle(template.title);
    setDescription(template.description || "");
    setWhatsIncluded(
      template.whatsIncluded.length > 0 ? template.whatsIncluded : [""]
    );
    setDurationMinutes(template.durationMinutes.toString());
    setListingPhoto(template.coverPhotoUrl || "");
    if (template.originalPriceCents) {
      setOriginalPriceDollars((template.originalPriceCents / 100).toFixed(2));
    }
    if (template.discountedPriceCents) {
      setDiscountedPriceDollars((template.discountedPriceCents / 100).toFixed(2));
    }
    if (template.addressLine1) setAddressLine1(template.addressLine1);
    if (template.city) setCity(template.city);
    if (template.state) setState(template.state);
    if (template.zipCode) setZipCode(template.zipCode);
    if (template.launchZone) setLaunchZone(template.launchZone);
    if (template.maxClients) setMaxClients(template.maxClients.toString());
  }

  // Apply initial template on mount
  useEffect(() => {
    if (initialTemplateId) {
      const t = templates.find((t) => t.id === initialTemplateId);
      if (t) applyTemplate(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || description) {
        const draft = {
          isModelCall, serviceCategory, subCategory, title, description,
          whatsIncluded, durationMinutes, originalPriceDollars,
          discountedPriceDollars, appointmentDate, appointmentTime,
          maxClients, listingPhoto, addressLine1, city, state, zipCode, launchZone,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem("beautylink_listing_draft", JSON.stringify(draft));
        setLastAutoSave(new Date().toLocaleTimeString());
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [
    title, description, serviceCategory, durationMinutes, originalPriceDollars,
    discountedPriceDollars, appointmentDate, appointmentTime, isModelCall,
    subCategory, whatsIncluded, maxClients, listingPhoto, addressLine1,
    city, state, zipCode, launchZone,
  ]);

  // Restore draft on mount if no template/source
  useEffect(() => {
    if (!initialTemplateId && !sourceListing) {
      const saved = localStorage.getItem("beautylink_listing_draft");
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          const savedTime = new Date(draft.savedAt);
          const hoursSince = (Date.now() - savedTime.getTime()) / (1000 * 60 * 60);
          // Only restore if less than 24 hours old
          if (hoursSince < 24 && draft.title) {
            setIsModelCall(draft.isModelCall || false);
            setServiceCategory(draft.serviceCategory || "");
            setSubCategory(draft.subCategory || "");
            setTitle(draft.title || "");
            setDescription(draft.description || "");
            setWhatsIncluded(draft.whatsIncluded || [""]);
            setDurationMinutes(draft.durationMinutes || "");
            setOriginalPriceDollars(draft.originalPriceDollars || "");
            setDiscountedPriceDollars(draft.discountedPriceDollars || "");
            setAppointmentDate(draft.appointmentDate || "");
            setAppointmentTime(draft.appointmentTime || "");
            setMaxClients(draft.maxClients || "1");
            setListingPhoto(draft.listingPhoto || "");
            if (draft.addressLine1) setAddressLine1(draft.addressLine1);
            if (draft.city) setCity(draft.city);
            if (draft.state) setState(draft.state);
            if (draft.zipCode) setZipCode(draft.zipCode);
            if (draft.launchZone) setLaunchZone(draft.launchZone);
            setLastAutoSave("Restored from draft");
          }
        } catch {
          // Ignore corrupted drafts
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived pricing
  const originalPriceCents = Math.round(
    (parseFloat(originalPriceDollars) || 0) * 100
  );
  const discountedPriceCents = Math.round(
    (parseFloat(discountedPriceDollars) || 0) * 100
  );

  const discountValidation = useMemo(() => {
    if (!originalPriceCents || !discountedPriceCents) return null;
    return validateDiscount(originalPriceCents, discountedPriceCents);
  }, [originalPriceCents, discountedPriceCents]);

  const priceBreakdown = useMemo(() => {
    if (!originalPriceCents || !discountedPriceCents) return null;
    return calculatePriceBreakdown(originalPriceCents, discountedPriceCents);
  }, [originalPriceCents, discountedPriceCents]);

  const savingsPercent = useMemo(() => {
    if (!originalPriceCents || !discountedPriceCents) return 0;
    return calcSavingsPercent(originalPriceCents, discountedPriceCents);
  }, [originalPriceCents, discountedPriceCents]);

  const availableSubCategories = serviceCategory
    ? SUB_CATEGORIES[serviceCategory] || []
    : [];

  function addIncludedItem() {
    if (whatsIncluded.length < MAX_WHATS_INCLUDED) {
      setWhatsIncluded([...whatsIncluded, ""]);
    }
  }

  function removeIncludedItem(index: number) {
    setWhatsIncluded(whatsIncluded.filter((_, i) => i !== index));
  }

  function updateIncludedItem(index: number, value: string) {
    const updated = [...whatsIncluded];
    updated[index] = value;
    setWhatsIncluded(updated);
  }

  function applySuggestion(percent: number) {
    if (!originalPriceCents) return;
    const suggested = Math.round(originalPriceCents * (1 - percent / 100));
    setDiscountedPriceDollars((suggested / 100).toFixed(2));
  }

  function buildFormData() {
    const locationAddress = [addressLine1, city, state, zipCode]
      .filter(Boolean)
      .join(", ");

    const base = {
      serviceCategory,
      title,
      description,
      durationMinutes: parseInt(durationMinutes) || 0,
      appointmentDate,
      appointmentTime,
      maxClients: parseInt(maxClients),
      whatsIncluded: whatsIncluded.filter((item) => item.trim() !== ""),
      addressLine1,
      city,
      state: state.toUpperCase(),
      zipCode,
      launchZone: launchZone || undefined,
      locationAddress,
      listingPhotoUrl: listingPhoto || undefined,
      templateId: appliedTemplateId || undefined,
    };

    if (isModelCall) {
      return {
        ...base,
        isModelCall: true,
        skillLevel,
        modelRequirements: modelRequirements || undefined,
      };
    }

    return {
      ...base,
      subCategory: subCategory || undefined,
      originalPriceCents,
      discountedPriceCents,
    };
  }

  async function handleSubmit(status: "LIVE" | "DRAFT") {
    setError(null);
    const data = buildFormData();

    // Client-side validation
    if (isModelCall) {
      const result = createModelCallSchema.safeParse(data);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
    } else {
      const result = createListingSchema.safeParse(data);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
      if (discountValidation && !discountValidation.valid) {
        setError(discountValidation.error || "Invalid discount");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        ...data,
        status,
        saveAsTemplate: showSaveTemplate && templateName.trim(),
        templateName: templateName.trim() || undefined,
      };

      const res = await fetch("/api/providers/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const resBody = await res.json();
        setError(resBody.error || "Failed to create listing.");
        return;
      }

      // Clear auto-saved draft
      localStorage.removeItem("beautylink_listing_draft");

      router.push("/pro/appointments?posted=true");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Template picker (when mode is "choose") */}
      {mode === "choose" && templates.length > 0 && !appliedTemplateId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" aria-hidden="true" />
              Choose a Template
            </CardTitle>
            <p className="text-sm text-muted">
              Select a template to auto-fill your listing details.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="flex items-center justify-between rounded-xl border border-border p-3 text-left transition-all hover:border-accent/30 hover:bg-accent-light/30"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-dark text-sm">
                      {template.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5 truncate">
                      {template.title} — {template.durationMinutes} min
                      {template.originalPriceCents
                        ? ` — ${formatPrice(template.originalPriceCents)}`
                        : " — Model Call"}
                    </p>
                  </div>
                  <Zap className="h-4 w-4 text-muted shrink-0 ml-2" aria-hidden="true" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applied template badge */}
      {appliedTemplateId && (
        <div className="flex items-center gap-2 rounded-lg bg-accent-light/50 border border-accent/10 px-4 py-2.5">
          <FileText className="h-4 w-4 text-accent" aria-hidden="true" />
          <span className="text-sm text-accent font-medium">
            Using template: {templates.find((t) => t.id === appliedTemplateId)?.name}
          </span>
          <button
            type="button"
            onClick={() => setAppliedTemplateId(null)}
            className="ml-auto text-xs text-muted hover:text-dark"
          >
            Clear
          </button>
        </div>
      )}

      {/* Auto-save indicator */}
      {lastAutoSave && (
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Save className="h-3 w-3" aria-hidden="true" />
          Draft saved: {lastAutoSave}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-error/20 bg-error-light p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Listing Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Listing Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsModelCall(false)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                !isModelCall
                  ? "border-accent bg-accent-light"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <p className="font-semibold text-dark text-sm">Regular Appointment</p>
              <p className="text-xs text-muted mt-1">Paid listing with discounted pricing</p>
            </button>
            <button
              type="button"
              onClick={() => setIsModelCall(true)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                isModelCall
                  ? "border-accent bg-accent-light"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <p className="font-semibold text-dark text-sm">Model Call</p>
              <p className="text-xs text-muted mt-1">Free service for training or portfolio work</p>
            </button>
          </div>

          {isModelCall && (
            <div className="mt-4 space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger id="skillLevel">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelRequirements">Model Requirements (Optional)</Label>
                <Textarea
                  id="modelRequirements"
                  value={modelRequirements}
                  onChange={(e) => setModelRequirements(e.target.value)}
                  placeholder="e.g. Looking for medium to long hair, any texture."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted text-right">{modelRequirements.length}/500</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serviceCategory">Service Category</Label>
              <Select
                value={serviceCategory}
                onValueChange={(value) => {
                  setServiceCategory(value);
                  setSubCategory("");
                }}
              >
                <SelectTrigger id="serviceCategory">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub-category</Label>
              <Select
                value={subCategory}
                onValueChange={setSubCategory}
                disabled={availableSubCategories.length === 0}
              >
                <SelectTrigger id="subCategory">
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubCategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Service Name / Title</Label>
            <Input
              id="title"
              placeholder="e.g., Full Set Acrylic Nails with Gel Polish"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what the client can expect..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted">
              {description.length}/1000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label>What&apos;s Included (up to {MAX_WHATS_INCLUDED})</Label>
            <div className="space-y-2">
              {whatsIncluded.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Item ${index + 1}, e.g., "Gel polish application"`}
                    value={item}
                    onChange={(e) => updateIncludedItem(index, e.target.value)}
                  />
                  {whatsIncluded.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIncludedItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-muted" />
                    </Button>
                  )}
                </div>
              ))}
              {whatsIncluded.length < MAX_WHATS_INCLUDED && (
                <Button type="button" variant="ghost" size="sm" onClick={addIncludedItem}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add item
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationMinutes">Duration</Label>
            <Select value={durationMinutes} onValueChange={setDurationMinutes}>
              <SelectTrigger id="durationMinutes">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listing Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Listing Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={listingPhoto}
            onChange={(val) => setListingPhoto(val as string)}
            folder="listings"
            aspectRatio="aspect-video"
            placeholder="Add a cover photo for your listing"
          />
          {/* Portfolio photo suggestions */}
          {!listingPhoto && profileDefaults.portfolioPhotos.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted mb-2">Or use a portfolio photo:</p>
              <div className="flex gap-2 overflow-x-auto">
                {profileDefaults.portfolioPhotos.slice(0, 5).map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setListingPhoto(photo)}
                    className="shrink-0 h-16 w-16 rounded-lg overflow-hidden border border-border hover:border-accent transition-colors"
                  >
                    <Image src={photo} alt={`Portfolio ${i + 1}`} width={64} height={64} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing (hidden for model calls) */}
      {!isModelCall && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Your Normal Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="10"
                  step="0.01"
                  placeholder="0.00"
                  value={originalPriceDollars}
                  onChange={(e) => setOriginalPriceDollars(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">BeautyLink Discounted Price ($)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={discountedPriceDollars}
                  onChange={(e) => setDiscountedPriceDollars(e.target.value)}
                />
              </div>
            </div>

            {/* Discount suggestions */}
            {originalPriceCents > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted font-medium">Suggested discounts:</p>
                <div className="flex flex-wrap gap-2">
                  {DISCOUNT_SUGGESTIONS.map((s) => {
                    const suggestedCents = Math.round(
                      originalPriceCents * (1 - s.percent / 100)
                    );
                    const isSelected = discountedPriceCents === suggestedCents;
                    return (
                      <button
                        key={s.percent}
                        type="button"
                        onClick={() => applySuggestion(s.percent)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          isSelected
                            ? "border-accent bg-accent-light text-accent"
                            : "border-border text-body hover:border-accent hover:text-accent"
                        }`}
                      >
                        {s.label} = {formatPrice(suggestedCents)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {discountValidation && !discountValidation.valid && (
              <div className="flex items-start gap-2 rounded-lg border border-error/20 bg-error-light p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
                <p className="text-sm text-error">{discountValidation.error}</p>
              </div>
            )}

            {discountValidation?.valid && savingsPercent > 0 && (
              <div className="flex items-start gap-2 rounded-lg border border-success/20 bg-success-light p-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <p className="text-sm text-success">
                  {savingsPercent}% discount. Great value for customers!
                </p>
              </div>
            )}

            <p className="text-xs text-muted">
              Customers will also pay a small service fee on top of your discounted price.
            </p>

            {priceBreakdown && discountValidation?.valid && (
              <div className="rounded-lg border border-accent/20 bg-accent-light p-4">
                <p className="text-sm font-medium text-accent">
                  Customer pays:{" "}
                  <span className="text-lg font-bold">
                    {formatPrice(priceBreakdown.totalCharged)}
                  </span>
                  <span className="ml-1 text-xs font-normal text-accent">
                    (including {formatPrice(priceBreakdown.platformFee)} service fee)
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Date</Label>
              <Input
                id="appointmentDate"
                type="date"
                min={minDate}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Time</Label>
              <Input
                id="appointmentTime"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxClients">Max Clients</Label>
            <Select value={maxClients} onValueChange={setMaxClients}>
              <SelectTrigger id="maxClients">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 client</SelectItem>
                <SelectItem value="2">2 clients</SelectItem>
                <SelectItem value="3">3 clients</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recent listings for quick date picking */}
          {recentListings.length > 0 && (
            <div className="rounded-lg bg-background p-3 space-y-2">
              <p className="text-xs text-muted font-medium">
                Repeat a recent time slot:
              </p>
              <div className="flex flex-wrap gap-2">
                {recentListings.slice(0, 4).map((recent) => {
                  const date = new Date(recent.appointmentDate);
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                  const [h, m] = recent.appointmentTime.split(":").map(Number);
                  const period = h >= 12 ? "PM" : "AM";
                  const displayHour = h % 12 || 12;
                  return (
                    <button
                      key={recent.id}
                      type="button"
                      onClick={() => {
                        setAppointmentTime(recent.appointmentTime);
                      }}
                      className="rounded-full border border-border px-3 py-1 text-xs text-body hover:border-accent hover:text-accent transition-colors"
                    >
                      {dayName} {displayHour}:{m.toString().padStart(2, "0")} {period}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location</CardTitle>
          {(profileDefaults.addressLine1 || profileDefaults.city) && (
            <p className="text-xs text-success flex items-center gap-1">
              <CheckCircle className="h-3 w-3" aria-hidden="true" />
              Auto-filled from your profile
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address</Label>
            <Input
              id="addressLine1"
              placeholder="Street address"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="CA"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="90001"
                maxLength={5}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="launchZone">Launch Zone (optional)</Label>
            <Select value={launchZone} onValueChange={setLaunchZone}>
              <SelectTrigger id="launchZone">
                <SelectValue placeholder="Select a zone" />
              </SelectTrigger>
              <SelectContent>
                {LAUNCH_ZONES.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save as Template */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-dark text-sm">Save as Template</p>
              <p className="text-xs text-muted mt-0.5">
                Reuse this service for faster posting next time
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSaveTemplate(!showSaveTemplate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showSaveTemplate ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showSaveTemplate ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {showSaveTemplate && (
            <div className="mt-3 space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                placeholder='e.g. "Blowout — 60 min" or "Full Set Acrylics"'
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted">
                Date, time, and one-off notes won&apos;t be saved to the template.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Separator />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="secondary"
          size="lg"
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={() => handleSubmit("DRAFT")}
        >
          Save as Draft
        </Button>
        <Button
          variant="cta"
          size="lg"
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={() => handleSubmit("LIVE")}
        >
          Publish Listing
        </Button>
      </div>
    </div>
  );
}
