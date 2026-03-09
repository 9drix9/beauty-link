"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";
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
} from "@/lib/constants";
import { calculatePriceBreakdown, validateDiscount } from "@/lib/pricing";
import { formatPrice, calcSavingsPercent } from "@/lib/utils";
import { createListingSchema } from "@/lib/validators";

export function CreateListingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Service Details
  const [serviceCategory, setServiceCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>([""]);
  const [durationMinutes, setDurationMinutes] = useState("");

  // Pricing
  const [originalPriceDollars, setOriginalPriceDollars] = useState("");
  const [discountedPriceDollars, setDiscountedPriceDollars] = useState("");

  // Appointment Details
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [maxClients, setMaxClients] = useState("1");

  // Location
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [launchZone, setLaunchZone] = useState("");

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

  // Subcategories based on selected category
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

  function buildFormData() {
    const locationAddress = [addressLine1, city, state, zipCode]
      .filter(Boolean)
      .join(", ");

    return {
      serviceCategory,
      subCategory: subCategory || undefined,
      title,
      description,
      originalPriceCents,
      discountedPriceCents,
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
    };
  }

  async function handleSubmit(status: "LIVE" | "DRAFT") {
    setError(null);
    const data = buildFormData();

    // Client-side validation
    const result = createListingSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.issues[0];
      setError(firstError.message);
      return;
    }

    // Discount validation
    if (discountValidation && !discountValidation.valid) {
      setError(
        discountValidation.error ||
          "Invalid discount"
      );
      return;
    }

    // Date must be in the future
    const selectedDate = new Date(appointmentDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
      setError("Appointment date must be in the future.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/providers/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to create listing.");
        return;
      }

      router.push("/pro/appointments");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Minimum date for input
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

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
            <p className="text-xs text-gray-400">
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
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  )}
                </div>
              ))}
              {whatsIncluded.length < MAX_WHATS_INCLUDED && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addIncludedItem}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add item
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationMinutes">Duration</Label>
            <Select
              value={durationMinutes}
              onValueChange={setDurationMinutes}
            >
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

      {/* Pricing */}
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
              <Label htmlFor="discountedPrice">
                BeautyLink Discounted Price ($)
              </Label>
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

          {/* Discount validation feedback */}
          {discountValidation && !discountValidation.valid && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p className="text-sm text-red-700">
                {discountValidation.error}
              </p>
            </div>
          )}

          {discountValidation && discountValidation.valid && savingsPercent > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <p className="text-sm text-green-700">
                {savingsPercent}% discount — great value for customers!
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Customers will also pay a 5% service fee on top of your discounted
            price.
          </p>

          {/* Price preview */}
          {priceBreakdown && discountValidation?.valid && (
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-medium text-purple-900">
                Customer pays:{" "}
                <span className="text-lg font-bold">
                  {formatPrice(priceBreakdown.totalCharged)}
                </span>
                <span className="ml-1 text-xs font-normal text-purple-600">
                  (including {formatPrice(priceBreakdown.platformFee)} service
                  fee)
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location</CardTitle>
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
