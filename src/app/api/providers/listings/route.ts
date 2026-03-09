import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { ServiceCategory } from "@prisma/client";
import { createListingSchema } from "@/lib/validators";
import { validateDiscount } from "@/lib/pricing";

export async function GET() {
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
}

export async function POST(request: Request) {
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

  // Validate with schema
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
      launchZone: body.launchZone || null,
      status,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
