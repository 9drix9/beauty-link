import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { validateDiscount } from "@/lib/pricing";

async function getAuthenticatedPro() {
  const baseUser = await getApiUser();
  if (!baseUser) return null;

  const user = await db.user.findUnique({
    where: { id: baseUser.id },
    include: { professionalProfile: true },
  });

  if (!user?.professionalProfile) return null;
  return user.professionalProfile;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const profile = await getAuthenticatedPro();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listing = await db.appointmentListing.findUnique({
    where: { id: params.id },
  });

  if (!listing || listing.professionalId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(listing);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const profile = await getAuthenticatedPro();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listing = await db.appointmentListing.findUnique({
    where: { id: params.id },
  });

  if (!listing || listing.professionalId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();

  // Handle status transitions
  if (body.status) {
    const currentStatus = listing.status;
    const newStatus = body.status;

    const validTransitions: Record<string, string[]> = {
      DRAFT: ["LIVE", "CANCELLED"],
      LIVE: ["PAUSED", "CANCELLED"],
      PAUSED: ["LIVE", "CANCELLED"],
      BOOKED: ["CANCELLED"],
      EXPIRED: ["CANCELLED"],
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Cannot transition from ${currentStatus} to ${newStatus}`,
        },
        { status: 400 }
      );
    }
  }

  // Only allow field edits on DRAFT or LIVE listings
  const editableStatuses = ["DRAFT", "LIVE"];
  const hasFieldUpdates = Object.keys(body).some((k) => k !== "status");
  if (hasFieldUpdates && !editableStatuses.includes(listing.status)) {
    return NextResponse.json(
      { error: "Can only edit DRAFT or LIVE listings" },
      { status: 400 }
    );
  }

  // Build update data
  const updateData: Record<string, unknown> = {};

  if (body.status) updateData.status = body.status;
  if (body.serviceName) updateData.serviceName = body.serviceName;
  if (body.serviceCategory) updateData.serviceCategory = body.serviceCategory;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.whatsIncluded) updateData.whatsIncluded = body.whatsIncluded;
  if (body.appointmentDate)
    updateData.appointmentDate = new Date(body.appointmentDate + "T00:00:00");
  if (body.appointmentTime) updateData.appointmentTime = body.appointmentTime;
  if (body.durationMinutes) updateData.durationMinutes = body.durationMinutes;
  if (body.maxClients) updateData.maxClients = body.maxClients;
  if (body.locationAddress) updateData.locationAddress = body.locationAddress;
  if (body.launchZone !== undefined) updateData.launchZone = body.launchZone;
  if (body.listingPhotoUrl !== undefined)
    updateData.listingPhotoUrl = body.listingPhotoUrl;

  // Price updates with validation
  if (body.originalPrice !== undefined || body.discountedPrice !== undefined) {
    const newOriginal = body.originalPrice ?? listing.originalPrice;
    const newDiscounted = body.discountedPrice ?? listing.discountedPrice;

    const discountCheck = validateDiscount(newOriginal, newDiscounted);
    if (!discountCheck.valid) {
      return NextResponse.json(
        { error: discountCheck.error },
        { status: 400 }
      );
    }

    if (body.originalPrice !== undefined)
      updateData.originalPrice = body.originalPrice;
    if (body.discountedPrice !== undefined)
      updateData.discountedPrice = body.discountedPrice;
  }

  const updated = await db.appointmentListing.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const profile = await getAuthenticatedPro();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listing = await db.appointmentListing.findUnique({
    where: { id: params.id },
    include: { bookings: { where: { status: "CONFIRMED" } } },
  });

  if (!listing || listing.professionalId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Cancel the listing and any active bookings in a transaction
  await db.$transaction(async (tx) => {
    // Cancel active bookings
    if (listing.bookings.length > 0) {
      await tx.booking.updateMany({
        where: {
          appointmentListingId: listing.id,
          status: "CONFIRMED",
        },
        data: {
          status: "CANCELLED_BY_PRO",
          cancelledAt: new Date(),
          cancellationReason: "Listing cancelled by provider",
        },
      });
    }

    // Set listing status to CANCELLED
    await tx.appointmentListing.update({
      where: { id: listing.id },
      data: { status: "CANCELLED" },
    });
  });

  return NextResponse.json({ success: true });
}
