import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await db.user.findUnique({
    where: { clerkId },
  });

  if (!adminUser || adminUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { action } = await req.json();
  const targetUserId = params.id;

  const targetUser = await db.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Prevent admins from modifying their own account through this endpoint
  if (targetUser.id === adminUser.id) {
    return NextResponse.json(
      { error: "Cannot modify your own account" },
      { status: 400 }
    );
  }

  let updatedUser;

  if (action === "deactivate") {
    updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: { isActive: false },
    });

    await db.adminAction.create({
      data: {
        adminUserId: adminUser.id,
        actionType: "USER_DEACTIVATED",
        targetType: "User",
        targetId: targetUserId,
      },
    });
  } else if (action === "reactivate") {
    updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: { isActive: true },
    });

    await db.adminAction.create({
      data: {
        adminUserId: adminUser.id,
        actionType: "USER_REACTIVATED",
        targetType: "User",
        targetId: targetUserId,
      },
    });
  } else if (action === "makeAdmin") {
    updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: { role: "ADMIN" },
    });

    await db.adminAction.create({
      data: {
        adminUserId: adminUser.id,
        actionType: "USER_PROMOTED_ADMIN",
        targetType: "User",
        targetId: targetUserId,
      },
    });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    },
  });
}
