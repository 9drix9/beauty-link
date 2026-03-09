import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Scheduled maintenance cron job (runs hourly via Vercel Cron).
 *
 * 1. Expire past LIVE/PAUSED listings
 * 2. Complete bookings 48h after appointment
 * 3. Clean up expired slot holds
 * 4. Set pending review intercept for completed bookings
 */
export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results: Record<string, number> = {};

  try {
    // ── 1. Expire past listings ──
    // Mark LIVE/PAUSED listings as EXPIRED if their appointment date has passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: expiredListings } =
      await db.appointmentListing.updateMany({
        where: {
          status: { in: ["LIVE", "PAUSED"] },
          appointmentDate: { lt: today },
        },
        data: { status: "EXPIRED" },
      });
    results.expiredListings = expiredListings;

    // ── 2. Complete bookings 48h after appointment ──
    // Find CONFIRMED bookings where the appointment ended >48 hours ago
    const completionThreshold = new Date(
      now.getTime() - 48 * 60 * 60 * 1000
    );

    const bookingsToComplete = await db.booking.findMany({
      where: {
        status: "CONFIRMED",
        appointmentDate: { lt: completionThreshold },
      },
      select: {
        id: true,
        customerId: true,
        professionalId: true,
        discountedPrice: true,
        serviceName: true,
      },
    });

    if (bookingsToComplete.length > 0) {
      // Mark bookings as completed
      const { count: completedBookings } = await db.booking.updateMany({
        where: {
          id: { in: bookingsToComplete.map((b) => b.id) },
        },
        data: { status: "COMPLETED" },
      });
      results.completedBookings = completedBookings;

      // Set pending review intercept for each customer
      const customerIds = Array.from(
        new Set(bookingsToComplete.map((b) => b.customerId))
      );
      await db.user.updateMany({
        where: { id: { in: customerIds } },
        data: { pendingReviewIntercept: true },
      });

      // Update professional earnings
      for (const booking of bookingsToComplete) {
        await db.professionalProfile.update({
          where: { id: booking.professionalId },
          data: {
            lifetimeEarnings: { increment: booking.discountedPrice },
            availableBalance: { increment: booking.discountedPrice },
          },
        });
      }

      // Create review reminder notifications
      for (const booking of bookingsToComplete) {
        await db.notification.create({
          data: {
            userId: booking.customerId,
            type: "REVIEW_REMINDER",
            title: "How was your appointment?",
            body: `Your ${booking.serviceName} appointment is complete. Leave a review to help the community!`,
            link: `/review/${booking.id}`,
          },
        });
      }
    } else {
      results.completedBookings = 0;
    }

    // ── 3. Clean up expired slot holds ──
    const { count: cleanedHolds } = await db.slotHold.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    results.cleanedHolds = cleanedHolds;

    // ── 4. Expire unbooked listing notifications ──
    // Notify professionals whose listings expired without bookings
    const recentlyExpired = await db.appointmentListing.findMany({
      where: {
        status: "EXPIRED",
        bookedCount: 0,
        updatedAt: {
          // Only notify for listings that expired in the last hour
          gte: new Date(now.getTime() - 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        serviceName: true,
        professional: { select: { userId: true } },
      },
    });

    for (const listing of recentlyExpired) {
      await db.notification.create({
        data: {
          userId: listing.professional.userId,
          type: "LISTING_EXPIRED_UNBOOKED",
          title: "Listing Expired",
          body: `Your ${listing.serviceName} listing expired without any bookings. Consider adjusting your pricing or timing.`,
          link: `/pro/appointments`,
        },
      });
    }
    results.expiredNotifications = recentlyExpired.length;

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    });
  } catch (error) {
    console.error("Cron maintenance error:", error);
    return NextResponse.json(
      { error: "Maintenance job failed" },
      { status: 500 }
    );
  }
}
