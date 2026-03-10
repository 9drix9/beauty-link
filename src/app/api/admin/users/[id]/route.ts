import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

      logger.warn("USER_DEACTIVATED", {
        targetUserId,
        adminId: adminUser.id,
        targetEmail: targetUser.email,
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

      logger.info("USER_REACTIVATED", {
        targetUserId,
        adminId: adminUser.id,
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

      logger.warn("USER_PROMOTED_ADMIN", {
        targetUserId,
        adminId: adminUser.id,
        targetEmail: targetUser.email,
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
  } catch (error) {
    logger.error("ADMIN_USER_ACTION_FAILED", {
      targetUserId: params.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
