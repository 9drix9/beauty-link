import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = auth();

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
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ profile: updatedProfile });
}
