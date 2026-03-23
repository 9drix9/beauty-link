import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ isPro: false, isProfessional: false });
    }

    const profile = await db.professionalProfile.findUnique({
      where: { userId: user.id },
      select: { applicationStatus: true },
    });

    return NextResponse.json({
      isPro: profile?.applicationStatus === "APPROVED",
      isProfessional: user.role === "PROFESSIONAL" || !!profile,
      role: user.role,
    });
  } catch {
    return NextResponse.json({ isPro: false, isProfessional: false });
  }
}
