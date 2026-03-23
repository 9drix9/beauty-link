import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { ServiceCategory } from "@prisma/client";
import { createListingSchema, createModelCallSchema } from "@/lib/validators";
import { validateDiscount } from "@/lib/pricing";
import { SkillLevel } from "@prisma/client";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
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

    const listings = await db.appointmentListing.findMany({
      where: { professionalId: user.professionalProfile.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(listings);
  } catch (error) {
    logger.error("LISTINGS_FETCH_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const isModelCall = body.isModelCall === true;

    if (isModelCall) {
      // Model call validation (no pricing)
      const parsed = createModelCallSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0].message },
          { status: 400 }
        );
      }

      const data = parsed.data;
      const status = body.status === "DRAFT" ? "DRAFT" : "LIVE";
      const locationAddress =
        body.locationAddress ||
        [data.addressLine1, data.city, data.state, data.zipCode]
          .filter(Boolean)
          .join(", ");

      const listing = await db.appointmentListing.create({
        data: {
          professionalId: user.professionalProfile.id,
          serviceCategory: data.serviceCategory as ServiceCategory,
          serviceName: data.title,
          description: data.description,
          whatsIncluded: data.whatsIncluded || [],
          appointmentDate: new Date(data.appointmentDate + "T00:00:00"),
          appointmentTime: data.appointmentTime,
          durationMinutes: data.durationMinutes,
          originalPrice: 0,
          discountedPrice: 0,
          maxClients: data.maxClients,
          locationAddress,
          listingPhotoUrl: body.listingPhotoUrl || null,
          launchZone: body.launchZone || null,
          isModelCall: true,
          skillLevel: data.skillLevel as SkillLevel,
          modelRequirements: data.modelRequirements || null,
          status,
        },
      });

      logger.info("MODEL_CALL_CREATED", {
        listingId: listing.id,
        professionalId: user.professionalProfile.id,
        serviceName: listing.serviceName,
        skillLevel: listing.skillLevel,
        status,
      });

      return NextResponse.json(listing, { status: 201 });
    }

    // Regular paid listing validation
    const parsed = createListingSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Additional discount validation
    const discountCheck = validateDiscount(
      data.originalPriceCents,
      data.discountedPriceCents
    );
    if (!discountCheck.valid) {
      return NextResponse.json(
        { error: discountCheck.error },
        { status: 400 }
      );
    }

    // Validate status
    const status = body.status === "DRAFT" ? "DRAFT" : "LIVE";

    // Build location address
    const locationAddress =
      body.locationAddress ||
      [data.addressLine1, data.city, data.state, data.zipCode]
        .filter(Boolean)
        .join(", ");

    const listing = await db.appointmentListing.create({
      data: {
        professionalId: user.professionalProfile.id,
        templateId: body.templateId || null,
        serviceCategory: data.serviceCategory as ServiceCategory,
        serviceName: data.title,
        description: data.description,
        whatsIncluded: data.whatsIncluded || [],
        appointmentDate: new Date(data.appointmentDate + "T00:00:00"),
        appointmentTime: data.appointmentTime,
        durationMinutes: data.durationMinutes,
        originalPrice: data.originalPriceCents,
        discountedPrice: data.discountedPriceCents,
        maxClients: data.maxClients,
        locationAddress,
        listingPhotoUrl: body.listingPhotoUrl || null,
        launchZone: body.launchZone || null,
        status,
      },
    });

    // If templateId provided, increment usage
    if (body.templateId) {
      await db.serviceTemplate.updateMany({
        where: {
          id: body.templateId,
          professionalProfileId: user.professionalProfile.id,
        },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });
    }

    // Auto-save as template if requested
    if (body.saveAsTemplate && body.templateName) {
      const locationAddress = [data.addressLine1, data.city, data.state, data.zipCode]
        .filter(Boolean)
        .join(", ");

      await db.serviceTemplate.create({
        data: {
          professionalProfileId: user.professionalProfile.id,
          name: body.templateName,
          serviceCategory: data.serviceCategory as ServiceCategory,
          subCategory: body.subCategory || null,
          title: data.title,
          description: data.description || null,
          whatsIncluded: data.whatsIncluded || [],
          durationMinutes: data.durationMinutes,
          coverPhotoUrl: body.listingPhotoUrl || null,
          originalPriceCents: data.originalPriceCents,
          discountedPriceCents: data.discountedPriceCents,
          locationAddress: locationAddress || null,
          addressLine1: data.addressLine1 || null,
          city: data.city || null,
          state: data.state || null,
          zipCode: data.zipCode || null,
          launchZone: body.launchZone || null,
          maxClients: data.maxClients || 1,
        },
      });
    }

    logger.info("LISTING_CREATED", {
      listingId: listing.id,
      professionalId: user.professionalProfile.id,
      serviceName: listing.serviceName,
      status,
      discountedPrice: listing.discountedPrice,
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    logger.error("LISTING_CREATE_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
