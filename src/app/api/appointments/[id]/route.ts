import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await db.appointmentListing.findUnique({
      where: { id: params.id },
      include: {
        professional: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
        service: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ listing });
  } catch (err) {
    console.error("Error fetching appointment listing:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
