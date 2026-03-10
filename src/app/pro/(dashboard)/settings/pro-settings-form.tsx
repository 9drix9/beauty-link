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
import { WORK_SETTINGS } from "@/lib/constants";
import { Loader2, Check } from "lucide-react";

interface ProSettingsFormProps {
  profile: {
    displayName: string;
    bio: string;
    city: string;
    state: string;
    instagramHandle: string;
    specialties: string[];
    workSetting: string;
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
  const [instagramHandle, setInstagramHandle] = useState(
    profile.instagramHandle
  );
  const [specialtiesText, setSpecialtiesText] = useState(
    profile.specialties.join(", ")
  );
  const [workSetting, setWorkSetting] = useState(profile.workSetting);

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
          instagramHandle: instagramHandle.trim(),
          specialties,
          workSetting,
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
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
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
