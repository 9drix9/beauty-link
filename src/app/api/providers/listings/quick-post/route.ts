import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { quickPostSchema } from "@/lib/validators";
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
    const parsed = quickPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Fetch template
    const template = await db.serviceTemplate.findFirst({
      where: {
        id: data.templateId,
        professionalProfileId: user.professionalProfile.id,
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Determine pricing
    const originalPriceCents = template.originalPriceCents || 0;
    const discountedPriceCents = data.discountedPriceCents ?? template.discountedPriceCents ?? 0;

    // Validate discount for paid listings
    if (!template.isModelCall && originalPriceCents > 0) {
      const discountCheck = validateDiscount(originalPriceCents, discountedPriceCents);
      if (!discountCheck.valid) {
        return NextResponse.json({ error: discountCheck.error }, { status: 400 });
      }
    }

    const listing = await db.$transaction(async (tx) => {
      const created = await tx.appointmentListing.create({
        data: {
          professionalId: user.professionalProfile!.id,
          templateId: template.id,
          serviceCategory: template.serviceCategory,
          serviceName: template.title,
          description: template.description,
          whatsIncluded: template.whatsIncluded,
          appointmentDate: new Date(data.appointmentDate + "T00:00:00"),
          appointmentTime: data.appointmentTime,
          durationMinutes: template.durationMinutes,
          originalPrice: originalPriceCents,
          discountedPrice: discountedPriceCents,
          maxClients: data.maxClients ?? template.maxClients,
          locationAddress: template.locationAddress,
          listingPhotoUrl: template.coverPhotoUrl,
          launchZone: template.launchZone,
          isModelCall: template.isModelCall,
          skillLevel: template.skillLevel,
          modelRequirements: template.modelRequirements,
          status: "LIVE",
        },
      });

      // Increment template usage
      await tx.serviceTemplate.update({
        where: { id: template.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });

      return created;
    });

    logger.info("QUICK_POST_CREATED", {
      listingId: listing.id,
      templateId: template.id,
      professionalId: user.professionalProfile.id,
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    logger.error("QUICK_POST_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
