import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { proApplicationSchema } from "@/lib/validators";
import type { WorkSetting, YearsExperience, LicenseStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = proApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid application data." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if user already has a professional profile
    const existingProfile = await db.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "You already have a professional profile." },
        { status: 409 }
      );
    }

    // Determine license status based on provided fields
    const hasLicense = !!(data.licenseType && data.licenseNumber);
    const licenseStatus: LicenseStatus = hasLicense
      ? "LICENSE_DECLARED"
      : "NOT_PROVIDED";

    // Create profile and update user role in a transaction
    const profile = await db.$transaction(async (tx) => {
      const professionalProfile = await tx.professionalProfile.create({
        data: {
          userId: user.id,
          displayName: data.businessName,
          bio: data.bio,
          servicesOffered: data.serviceCategories,
          yearsExperience: data.yearsExperience as YearsExperience,
          workSetting: data.workSetting as WorkSetting,
          licenseStatus,
          licenseType: data.licenseType || null,
          licenseNumber: data.licenseNumber || null,
          licenseState: data.licenseState || null,
          instagramHandle: data.instagramUrl || null,
          portfolioPhotos: body.portfolioPhotos || [],
          applicationStatus: "PENDING",
          applicationSubmittedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { role: "PROFESSIONAL" },
      });

      return professionalProfile;
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("[PROVIDERS_APPLY]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
