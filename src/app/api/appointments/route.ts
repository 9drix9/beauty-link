import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const zone = searchParams.get("zone");
  const dateWindow = searchParams.get("dateWindow") || "week";

  const now = new Date();
  const endDate = new Date();

  switch (dateWindow) {
    case "today":
      endDate.setHours(23, 59, 59, 999);
      break;
    case "3days":
      endDate.setDate(endDate.getDate() + 3);
      break;
    case "week":
    default:
      endDate.setDate(endDate.getDate() + 7);
      break;
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: "OPEN",
        startAt: {
          gte: now,
          lte: endDate,
        },
        ...(category && {
          service: { category: category as never },
        }),
        ...(zone && { launchZone: zone }),
      },
      include: {
        service: true,
        professionalProfile: {
          include: {
            user: {
              select: { name: true, profileImageUrl: true },
            },
          },
        },
      },
      orderBy: { startAt: "asc" },
      take: 50,
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
