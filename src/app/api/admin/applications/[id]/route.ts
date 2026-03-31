import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { sendApprovalEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

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

    const { action, reason } = await req.json();
    const profileId = params.id;

    const profile = await db.professionalProfile.findUnique({
      where: { id: profileId },
      include: { user: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    let updatedProfile;

    if (action === "approve") {
      updatedProfile = await db.professionalProfile.update({
        where: { id: profileId },
        data: {
          applicationStatus: "APPROVED",
          approvedAt: new Date(),
          rejectionReason: null,
          rejectedAt: null,
        },
      });

      await db.adminAction.create({
        data: {
          adminUserId: adminUser.id,
          actionType: "APPLICATION_APPROVED",
          targetType: "ProfessionalProfile",
          targetId: profileId,
          reason: reason || null,
        },
      });

      await db.notification.create({
        data: {
          userId: profile.userId,
          type: "APPLICATION_APPROVED",
          title: "Application Approved!",
          body: "Congratulations! Your professional application has been approved. You can now create listings and start accepting bookings.",
          link: "/pro/dashboard",
        },
      });

      // Send approval email (non-blocking)
      sendApprovalEmail(
        profile.user.email,
        profile.user.firstName || profile.displayName || ""
      );

      logger.info("PROVIDER_APPROVED", {
        profileId,
        adminId: adminUser.id,
        proEmail: profile.user.email,
      });
    } else if (action === "reject") {
      if (!reason) {
        return NextResponse.json(
          { error: "Rejection reason is required" },
          { status: 400 }
        );
      }

      updatedProfile = await db.professionalProfile.update({
        where: { id: profileId },
        data: {
          applicationStatus: "REJECTED",
          rejectedAt: new Date(),
          rejectionReason: reason,
        },
      });

      await db.adminAction.create({
        data: {
          adminUserId: adminUser.id,
          actionType: "APPLICATION_REJECTED",
          targetType: "ProfessionalProfile",
          targetId: profileId,
          reason,
        },
      });

      await db.notification.create({
        data: {
          userId: profile.userId,
          type: "APPLICATION_REJECTED",
          title: "Application Update",
          body: `Your professional application was not approved. Reason: ${reason}`,
          link: "/pro/join",
        },
      });

      logger.info("PROVIDER_REJECTED", {
        profileId,
        adminId: adminUser.id,
        reason,
      });
    } else if (action === "suspend") {
      updatedProfile = await db.professionalProfile.update({
        where: { id: profileId },
        data: {
          applicationStatus: "SUSPENDED",
        },
      });

      await db.adminAction.create({
        data: {
          adminUserId: adminUser.id,
          actionType: "APPLICATION_SUSPENDED",
          targetType: "ProfessionalProfile",
          targetId: profileId,
          reason: reason || null,
        },
      });

      logger.warn("PROVIDER_SUSPENDED", {
        profileId,
        adminId: adminUser.id,
        reason: reason || null,
      });
    } else if (action === "re-review") {
      updatedProfile = await db.professionalProfile.update({
        where: { id: profileId },
        data: {
          applicationStatus: "PENDING",
          rejectionReason: null,
          rejectedAt: null,
        },
      });

      await db.adminAction.create({
        data: {
          adminUserId: adminUser.id,
          actionType: "APPLICATION_RE_REVIEW",
          targetType: "ProfessionalProfile",
          targetId: profileId,
          reason: reason || null,
        },
      });

      logger.info("PROVIDER_RE_REVIEW", {
        profileId,
        adminId: adminUser.id,
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    logger.error("ADMIN_APPLICATION_ACTION_FAILED", {
      profileId: params.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/applications/[id]
 * Update portfolio photos for a professional profile.
 * Body: { portfolioPhotos: string[] }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({ where: { clerkId } });
    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { portfolioPhotos } = await req.json();

    if (!Array.isArray(portfolioPhotos)) {
      return NextResponse.json({ error: "portfolioPhotos must be an array" }, { status: 400 });
    }

    if (portfolioPhotos.length > 10) {
      return NextResponse.json({ error: "Maximum 10 photos allowed" }, { status: 400 });
    }

    const profile = await db.professionalProfile.update({
      where: { id: params.id },
      data: { portfolioPhotos },
    });

    logger.info("ADMIN_PHOTOS_UPDATED", {
      profileId: params.id,
      adminId: adminUser.id,
      photoCount: portfolioPhotos.length,
    });

    return NextResponse.json({ profile });
  } catch (error) {
    logger.error("ADMIN_PHOTOS_UPDATE_FAILED", {
      profileId: params.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
