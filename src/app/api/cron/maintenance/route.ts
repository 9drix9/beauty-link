import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PAYOUT_HOLD_HOURS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
    timeout: 30000,
  });
}

/**
 * Scheduled maintenance cron job (runs hourly via Vercel Cron).
 *
 * 1. Expire past LIVE/PAUSED listings
 * 2. Complete bookings 48h after appointment
 * 3. Clean up expired slot holds
 * 4. Notify for expired unbooked listings
 * 5. Auto-release payouts for completed bookings (24h after completion)
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

    // ── 5. Auto-release payouts for completed bookings ──
    // Find completed bookings that haven't been paid out yet,
    // where the booking was completed more than PAYOUT_HOLD_HOURS ago
    const payoutThreshold = new Date(
      now.getTime() - PAYOUT_HOLD_HOURS * 60 * 60 * 1000
    );

    const bookingsToPayOut = await db.booking.findMany({
      where: {
        status: "COMPLETED",
        payoutReleased: false,
        updatedAt: { lt: payoutThreshold },
      },
      include: {
        professional: {
          select: {
            id: true,
            userId: true,
            stripeConnectAccountId: true,
            payoutEnabled: true,
          },
        },
      },
    });

    let autoPayoutsReleased = 0;
    const stripe = getStripe();

    for (const booking of bookingsToPayOut) {
      const pro = booking.professional;

      // Only auto-payout if the pro has Stripe Connect set up
      if (!pro.stripeConnectAccountId || !pro.payoutEnabled || !stripe) {
        // Still mark the payout as released (balance already accumulated)
        // Pro can withdraw manually when they set up Stripe Connect
        await db.booking.update({
          where: { id: booking.id },
          data: { payoutReleased: true, payoutReleasedAt: now },
        });
        autoPayoutsReleased++;
        continue;
      }

      try {
        // Create a Stripe Transfer to the connected account
        const transfer = await stripe.transfers.create({
          amount: booking.discountedPrice,
          currency: "usd",
          destination: pro.stripeConnectAccountId,
          metadata: {
            booking_id: booking.id,
            booking_reference: booking.bookingReference,
          },
        });

        // Record the payout
        await db.payout.create({
          data: {
            professionalId: pro.id,
            bookingId: booking.id,
            amount: booking.discountedPrice,
            payoutType: "STANDARD",
            stripeTransferId: transfer.id,
            status: "COMPLETED",
            completedAt: now,
          },
        });

        // Mark booking as paid out and reduce available balance
        await db.booking.update({
          where: { id: booking.id },
          data: { payoutReleased: true, payoutReleasedAt: now },
        });

        await db.professionalProfile.update({
          where: { id: pro.id },
          data: {
            availableBalance: { decrement: booking.discountedPrice },
          },
        });

        // Notify the pro
        await db.notification.create({
          data: {
            userId: pro.userId,
            type: "PAYOUT_SENT",
            title: "Payout Released",
            body: `$${(booking.discountedPrice / 100).toFixed(2)} for "${booking.serviceName}" has been sent to your bank account.`,
            link: "/pro/earnings",
          },
        });

        autoPayoutsReleased++;
      } catch (payoutError) {
        console.error(
          `Auto-payout failed for booking ${booking.id}:`,
          payoutError
        );

        // Create a failed payout record
        await db.payout.create({
          data: {
            professionalId: pro.id,
            bookingId: booking.id,
            amount: booking.discountedPrice,
            payoutType: "STANDARD",
            status: "FAILED",
            failureReason:
              payoutError instanceof Error
                ? payoutError.message
                : "Unknown error",
          },
        });

        await db.notification.create({
          data: {
            userId: pro.userId,
            type: "PAYOUT_FAILED",
            title: "Payout Failed",
            body: `Payout for "${booking.serviceName}" failed. Please check your payment settings.`,
            link: "/pro/settings",
          },
        });
      }
    }
    results.autoPayoutsReleased = autoPayoutsReleased;

    logger.info("CRON_MAINTENANCE_COMPLETED", results);

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    });
  } catch (error) {
    logger.error("CRON_MAINTENANCE_FAILED", { error: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json(
      { error: "Maintenance job failed" },
      { status: 500 }
    );
  }
}
