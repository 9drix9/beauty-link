import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate with schema
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError.message },
      { status: 400 }
    );
  }

  const { bookingId, rating, comment } = parsed.data;
  const wouldRebook = body.wouldRebook ?? null;

  // Verify booking exists, belongs to user, is COMPLETED, and has no review
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      review: { select: { id: true } },
    },
  });

  if (!booking || booking.customerId !== user.id) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  if (booking.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Only completed bookings can be reviewed" },
      { status: 400 }
    );
  }

  if (booking.review) {
    return NextResponse.json(
      { error: "You have already reviewed this booking" },
      { status: 409 }
    );
  }

  // Create review and update professional profile in a transaction
  const review = await db.$transaction(async (tx) => {
    // 1. Create the review
    const newReview = await tx.review.create({
      data: {
        bookingId,
        customerId: user.id,
        professionalId: booking.professionalId,
        starRating: rating,
        comment,
        wouldRebook: typeof wouldRebook === "boolean" ? wouldRebook : null,
      },
    });

    // 2. Recalculate and update professional profile average rating
    const profile = await tx.professionalProfile.findUnique({
      where: { id: booking.professionalId },
      select: { avgRating: true, totalReviews: true },
    });

    if (profile) {
      const newTotal = profile.totalReviews + 1;
      const newAvg =
        (profile.avgRating * profile.totalReviews + rating) / newTotal;

      await tx.professionalProfile.update({
        where: { id: booking.professionalId },
        data: {
          avgRating: Math.round(newAvg * 100) / 100,
          totalReviews: newTotal,
        },
      });
    }

    // 3. Clear the pending review intercept flag
    await tx.user.update({
      where: { id: user.id },
      data: { pendingReviewIntercept: false },
    });

    return newReview;
  });

  logger.info("REVIEW_SUBMITTED", {
    reviewId: review.id,
    bookingId,
    customerId: user.id,
    professionalId: booking.professionalId,
    rating,
  });

  return NextResponse.json(review, { status: 201 });
  } catch (error) {
    logger.error("REVIEW_SUBMIT_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const professionalId = searchParams.get("professionalId");

    if (!professionalId) {
      return NextResponse.json(
        { error: "professionalId is required" },
        { status: 400 }
      );
    }

    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
      50
    );
    const cursor = searchParams.get("cursor");

    const reviews = await db.review.findMany({
      where: {
        professionalId,
        isHidden: false,
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (reviews.length > limit) {
      const lastItem = reviews.pop();
      nextCursor = lastItem!.id;
    }

    const serializedReviews = reviews.map((review) => ({
      id: review.id,
      starRating: review.starRating,
      comment: review.comment,
      wouldRebook: review.wouldRebook,
      createdAt: review.createdAt.toISOString(),
      customer: {
        firstName: review.customer.firstName,
        lastName: review.customer.lastName,
        profilePhotoUrl: review.customer.profilePhotoUrl,
      },
    }));

    return NextResponse.json({
      reviews: serializedReviews,
      nextCursor,
    });
  } catch (error) {
    logger.error("REVIEWS_FETCH_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
