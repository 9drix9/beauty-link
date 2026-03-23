import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { duplicateListingSchema } from "@/lib/validators";
import { validateDiscount } from "@/lib/pricing";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const baseUser = await getApiUser();
    if (!baseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: baseUser.id },
      include: { professionalProfile: true },
    });

    if (!user?.professionalProfile) {
      return NextResponse.json({ error: "Not a professional" }, { status: 403 });
    }

    if (user.professionalProfile.applicationStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Your professional account is not yet approved" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = duplicateListingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Fetch source listing
    const source = await db.appointmentListing.findFirst({
      where: {
        id: data.sourceListingId,
        professionalId: user.professionalProfile.id,
      },
    });

    if (!source) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const discountedPrice = data.discountedPriceCents ?? source.discountedPrice;

    // Validate discount for paid listings
    if (!source.isModelCall && source.originalPrice > 0) {
      const discountCheck = validateDiscount(source.originalPrice, discountedPrice);
      if (!discountCheck.valid) {
        return NextResponse.json({ error: discountCheck.error }, { status: 400 });
      }
    }

    const listing = await db.appointmentListing.create({
      data: {
        professionalId: user.professionalProfile.id,
        templateId: source.templateId,
        serviceCategory: source.serviceCategory,
        serviceName: source.serviceName,
        description: source.description,
        whatsIncluded: source.whatsIncluded,
        appointmentDate: new Date(data.appointmentDate + "T00:00:00"),
        appointmentTime: data.appointmentTime,
        durationMinutes: source.durationMinutes,
        originalPrice: source.originalPrice,
        discountedPrice: discountedPrice,
        maxClients: source.maxClients,
        locationAddress: source.locationAddress,
        listingPhotoUrl: source.listingPhotoUrl,
        launchZone: source.launchZone,
        isModelCall: source.isModelCall,
        skillLevel: source.skillLevel,
        modelRequirements: source.modelRequirements,
        status: "LIVE",
      },
    });

    logger.info("LISTING_DUPLICATED", {
      listingId: listing.id,
      sourceListingId: source.id,
      professionalId: user.professionalProfile.id,
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    logger.error("LISTING_DUPLICATE_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
