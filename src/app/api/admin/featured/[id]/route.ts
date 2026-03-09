import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { isFeatured } = body as { isFeatured: boolean };

    if (typeof isFeatured !== "boolean") {
      return NextResponse.json(
        { error: "isFeatured must be a boolean" },
        { status: 400 }
      );
    }

    const profile = await db.professionalProfile.findUnique({
      where: { id: params.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 }
      );
    }

    const updatedProfile = await db.$transaction(async (tx) => {
      const updated = await tx.professionalProfile.update({
        where: { id: params.id },
        data: { isFeatured },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      await tx.adminAction.create({
        data: {
          adminUserId: user.id,
          actionType: isFeatured ? "FEATURE_PROFESSIONAL" : "UNFEATURE_PROFESSIONAL",
          targetType: "PROFESSIONAL_PROFILE",
          targetId: params.id,
          metadataJson: JSON.stringify({
            displayName: profile.displayName,
            isFeatured,
          }),
        },
      });

      return updated;
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating featured status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
