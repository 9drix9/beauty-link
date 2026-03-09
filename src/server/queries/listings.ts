import { db } from "@/lib/db";
import { Prisma, ServiceCategory } from "@prisma/client";

interface GetPublishedListingsOptions {
  category?: string;
  search?: string;
  sort?: string;
  dateFilter?: string;
  minPrice?: number;
  maxPrice?: number;
  launchZone?: string;
  limit?: number;
  cursor?: string;
}

export async function getPublishedListings(options: GetPublishedListingsOptions = {}) {
  const {
    category,
    search,
    sort = "recommended",
    dateFilter,
    minPrice,
    maxPrice,
    launchZone,
    limit = 20,
    cursor,
  } = options;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where: Prisma.AppointmentListingWhereInput = {
    status: "LIVE",
    appointmentDate: { gte: today },
  };

  if (category) {
    where.serviceCategory = category as ServiceCategory;
  }

  if (search) {
    where.OR = [
      { serviceName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { professional: { displayName: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (dateFilter) {
    const filterDate = new Date(dateFilter);
    filterDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);
    where.appointmentDate = { gte: filterDate, lt: nextDay };
  }

  if (minPrice !== undefined) {
    where.discountedPrice = { ...((where.discountedPrice as object) ?? {}), gte: minPrice };
  }

  if (maxPrice !== undefined) {
    where.discountedPrice = { ...((where.discountedPrice as object) ?? {}), lte: maxPrice };
  }

  if (launchZone) {
    where.launchZone = launchZone;
  }

  let orderBy: Prisma.AppointmentListingOrderByWithRelationInput | Prisma.AppointmentListingOrderByWithRelationInput[];

  switch (sort) {
    case "price_asc":
      orderBy = { discountedPrice: "asc" };
      break;
    case "price_desc":
      orderBy = { discountedPrice: "desc" };
      break;
    case "soonest":
      orderBy = { appointmentDate: "asc" };
      break;
    case "rating":
      orderBy = { professional: { avgRating: "desc" } };
      break;
    case "recommended":
    default:
      orderBy = [
        { professional: { isFeatured: "desc" } },
        { appointmentDate: "asc" },
      ];
      break;
  }

  const listings = await db.appointmentListing.findMany({
    where,
    orderBy,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: {
      professional: {
        include: {
          user: true,
        },
      },
      _count: {
        select: { bookings: true },
      },
    },
  });

  let nextCursor: string | undefined;

  if (listings.length > limit) {
    const nextItem = listings.pop()!;
    nextCursor = nextItem.id;
  }

  return { listings, nextCursor };
}

export async function getListingById(id: string) {
  const listing = await db.appointmentListing.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    include: {
      professional: {
        include: {
          user: true,
        },
      },
      service: true,
    },
  });

  return listing;
}

export async function getListingsByCategory(category: string, limit: number = 20) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const listings = await db.appointmentListing.findMany({
    where: {
      status: "LIVE",
      serviceCategory: category as ServiceCategory,
      appointmentDate: { gte: today },
    },
    orderBy: { appointmentDate: "asc" },
    take: limit,
    include: {
      professional: {
        include: {
          user: true,
        },
      },
    },
  });

  return listings;
}

export async function getFeaturedListings(limit: number = 6) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const listings = await db.appointmentListing.findMany({
    where: {
      status: "LIVE",
      appointmentDate: { gte: today },
      professional: { isFeatured: true },
    },
    orderBy: { appointmentDate: "asc" },
    take: limit,
    include: {
      professional: {
        include: {
          user: true,
        },
      },
    },
  });

  return listings;
}

export async function getUrgentListings(limit: number = 8) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 2);

  const listings = await db.appointmentListing.findMany({
    where: {
      status: "LIVE",
      appointmentDate: { gte: today, lt: tomorrow },
    },
    orderBy: [
      { appointmentDate: "asc" },
      { appointmentTime: "asc" },
    ],
    take: limit,
    include: {
      professional: {
        include: {
          user: true,
        },
      },
    },
  });

  return listings;
}

export async function getListingCountsByCategory(): Promise<Record<string, number>> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const counts = await db.appointmentListing.groupBy({
    by: ["serviceCategory"],
    where: {
      status: "LIVE",
      appointmentDate: { gte: today },
    },
    _count: {
      _all: true,
    },
  });

  const result: Record<string, number> = {};

  for (const entry of counts) {
    result[entry.serviceCategory] = entry._count._all;
  }

  return result;
}
