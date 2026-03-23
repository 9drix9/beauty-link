import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { serviceTemplateSchema } from "@/lib/validators";
import { ServiceCategory, SkillLevel } from "@prisma/client";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
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

    const template = await db.serviceTemplate.findFirst({
      where: {
        id: params.id,
        professionalProfileId: user.professionalProfile.id,
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    logger.error("TEMPLATE_FETCH_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const existing = await db.serviceTemplate.findFirst({
      where: {
        id: params.id,
        professionalProfileId: user.professionalProfile.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = serviceTemplateSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const locationAddress = [
      data.addressLine1 ?? existing.addressLine1,
      data.city ?? existing.city,
      data.state ?? existing.state,
      data.zipCode ?? existing.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    const template = await db.serviceTemplate.update({
      where: { id: params.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.serviceCategory !== undefined && { serviceCategory: data.serviceCategory as ServiceCategory }),
        ...(data.subCategory !== undefined && { subCategory: data.subCategory || null }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.whatsIncluded !== undefined && { whatsIncluded: data.whatsIncluded || [] }),
        ...(data.durationMinutes !== undefined && { durationMinutes: data.durationMinutes }),
        ...(data.coverPhotoUrl !== undefined && { coverPhotoUrl: data.coverPhotoUrl || null }),
        ...(data.originalPriceCents !== undefined && { originalPriceCents: data.originalPriceCents || null }),
        ...(data.discountedPriceCents !== undefined && { discountedPriceCents: data.discountedPriceCents || null }),
        ...(data.isModelCall !== undefined && { isModelCall: data.isModelCall }),
        ...(data.skillLevel !== undefined && { skillLevel: data.skillLevel ? (data.skillLevel as SkillLevel) : null }),
        ...(data.modelRequirements !== undefined && { modelRequirements: data.modelRequirements || null }),
        ...(data.addressLine1 !== undefined && { addressLine1: data.addressLine1 || null }),
        ...(data.city !== undefined && { city: data.city || null }),
        ...(data.state !== undefined && { state: data.state || null }),
        ...(data.zipCode !== undefined && { zipCode: data.zipCode || null }),
        ...(data.launchZone !== undefined && { launchZone: data.launchZone || null }),
        ...(data.maxClients !== undefined && { maxClients: data.maxClients }),
        locationAddress: locationAddress || null,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    logger.error("TEMPLATE_UPDATE_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
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

    const existing = await db.serviceTemplate.findFirst({
      where: {
        id: params.id,
        professionalProfileId: user.professionalProfile.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    await db.serviceTemplate.delete({ where: { id: params.id } });

    logger.info("TEMPLATE_DELETED", { templateId: params.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("TEMPLATE_DELETE_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
