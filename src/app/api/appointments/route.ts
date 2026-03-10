import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ServiceCategory, ListingStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const date = searchParams.get("date");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const zone = searchParams.get("zone");
    const cursor = searchParams.get("cursor");
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "20", 10) || 20, 1),
      100
    );

    // Build where clause
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const where: Record<string, unknown> = {
      status: ListingStatus.LIVE,
      appointmentDate: { gte: today },
    };

    // Category filter
    if (category && Object.values(ServiceCategory).includes(category as ServiceCategory)) {
      where.serviceCategory = category as ServiceCategory;
    }

    // Search filter
    if (search) {
      where.OR = [
        { serviceName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Date filter
    if (date === "today") {
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);
      where.appointmentDate = { gte: today, lte: endOfToday };
    } else if (date === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);
      where.appointmentDate = { gte: tomorrow, lte: endOfTomorrow };
    } else if (date === "weekend") {
      const dayOfWeek = today.getDay(); // 0 = Sunday
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + (6 - dayOfWeek));
      saturday.setHours(0, 0, 0, 0);
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      sunday.setHours(23, 59, 59, 999);
      where.appointmentDate = { gte: saturday, lte: sunday };
    }

    // Price filters
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.gte = parseInt(minPrice, 10);
      if (maxPrice) priceFilter.lte = parseInt(maxPrice, 10);
      where.discountedPrice = priceFilter;
    }

    // Zone filter
    if (zone) {
      where.launchZone = zone;
    }

    // Build orderBy
    let orderBy: Record<string, unknown> | Record<string, unknown>[];
    switch (sort) {
      case "price_asc":
        orderBy = { discountedPrice: "asc" };
        break;
      case "price_desc":
        orderBy = { discountedPrice: "desc" };
        break;
      case "soonest":
        orderBy = [{ appointmentDate: "asc" }, { appointmentTime: "asc" }];
        break;
      case "rating":
        orderBy = { professional: { avgRating: "desc" } };
        break;
      default:
        // "recommended"
        orderBy = [
          { professional: { isFeatured: "desc" } },
          { appointmentDate: "asc" },
        ];
        break;
    }

    // Cursor-based pagination
    const paginationArgs: Record<string, unknown> = {};
    if (cursor) {
      paginationArgs.cursor = { id: cursor };
      paginationArgs.skip = 1;
    }

    const listings = await db.appointmentListing.findMany({
      where,
      orderBy,
      take: limit,
      ...paginationArgs,
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
      },
    });

    const nextCursor =
      listings.length === limit ? listings[listings.length - 1].id : null;

    // Log search query for analytics (non-blocking)
    if (search || category) {
      db.searchQuery.create({
        data: {
          query: search || "",
          category: category || null,
          zone: zone || null,
          resultCount: listings.length,
        },
      }).catch(() => {}); // Fire and forget
    }

    return NextResponse.json({ listings, nextCursor });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
