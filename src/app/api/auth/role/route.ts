import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

const VALID_ROLES = Object.values(UserRole);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role } = body as { role: string };

    if (!role || !VALID_ROLES.includes(role as UserRole)) {
      return NextResponse.json(
        {
          error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Prevent users from assigning themselves the ADMIN role
    if (role === UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Cannot self-assign ADMIN role" },
        { status: 403 }
      );
    }

    // Update the user's role in the database
    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: { role: role as UserRole },
      select: {
        id: true,
        clerkId: true,
        role: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    // Sync role to Clerk's publicMetadata so it's available in the JWT
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error("Error updating user role:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
