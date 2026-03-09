import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proApplicationSchema } from "@/lib/validators";
import type { LicenseType, WorkSetting, YearsExperience } from "@prisma/client";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = proApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid application data." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Find user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { professionalProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.professionalProfile) {
      return NextResponse.json(
        { error: "You already have a professional profile." },
        { status: 409 }
      );
    }

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
          licenseType: data.licenseType as LicenseType,
          licenseNumber: data.licenseNumber,
          licenseState: data.licenseState,
          instagramHandle: data.instagramUrl || null,
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
