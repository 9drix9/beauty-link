import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { serviceTemplateSchema } from "@/lib/validators";
import { ServiceCategory, SkillLevel } from "@prisma/client";
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

    const templates = await db.serviceTemplate.findMany({
      where: { professionalProfileId: user.professionalProfile.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch (error) {
    logger.error("TEMPLATES_FETCH_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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

    const body = await request.json();
    const parsed = serviceTemplateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const locationAddress = [data.addressLine1, data.city, data.state, data.zipCode]
      .filter(Boolean)
      .join(", ");

    const template = await db.serviceTemplate.create({
      data: {
        professionalProfileId: user.professionalProfile.id,
        name: data.name,
        serviceCategory: data.serviceCategory as ServiceCategory,
        subCategory: data.subCategory || null,
        title: data.title,
        description: data.description || null,
        whatsIncluded: data.whatsIncluded || [],
        durationMinutes: data.durationMinutes,
        coverPhotoUrl: data.coverPhotoUrl || null,
        originalPriceCents: data.originalPriceCents || null,
        discountedPriceCents: data.discountedPriceCents || null,
        isModelCall: data.isModelCall || false,
        skillLevel: data.skillLevel ? (data.skillLevel as SkillLevel) : null,
        modelRequirements: data.modelRequirements || null,
        locationAddress: locationAddress || null,
        addressLine1: data.addressLine1 || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        launchZone: data.launchZone || null,
        maxClients: data.maxClients || 1,
      },
    });

    logger.info("TEMPLATE_CREATED", {
      templateId: template.id,
      professionalId: user.professionalProfile.id,
      name: template.name,
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    logger.error("TEMPLATE_CREATE_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
