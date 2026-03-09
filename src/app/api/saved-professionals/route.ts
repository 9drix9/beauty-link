import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { professionalId } = body;

    if (!professionalId) {
      return NextResponse.json(
        { error: "professionalId is required" },
        { status: 400 }
      );
    }

    // Verify the professional profile exists
    const professional = await db.professionalProfile.findUnique({
      where: { id: professionalId },
      select: { id: true },
    });

    if (!professional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existing = await db.savedProfessional.findUnique({
      where: {
        customerId_professionalId: {
          customerId: user.id,
          professionalId,
        },
      },
    });

    if (existing) {
      // Unsave
      await db.savedProfessional.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false });
    }

    // Save
    await db.savedProfessional.create({
      data: {
        customerId: user.id,
        professionalId,
      },
    });

    return NextResponse.json({ saved: true }, { status: 201 });
  } catch (error) {
    console.error("Error toggling saved professional:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedProfessionals = await db.savedProfessional.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        professional: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
    });

    const serialized = savedProfessionals.map((sp) => ({
      id: sp.id,
      professionalId: sp.professionalId,
      createdAt: sp.createdAt.toISOString(),
      professional: {
        id: sp.professional.id,
        displayName: sp.professional.displayName,
        bio: sp.professional.bio,
        city: sp.professional.city,
        state: sp.professional.state,
        avgRating: sp.professional.avgRating,
        totalReviews: sp.professional.totalReviews,
        servicesOffered: sp.professional.servicesOffered,
        portfolioPhotos: sp.professional.portfolioPhotos,
        user: sp.professional.user,
      },
    }));

    return NextResponse.json({ savedProfessionals: serialized });
  } catch (error) {
    console.error("Error fetching saved professionals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
