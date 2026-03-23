import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.applicationStatus !== "APPROVED") {
      return NextResponse.json({ error: "Not a professional" }, { status: 403 });
    }

    const body = await req.json();

    const allowedFields: Record<string, unknown> = {};

    if (typeof body.displayName === "string" && body.displayName.trim().length >= 2) {
      allowedFields.displayName = body.displayName.trim().slice(0, 100);
    }
    if (typeof body.bio === "string") {
      allowedFields.bio = body.bio.trim().slice(0, 500);
    }
    if (typeof body.city === "string") {
      allowedFields.city = body.city.trim().slice(0, 100);
    }
    if (typeof body.state === "string") {
      allowedFields.state = body.state.trim().toUpperCase().slice(0, 2);
    }
    if (typeof body.neighborhood === "string") {
      allowedFields.neighborhood = body.neighborhood.trim().slice(0, 100);
    }
    if (typeof body.instagramHandle === "string") {
      allowedFields.instagramHandle = body.instagramHandle.trim().slice(0, 100);
    }
    if (Array.isArray(body.specialties)) {
      allowedFields.specialties = body.specialties
        .filter((s: unknown) => typeof s === "string")
        .slice(0, 15)
        .map((s: string) => s.trim());
    }
    if (typeof body.workSetting === "string") {
      allowedFields.workSetting = body.workSetting;
    }
    if (Array.isArray(body.portfolioPhotos)) {
      allowedFields.portfolioPhotos = body.portfolioPhotos
        .filter((url: unknown) => typeof url === "string" && url.length > 0)
        .slice(0, 10);
    }
    if (Array.isArray(body.profileBadges)) {
      const validBadges = ["NEW", "TRAINEE", "STUDENT", "EMERGING", "EXPERIENCED", "SPECIALIST"];
      allowedFields.profileBadges = body.profileBadges
        .filter((b: unknown) => typeof b === "string" && validBadges.includes(b as string))
        .slice(0, 6);
    }
    // Listing defaults
    if (typeof body.defaultAddressLine1 === "string") {
      allowedFields.defaultAddressLine1 = body.defaultAddressLine1.trim().slice(0, 200);
    }
    if (typeof body.defaultCity === "string") {
      allowedFields.defaultCity = body.defaultCity.trim().slice(0, 100);
    }
    if (typeof body.defaultState === "string") {
      allowedFields.defaultState = body.defaultState.trim().toUpperCase().slice(0, 2);
    }
    if (typeof body.defaultZipCode === "string") {
      allowedFields.defaultZipCode = body.defaultZipCode.trim().slice(0, 5);
    }
    if (typeof body.defaultLaunchZone === "string") {
      allowedFields.defaultLaunchZone = body.defaultLaunchZone.trim();
    }
    if (typeof body.defaultDurationMinutes === "number") {
      allowedFields.defaultDurationMinutes = body.defaultDurationMinutes;
    }

    const updated = await db.professionalProfile.update({
      where: { id: profile.id },
      data: allowedFields,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PROVIDERS_PROFILE_UPDATE]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
