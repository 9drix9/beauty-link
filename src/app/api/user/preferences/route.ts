import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

const ALLOWED_FIELDS = [
  "notifEmailMessages",
  "notifEmailReminders",
  "notifPushMessages",
  "notifPushReminders",
  "marketingConsent",
] as const;

type PreferenceField = (typeof ALLOWED_FIELDS)[number];

export async function PATCH(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await req.json();

    // Only allow known boolean notification fields
    const updateData: Partial<Record<PreferenceField, boolean>> = {};

    for (const field of ALLOWED_FIELDS) {
      if (field in body && typeof body[field] === "boolean") {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        notifEmailMessages: true,
        notifEmailReminders: true,
        notifPushMessages: true,
        notifPushReminders: true,
        marketingConsent: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
