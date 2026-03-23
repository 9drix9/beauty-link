"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/shared/image-upload";
import { WORK_SETTINGS, LAUNCH_ZONES, DURATION_OPTIONS } from "@/lib/constants";
import { Loader2, Check, MapPin } from "lucide-react";

interface ProSettingsFormProps {
  profile: {
    displayName: string;
    bio: string;
    city: string;
    state: string;
    neighborhood: string;
    instagramHandle: string;
    specialties: string[];
    workSetting: string;
    portfolioPhotos: string[];
    defaultAddressLine1: string;
    defaultCity: string;
    defaultState: string;
    defaultZipCode: string;
    defaultLaunchZone: string;
    defaultDurationMinutes: number | null;
  };
}

export function ProSettingsForm({ profile }: ProSettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [neighborhood, setNeighborhood] = useState(profile.neighborhood);
  const [instagramHandle, setInstagramHandle] = useState(
    profile.instagramHandle
  );
  const [specialtiesText, setSpecialtiesText] = useState(
    profile.specialties.join(", ")
  );
  const [workSetting, setWorkSetting] = useState(profile.workSetting);
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>(
    profile.portfolioPhotos
  );

  // Listing defaults
  const [defaultAddressLine1, setDefaultAddressLine1] = useState(
    profile.defaultAddressLine1
  );
  const [defaultCity, setDefaultCity] = useState(profile.defaultCity);
  const [defaultState, setDefaultState] = useState(profile.defaultState);
  const [defaultZipCode, setDefaultZipCode] = useState(profile.defaultZipCode);
  const [defaultLaunchZone, setDefaultLaunchZone] = useState(
    profile.defaultLaunchZone
  );
  const [defaultDurationMinutes, setDefaultDurationMinutes] = useState(
    profile.defaultDurationMinutes?.toString() || ""
  );

  async function handleSave() {
    if (!displayName.trim() || displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters.");
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const specialties = specialtiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/providers/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          bio: bio.trim(),
          city: city.trim(),
          state: state.trim(),
          neighborhood: neighborhood.trim(),
          instagramHandle: instagramHandle.trim(),
          specialties,
          workSetting,
          portfolioPhotos,
          defaultAddressLine1: defaultAddressLine1.trim(),
          defaultCity: defaultCity.trim(),
          defaultState: defaultState.trim(),
          defaultZipCode: defaultZipCode.trim(),
          defaultLaunchZone: defaultLaunchZone,
          defaultDurationMinutes: defaultDurationMinutes
            ? parseInt(defaultDurationMinutes)
            : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save.");
      }

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Error */}
      {error && (
        <div className="rounded-lg border border-error/20 bg-error-light px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Success */}
      {saved && (
        <div className="rounded-lg border border-success/20 bg-success-light px-4 py-3 text-sm text-success flex items-center gap-2">
          <Check className="h-4 w-4" aria-hidden="true" />
          Profile saved successfully.
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Hair by Maria"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell clients about yourself..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted text-right">
              {bio.length}/500
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Los Angeles"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="e.g. CA"
                maxLength={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Neighborhood</Label>
            <Input
              id="neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="e.g. Westwood, Beverly Hills, Santa Monica"
            />
            <p className="text-xs text-muted">
              This is shown to clients instead of your full address for safety.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Work Setting</Label>
            <Select value={workSetting} onValueChange={setWorkSetting}>
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
        </CardContent>
      </Card>

      {/* Listing Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
            Listing Defaults
          </CardTitle>
          <p className="text-sm text-muted">
            Set up your defaults once — they&apos;ll auto-fill every time you create a new listing.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultAddressLine1">Default Address</Label>
            <Input
              id="defaultAddressLine1"
              value={defaultAddressLine1}
              onChange={(e) => setDefaultAddressLine1(e.target.value)}
              placeholder="Your studio / salon address"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultCity">City</Label>
              <Input
                id="defaultCity"
                value={defaultCity}
                onChange={(e) => setDefaultCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultState">State</Label>
              <Input
                id="defaultState"
                value={defaultState}
                onChange={(e) => setDefaultState(e.target.value.toUpperCase())}
                placeholder="CA"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultZipCode">ZIP Code</Label>
              <Input
                id="defaultZipCode"
                value={defaultZipCode}
                onChange={(e) => setDefaultZipCode(e.target.value)}
                placeholder="90001"
                maxLength={5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Launch Zone</Label>
            <Select value={defaultLaunchZone} onValueChange={setDefaultLaunchZone}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label>Default Duration</Label>
            <Select
              value={defaultDurationMinutes}
              onValueChange={setDefaultDurationMinutes}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted">
              This will be pre-selected when you create new listings.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-4">
            Showcase your best work. Upload up to 10 photos that will appear on your profile and can be used in listings.
          </p>
          <ImageUpload
            value={portfolioPhotos}
            onChange={(val) => setPortfolioPhotos(val as string[])}
            multiple
            maxImages={10}
            folder="portfolio"
            placeholder="Add portfolio photo"
          />
        </CardContent>
      </Card>

      {/* Specialties & Social */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Specialties & Social</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialties">Specialties</Label>
            <Input
              id="specialties"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder="e.g. Balayage, Color Correction, Extensions"
            />
            <p className="text-xs text-muted">
              Comma-separated, up to 15
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram Handle</Label>
            <Input
              id="instagram"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="@yourusername"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button
          variant="cta"
          size="lg"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
